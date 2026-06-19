import { NextRequest, NextResponse } from "next/server";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";

const PROMPT = `你是一位资深HR和职业顾问。请根据用户的简历和目标岗位，生成一封专业的中文求职信/自荐信。

要求：
1. 300-500字，简洁有力
2. 结构：自我介绍→匹配度分析→价值主张→行动号召
3. 突出与目标岗位最匹配的3个亮点
4. 语气专业自信但不自大
5. 针对目标公司的业务特点个性化

输出JSON格式：
{
  "cover_letter": "求职信正文",
  "key_highlights": ["亮点1", "亮点2", "亮点3"],
  "tips": "使用建议"
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume_text, target_position, target_company, jd } = body;

    if (!resume_text) return NextResponse.json({ error: "请提供简历内容" }, { status: 400 });

    const result = await chatWithRetry([
      { role: "system", content: PROMPT },
      { role: "user", content: `简历：${resume_text.slice(0, 2000)}\n目标岗位：${target_position || "未指定"}\n目标公司：${target_company || "未指定"}\n岗位描述：${jd || "无"}` },
    ], { max_tokens: 1500, temperature: 0.5 });

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "生成失败" }, { status: 500 });
  }
}
