import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";

const PROMPT = `你是HR专家。分析简历和JD的匹配度。
输出JSON：{match_score:0-100,matched_keywords:["匹配的关键词"],missing_keywords:["缺失的关键词"],suggestions:["优化建议"],jd_analysis:{role_summary:"岗位概述",key_requirements:["核心要求"],nice_to_have:["加分项"]}}`;

export async function POST(req: NextRequest) {
  try {
    const { resume, jd } = await req.json();
    if (!resume || !jd) return NextResponse.json({ error: "缺少简历或JD内容" }, { status: 400 });
    const result = await chat([
      { role: "system", content: PROMPT },
      { role: "user", content: `简历：\n${resume.slice(0, 1500)}\n\n岗位描述：\n${jd.slice(0, 1500)}` },
    ], { max_tokens: 1500, temperature: 0.5 });
    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "分析失败" }, { status: 500 });
  }
}
