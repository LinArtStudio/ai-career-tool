import { NextRequest, NextResponse } from "next/server";
import { checkUsageLimit } from "@/lib/api-usage";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";

const GEN = `资深面试官。为指定公司岗位生成5道面试题，基于真实业务场景。
输出JSON：{questions:[{id:"q1",question:"题目",category:"自我介绍/行为面试/技术面试/情景模拟",difficulty:"easy/medium/hard",tips:"30字提示"}]}`;

const EVAL = `资深面试官。评估回答，严格评分。
输出JSON：{score:0-100,strengths:["优点"],weaknesses:["不足"],improved_answer:"STAR法则参考答案200字",key_points:["关键点"],interviewer_notes:"面试官视角50字"}`;

const FOLLOWUP = `资深面试官。根据候选人的回答，提出一个深度追问。
追问规则：
1. 如果回答中有漏洞或模糊点，追问澄清
2. 如果回答太平面，追问细节和数据
3. 如果回答缺乏深度，追问底层逻辑
4. 追问要像真实面试官，有压力感但不刁难
输出JSON：{followup_question:"追问问题",followup_type:"clarify/detail/logic/pressure",reason:"为什么这样追问50字"}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, jobTitle, company, question, answer } = body;

    if (action === "generate") {
      const usageError = checkUsageLimit(req, "/api/demo/interview-preview");
      if (usageError) return usageError;
      if (!jobTitle) return NextResponse.json({ error: "请填写岗位" }, { status: 400 });
      const hint = company ? `公司：${company}，结合其真实业务出题。` : "";
      const result = await chatWithRetry([
        { role: "system", content: GEN },
        { role: "user", content: `岗位：${jobTitle}。${hint}` },
      ], { max_tokens: 1500, temperature: 0.8 });
      return NextResponse.json(parseJSON(result));
    }

    if (action === "evaluate") {
      if (!question || !answer) return NextResponse.json({ error: "缺少问题或回答" }, { status: 400 });
      const result = await chatWithRetry([
        { role: "system", content: EVAL },
        { role: "user", content: `岗位：${jobTitle || ""}\n问题：${question}\n回答：${answer}` },
      ], { max_tokens: 1200, temperature: 0.5 });
      return NextResponse.json(parseJSON(result));
    }

    if (action === "followup") {
      if (!question || !answer) return NextResponse.json({ error: "缺少问题或回答" }, { status: 400 });
      const result = await chatWithRetry([
        { role: "system", content: FOLLOWUP },
        { role: "user", content: `岗位：${jobTitle || ""}\n原问题：${question}\n候选人回答：${answer}` },
      ], { max_tokens: 800, temperature: 0.7 });
      return NextResponse.json(parseJSON(result));
    }

    return NextResponse.json({ error: "无效action" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "请求失败" }, { status: 500 });
  }
}
