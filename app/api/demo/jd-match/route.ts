import { NextRequest, NextResponse } from "next/server";
import { checkUsageLimit } from "@/lib/api-usage";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";

const PROMPT = `HR专家。分析简历和JD匹配度。
输出JSON：{match_score:0-100,matched_keywords:["匹配"],missing_keywords:["缺失"],suggestions:["建议"],jd_analysis:{role_summary:"概述",key_requirements:["要求"],nice_to_have:["加分"]}}`;

export async function POST(req: NextRequest) {
  const usageError = checkUsageLimit(req, "/api/demo/jd-match");
  if (usageError) return usageError;
  try {
    const { resume, jd } = await req.json();
    if (!resume || !jd) return NextResponse.json({ error: "缺少简历或JD" }, { status: 400 });
    const result = await chatWithRetry([
      { role: "system", content: PROMPT },
      { role: "user", content: `简历：${resume.slice(0, 1000)}\nJD：${jd.slice(0, 1000)}` },
    ], { max_tokens: 1000, temperature: 0.3 });
    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "分析失败" }, { status: 500 });
  }
}
