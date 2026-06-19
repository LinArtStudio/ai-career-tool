import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";

const GENERATE_PROMPT = `你是资深面试官，精通AIGC/互联网行业。为指定岗位生成面试题。

岗位类型参考：
- AI产品经理：大模型应用、AI功能设计、数据驱动决策
- AIGC运营：内容生成策略、Prompt优化、AI工具应用
- AI算法工程师：模型选型、训练优化、部署落地
- 数据科学家：数据清洗、特征工程、模型评估
- Prompt Engineer：提示词设计、Few-shot、Chain-of-Thought
- 前端/后端开发：AI集成、API设计、性能优化

输出JSON：{questions:[{id:"q1",question:"问题",category:"自我介绍/行为面试/技术面试/情景模拟/Prompt设计",difficulty:"easy/medium/hard",tips:"回答提示"}]}
要求：5道题，从易到难，覆盖4种类型，贴合岗位实际工作。`;

const EVALUATE_PROMPT = `你是资深面试官和职业教练。评估候选人的回答。
评分标准：
- 内容相关性(30%)：是否回答了问题
- 结构清晰度(20%)：是否有逻辑框架（如STAR）
- 具体性(25%)：是否有具体例子和数据
- 岗位匹配度(15%)：是否体现岗位所需能力
- 表达流畅度(10%)：语言是否简洁有力

输出JSON：
{
  "score": 0-100,
  "strengths": ["优点"],
  "weaknesses": ["不足"],
  "improved_answer": "优化后的参考回答(用STAR法则，200字以内)",
  "key_points": ["应该覆盖的关键点"],
  "interviewer_notes": "面试官视角：你会录用吗？为什么？(50字)",
  "industry_insight": "这个岗位在行业中的现状和趋势(30字)"
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
