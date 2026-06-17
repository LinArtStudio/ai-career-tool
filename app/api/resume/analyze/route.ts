import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseResume } from "@/lib/resume/parser";
import { analyzeResume } from "@/lib/resume/analyzer";
import { checkUsageLimit, isPaidUser, recordUsage } from "@/lib/auth/limits";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 检查付费状态和使用限制
    const paid = await isPaidUser(supabase, user.id);
    if (!paid) {
      const { allowed, remaining, limit } = await checkUsageLimit(supabase, user.id, "resume");
      if (!allowed) {
        return NextResponse.json(
          { error: `免费版每天${limit}次，升级解锁无限使用`, upgrade: true, remaining: 0 },
          { status: 403 }
        );
      }
    }

    // 解析上传的简历
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "请上传简历文件" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseResume(buffer);

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "无法从文件中提取足够文本，请确认简历内容" },
        { status: 400 }
      );
    }

    // AI分析
    const result = await analyzeResume(text);

    // 保存结果
    const { data: record } = await supabase
      .from("resume_results")
      .insert({
        user_id: user.id,
        original_text: text.slice(0, 2000),
        score: result.score,
        dimensions: result.dimensions,
        suggestions: result.top_issues,
        optimized_lines: result.optimized_lines,
      })
      .select("id")
      .single();

    // 记录使用
    await recordUsage(supabase, user.id, "resume");

    return NextResponse.json({
      id: record?.id,
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "分析失败，请重试";
    console.error("Resume analyze error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
