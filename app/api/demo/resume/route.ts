import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";

const SHORT_PROMPT = "你是HR顾问。分析简历，输出JSON：{score:0-100,summary:评价,dimensions:{structure:{score,comment},content:{score,comment},keywords:{score,comment},impact:{score,comment},format:{score,comment}},top_issues:[{severity,issue,fix}],optimized_lines:[{original,improved,reason}],comparison:排名}";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text || "";
    if (!text || text.trim().length < 20) return NextResponse.json({ error: "简历内容太少" }, { status: 400 });
    const result = await chat([
      { role: "system", content: SHORT_PROMPT },
      { role: "user", content: text.slice(0, 2000) },
    ], { max_tokens: 1500, temperature: 0.5 });
    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "分析失败" }, { status: 500 });
  }
}
