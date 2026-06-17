import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";
import { INTERVIEW_GENERATE_PROMPT, INTERVIEW_EVALUATE_PROMPT } from "@/lib/llm/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, jobTitle, company, question, answer } = body;

    if (action === "generate") {
      if (!jobTitle) return NextResponse.json({ error: "请填写岗位名称" }, { status: 400 });
      const result = await chat([
        { role: "system", content: INTERVIEW_GENERATE_PROMPT },
        { role: "user", content: `岗位：${jobTitle}\n公司：${company || "目标公司"}\n请生成5个面试问题。` },
      ]);
      return NextResponse.json(parseJSON(result));
    }

    if (action === "evaluate") {
      if (!question || !answer) return NextResponse.json({ error: "缺少问题或回答" }, { status: 400 });
      const result = await chat([
        { role: "system", content: INTERVIEW_EVALUATE_PROMPT },
        { role: "user", content: `岗位：${jobTitle || ""}\n面试问题：${question}\n候选人回答：${answer}` },
      ]);
      return NextResponse.json(parseJSON(result));
    }

    return NextResponse.json({ error: "无效action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "请求失败";
    console.error("Demo interview error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
