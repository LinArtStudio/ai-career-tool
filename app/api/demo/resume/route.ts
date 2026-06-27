import { NextRequest, NextResponse } from "next/server";
import { checkUsageLimit } from "@/lib/api-usage";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";

const DIAGNOSE = `简历专家。分析简历，输出JSON：{score:0-100,summary:"20字评价",dimensions:{structure:{score,comment},content:{score,comment},keywords:{score,comment},impact:{score,comment},format:{score,comment}},top_issues:[{severity:"high/medium/low",issue:"",fix:""}],optimized_lines:[{original:"",improved:"",reason":""}],comparison:"排名前X%"}`;

const REWRITE = `简历优化专家。根据简历和诊断，输出优化后的完整简历JSON：{optimized_resume:"完整简历文本",key_improvements:["改进1","改进2","改进3"]}`;

const ATS_CHECK = `ATS（简历筛选系统）专家。分析简历的ATS兼容性。
检查维度：
1. 格式兼容性：文件格式、编码、排版
2. 关键词匹配：岗位关键词覆盖率
3. 结构规范性：模块标题、日期格式、联系方式
4. 可解析性：表格、图片、特殊字符
输出JSON：{ats_score:0-100,pass_rate:"通过率估计",issues:[{type:"format/keyword/structure/parsing",severity:"high/medium/low",description:"",suggestion:""}],keywords_found:["找到的关键词"],keywords_missing:["缺失的关键词"]}`;

export async function POST(req: NextRequest) {
  // Check free usage limit
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
    const usageError = checkUsageLimit(req, "/api/demo/resume");
    if (usageError) return usageError;

        const result = await chatWithRetry([
          { role: "system", content: REWRITE },
          { role: "user", content: `简历：${body.original.slice(0, 1500)}\n诊断：${JSON.stringify(body.diagnosis).slice(0, 500)}` },
        ], { max_tokens: 1500, temperature: 0.3 });
        return NextResponse.json(parseJSON(result));
      }
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: "简历内容太少" }, { status: 400 });
    }

    const usageError = checkUsageLimit(req, "/api/demo/resume");
    if (usageError) return usageError;

    const result = await chatWithRetry([
      { role: "system", content: DIAGNOSE },
      { role: "user", content: text.slice(0, 2000) },
    ], { max_tokens: 1200, temperature: 0.3 });

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "分析失败" }, { status: 500 });
  }
}
