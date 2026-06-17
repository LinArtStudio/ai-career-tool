import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQuestions } from "@/lib/interview/generator";
import { checkUsageLimit, isPaidUser, recordUsage } from "@/lib/auth/limits";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 检查限制
    const paid = await isPaidUser(supabase, user.id);
    if (!paid) {
      const { allowed, limit } = await checkUsageLimit(supabase, user.id, "interview");
      if (!allowed) {
        return NextResponse.json(
          { error: `免费版每天${limit}次，升级解锁无限使用`, upgrade: true },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { jobTitle, company, count = 5 } = body;

    if (!jobTitle) {
      return NextResponse.json({ error: "请填写岗位名称" }, { status: 400 });
    }

    const questions = await generateQuestions(jobTitle, company || "目标公司", count);

    // 保存会话
    const { data: session } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        company: company || "",
        questions,
        status: "in_progress",
      })
      .select("id")
      .single();

    await recordUsage(supabase, user.id, "interview");

    return NextResponse.json({
      session_id: session?.id,
      questions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "生成失败，请重试";
    console.error("Interview generate error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
