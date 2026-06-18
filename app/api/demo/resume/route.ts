import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";

const DIAGNOSE_PROMPT = `你是资深HR顾问。分析简历，输出JSON：
{score:0-100,summary:"一句话评价",dimensions:{structure:{score:0-100,comment:""},content:{score:0-100,comment:""},keywords:{score:0-100,comment:""},impact:{score:0-100,comment:""},format:{score:0-100,comment:""}},top_issues:[{severity:"high/medium/low",issue:"",fix:""}],optimized_lines:[{original:"",improved:"",reason":""}],comparison:"排名前X%"}`;

const REWRITE_PROMPT = `你是简历优化专家。根据原始简历和诊断结果，输出一份优化后的完整简历。
要求：
1. 保留所有真实信息，不编造经历
2. 用STAR法则重写工作经历（情境-任务-行动-结果）
3. 量化所有成果（数字、百分比、金额）
4. 添加行业关键词
5. 优化格式和排版
输出JSON：{optimized_resume:"优化后的完整简历文本",key_improvements:["改进点1","改进点2","改进点3"]}`;

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
          text = (await pdfParse(buffer)).text;
        } catch {
          return NextResponse.json({ error: "PDF解析失败，请改用粘贴文本" }, { status: 400 });
        }
      } else {
        text = buffer.toString("utf-8");
      }
    } else {
      const body = await req.json();
      text = body.text || "";
      // If action is "rewrite", do rewrite
      if (body.action === "rewrite" && body.original && body.diagnosis) {
        const result = await chat([
          { role: "system", content: REWRITE_PROMPT },
          { role: "user", content: `原始简历：\n${body.original}\n\n诊断结果：\n${JSON.stringify(body.diagnosis)}` },
        ], { max_tokens: 2000, temperature: 0.5 });
        return NextResponse.json(parseJSON(result));
      }
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: "简历内容太少，请至少输入20个字" }, { status: 400 });
    }

    const result = await chat([
      { role: "system", content: DIAGNOSE_PROMPT },
      { role: "user", content: text.slice(0, 2000) },
    ], { max_tokens: 1500, temperature: 0.5 });

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "分析失败" }, { status: 500 });
  }
}
