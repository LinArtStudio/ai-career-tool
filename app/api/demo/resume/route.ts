import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";
import { RESUME_ANALYZE_PROMPT } from "@/lib/llm/prompts";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let text = "";

    if (contentType.includes("multipart/form-data")) {
      // File upload mode
      const formData = await req.formData();
      const file = formData.get("resume") as File;
      if (!file) {
        return NextResponse.json({ error: "请上传简历文件" }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Try PDF parse
      if (file.name.endsWith(".pdf")) {
        try {
          const pdfParse = (await import("pdf-parse")).default;
          const data = await pdfParse(buffer);
          text = data.text;
        } catch {
          return NextResponse.json({ error: "PDF解析失败，请上传.txt格式或粘贴文本" }, { status: 400 });
        }
      } else {
        text = buffer.toString("utf-8");
      }
    } else {
      // JSON mode - text input
      const body = await req.json();
      text = body.text || "";
    }

    if (!text || text.trim().length < 30) {
      return NextResponse.json({ error: "简历内容太少，请至少输入30个字" }, { status: 400 });
    }

    const truncated = text.slice(0, 4000);
    const result = await chat([
      { role: "system", content: RESUME_ANALYZE_PROMPT },
      { role: "user", content: `请分析以下简历：\n\n${truncated}` },
    ]);

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "分析失败";
    console.error("Resume error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
