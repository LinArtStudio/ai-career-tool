import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";
import { RESUME_ANALYZE_PROMPT } from "@/lib/llm/prompts";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    if (!file) return NextResponse.json({ error: "请上传简历文件" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    let text: string;
    try {
      const data = await pdf(buffer);
      text = data.text;
    } catch {
      return NextResponse.json({ error: "无法解析此PDF" }, { status: 400 });
    }

    if (!text || text.trim().length < 30) {
      return NextResponse.json({ error: "无法提取足够文本" }, { status: 400 });
    }

    const truncated = text.slice(0, 4000);
    const result = await chat([
      { role: "system", content: RESUME_ANALYZE_PROMPT },
      { role: "user", content: `请分析以下简历：\n\n${truncated}` },
    ]);

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "分析失败";
    console.error("Demo resume error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
