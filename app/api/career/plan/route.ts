import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCareerPlan } from "@/lib/career/planner";
import { checkUsageLimit, isPaidUser, recordUsage } from "@/lib/auth/limits";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const paid = await isPaidUser(supabase, user.id);
    if (!paid) {
      const { allowed, limit } = await checkUsageLimit(supabase, user.id, "career");
      if (!allowed) {
        return NextResponse.json(
          { error: `免费版每天${limit}次，升级解锁无限使用`, upgrade: true },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { major, interests, skills, preferences } = body;

    if (!major) {
      return NextResponse.json({ error: "请填写专业" }, { status: 400 });
    }

    const plan = await generateCareerPlan(
      major,
      interests || [],
      skills || [],
      preferences
    );

    // 保存结果
    await supabase.from("career_plans").insert({
      user_id: user.id,
      input_data: { major, interests, skills, preferences },
      plan_data: plan,
    });

    await recordUsage(supabase, user.id, "career");

    return NextResponse.json(plan);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "生成失败，请重试";
    console.error("Career plan error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
