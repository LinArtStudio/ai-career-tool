import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";

const DIAGNOSE_PROMPT = `你是资深HR顾问，精通AIGC/互联网行业。分析简历并给出专业评分。

评分维度：
- 结构(20分)：模块划分是否清晰（教育/经历/技能/项目）
- 内容(25分)：经历描述是否有深度
- 关键词(20分)：是否包含行业关键词（特别关注AIGC相关：Prompt Engineering、大模型、AIGC、AI Agent、Stable Diffusion等）
- 成果量化(25分)：是否用数据量化成果
- 格式(10分)：排版是否整洁专业

输出JSON：{score:0-100,summary:"一句话评价",dimensions:{structure:{score,comment},content:{score,comment},keywords:{score,comment},impact:{score,comment},format:{score,comment}},top_issues:[{severity:"high/medium/low",issue:"",fix:""}],optimized_lines:[{original:"",improved:"",reason":""}],comparison:"排名前X%",aicg_keywords:["简历中已有的AIGC关键词"],"missing_aigc_keywords":["建议添加的AIGC关键词"]}`;

const REWRITE_PROMPT = `你是简历优化专家，精通AIGC/互联网行业。根据原始简历和诊断结果，输出优化后的完整简历。
要求：
1. 保留所有真实信息，不编造经历
2. 用STAR法则重写工作经历（情境-任务-行动-结果）
3. 量化所有成果（数字、百分比、金额）
4. 添加行业关键词（特别是AIGC相关：Prompt Engineering、大模型、AI Agent等）
5. 优化格式和排版
输出JSON：{optimized_resume:"优化后的完整简历",key_improvements:["改进点1","改进点2","改进点3"]}`;

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
