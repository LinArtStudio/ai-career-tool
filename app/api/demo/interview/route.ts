import { NextRequest, NextResponse } from "next/server";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";

const GENERATE_PROMPT = `你是一位在目标公司工作多年的资深面试官和HR专家。

请为目标公司的真实面试生成题目。要求：
1. 题目必须基于该公司的真实业务场景和实际面试风格
2. 反映该公司HR在真实面试中会关注的核心能力
3. 结合该公司的产品、文化和业务特点
4. 难度从基础到高阶递进

输出JSON格式：
{
  "questions": [
    {
      "id": "q1",
      "question": "面试题目（具体、有场景、有针对性）",
      "category": "自我介绍/行为面试/技术面试/情景模拟/压力面试",
      "difficulty": "easy/medium/hard",
      "tips": "回答思路提示（30字以内）"
    }
  ]
}

生成5道题，覆盖至少3种不同类型。`;

const EVALUATE_PROMPT = `你是一位拥有10年经验的资深面试官，同时是该领域的职业教练。

请像真实面试官一样严格评估候选人的回答。评估标准：
1. 内容相关性：是否直接回答了问题
2. 结构清晰度：是否有逻辑框架（如STAR法则）
3. 具体性：是否有具体例子、数据、细节
4. 岗位匹配度：是否体现岗位所需的核心能力
5. 表达能力：语言是否简洁有力、有说服力

输出JSON格式：
{
  "score": 0-100（严格评分，60分以下为不合格）,
  "strengths": ["具体优点1", "具体优点2"],
  "weaknesses": ["具体不足1", "具体不足2"],
  "improved_answer": "如果由优秀候选人回答，应该是这样的：（使用STAR法则，200字以内）",
  "key_points": ["应该覆盖但遗漏的关键点1", "关键点2"],
  "interviewer_notes": "如果你是面试官，基于这个回答你会怎么评价这个人？会录用吗？为什么？（50字以内，直白诚实）"
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, jobTitle, company, question, answer } = body;

    if (action === "generate") {
      if (!jobTitle) return NextResponse.json({ error: "请填写岗位名称" }, { status: 400 });
      const prompt = company
        ? `${GENERATE_PROMPT}\n\n目标公司：${company}\n目标岗位：${jobTitle}\n\n请结合${company}的真实业务、产品特点和面试风格来出题。`
        : `${GENERATE_PROMPT}\n\n目标岗位：${jobTitle}`;

      const result = await chatWithRetry([
        { role: "system", content: prompt },
        { role: "user", content: `请为${company || "目标公司"}的${jobTitle}岗位生成5道面试题。` },
      ], { max_tokens: 2500, temperature: 0.8 });
      return NextResponse.json(parseJSON(result));
    }

    if (action === "evaluate") {
      if (!question || !answer) return NextResponse.json({ error: "缺少问题或回答" }, { status: 400 });
      const result = await chatWithRetry([
        { role: "system", content: EVALUATE_PROMPT },
        { role: "user", content: `岗位：${jobTitle || "未指定"}\n公司：${company || "未指定"}\n面试问题：${question}\n\n候选人回答：${answer}` },
      ], { max_tokens: 2000, temperature: 0.5 });
      return NextResponse.json(parseJSON(result));
    }

    return NextResponse.json({ error: "无效action" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "请求失败" }, { status: 500 });
  }
}
