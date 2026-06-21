import { NextRequest, NextResponse } from "next/server";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";

const PROMPT = `职业顾问。根据简历生成中文求职信，300-500字。
输出JSON：{cover_letter:"求职信正文",key_highlights:["亮点1","亮点2","亮点3"],tips:"使用建议"}`;

export async function POST(req: NextRequest) {
  try {
    const { resume_text, target_position, target_company, jd } = await req.json();
    if (!resume_text) return NextResponse.json({ error: "请提供简历" }, { status: 400 });
    const result = await chatWithRetry([
      { role: "system", content: PROMPT },
      { role: "user", content: `简历：${resume_text.slice(0, 1000)}\n岗位：${target_position || ""}\n公司：${target_company || ""}\nJD：${(jd || "").slice(0, 500)}` },
    ], { max_tokens: 1000, temperature: 0.5 });
    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "生成失败" }, { status: 500 });
  }
}
