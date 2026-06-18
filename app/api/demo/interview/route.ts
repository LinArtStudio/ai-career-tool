import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";

const GENERATE_PROMPT = `你是资深面试官。为指定岗位生成面试题。
输出JSON：{questions:[{id:"q1",question:"问题",category:"自我介绍/行为面试/技术面试/情景模拟",difficulty:"easy/medium/hard",tips:"回答提示"}]}
要求：5道题，从易到难，覆盖4种类型。`;

const EVALUATE_PROMPT = `你是资深面试官和职业教练。评估候选人的回答。
输出JSON：
{
  "score": 0-100,
  "strengths": ["优点"],
  "weaknesses": ["不足"],
  "improved_answer": "优化后的参考回答(用STAR法则)",
  "key_points": ["应该覆盖的关键点"],
  "interviewer_notes": "如果你是面试官，你会怎么评价这个回答？你会录用这个人吗？为什么？(50字以内)"
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, jobTitle, company, question, answer } = body;

    if (action === "generate") {
      if (!jobTitle) return NextResponse.json({ error: "请填写岗位名称" }, { status: 400 });
      const result = await chat([
        { role: "system", content: GENERATE_PROMPT },
        { role: "user", content: `岗位：${jobTitle}\n公司：${company || "目标公司"}\n请生成5个面试题。` },
      ], { max_tokens: 2000 });
      return NextResponse.json(parseJSON(result));
    }

    if (action === "evaluate") {
      if (!question || !answer) return NextResponse.json({ error: "缺少问题或回答" }, { status: 400 });
      const result = await chat([
        { role: "system", content: EVALUATE_PROMPT },
        { role: "user", content: `岗位：${jobTitle || ""}\n问题：${question}\n回答：${answer}` },
      ], { max_tokens: 1500 });
      return NextResponse.json(parseJSON(result));
    }

    return NextResponse.json({ error: "无效action" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "请求失败" }, { status: 500 });
  }
}
