import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";

const PROMPT = "你是HR顾问。分析简历，输出JSON：{score:0-100,summary:评价,dimensions:{structure:{score,comment},content:{score,comment},keywords:{score,comment},impact:{score,comment},format:{score,comment}},top_issues:[{severity,issue,fix}],optimized_lines:[{original,improved,reason}],comparison:排名}";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let text = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("resume") as File;
      if (!file) return NextResponse.json({ error: "请上传简历文件" }, { status: 400 });

      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.name.endsWith(".pdf")) {
        try {
          const pdfParse = (await import("pdf-parse")).default;
          const data = await pdfParse(buffer);
          text = data.text;
        } catch (e) {
          console.error("PDF parse error:", e);
          return NextResponse.json({ error: "PDF解析失败，请改用粘贴文本" }, { status: 400 });
        }
      } else {
        text = buffer.toString("utf-8");
      }
    } else {
      const body = await req.json();
      text = body.text || "";
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: "简历内容太少，请至少输入20个字" }, { status: 400 });
    }

    const result = await chat([
      { role: "system", content: PROMPT },
      { role: "user", content: text.slice(0, 2000) },
    ], { max_tokens: 1500, temperature: 0.5 });

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "分析失败";
    console.error("Resume error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
