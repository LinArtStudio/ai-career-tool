import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateAnswer } from "@/lib/interview/evaluator";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await req.json();
    const { session_id, question_id, question, answer, jobTitle } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: "缺少问题或回答" }, { status: 400 });
    }

    const evaluation = await evaluateAnswer(question, answer, jobTitle || "");

    // 保存回答
    await supabase.from("interview_answers").insert({
      session_id,
      question_id,
      question_text: question,
      answer_text: answer,
      score: evaluation.score,
      evaluation,
    });

    return NextResponse.json(evaluation);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "评估失败，请重试";
    console.error("Interview evaluate error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
