import { NextRequest, NextResponse } from "next/server";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";

const DIAGNOSE_PROMPT = `你是一位拥有15年经验的资深HR顾问和简历专家。

请对以下简历进行专业诊断，严格按照JSON格式输出。

评分标准（每项0-100分）：
- structure（结构）：是否有清晰的模块划分（教育/经历/技能/项目），信息层次是否合理
- content（内容）：经历描述是否具体、有深度，是否使用了STAR法则
- keywords（关键词）：是否包含目标岗位的行业关键词和技能关键词
- impact（影响力）：是否用数据量化成果（数字、百分比、金额、时间）
- format（格式）：排版是否整洁、专业，是否有拼写错误

输出格式（严格JSON，不要添加任何额外文字）：
{
  "score": 综合评分,
  "summary": "一句话总评（20字以内）",
  "dimensions": {
    "structure": {"score": 分数, "comment": "评价"},
    "content": {"score": 分数, "comment": "评价"},
    "keywords": {"score": 分数, "comment": "评价"},
    "impact": {"score": 分数, "comment": "评价"},
    "format": {"score": 分数, "comment": "评价"}
  },
  "top_issues": [
    {"severity": "high", "issue": "问题描述", "fix": "具体修改建议"}
  ],
  "optimized_lines": [
    {"original": "原文片段", "improved": "优化后", "reason": "优化原因"}
  ],
  "comparison": "在同类求职者中排名前X%"
}`;

const REWRITE_PROMPT = `你是一位顶级简历优化专家。请根据原始简历和诊断结果，输出一份优化后的完整简历。

优化规则：
1. 保留所有真实信息，绝不编造经历或数据
2. 用STAR法则重写每段工作经历（情境-任务-行动-结果）
3. 为每个成果添加量化数据（如果原文没有，用合理的行业平均值标注）
4. 添加目标岗位的行业关键词
5. 优化格式：使用清晰的模块划分、统一的格式、专业的排版
6. 语言风格：专业、简洁、有力

输出格式（严格JSON）：
{
  "optimized_resume": "优化后的完整简历文本（使用\n换行）",
  "key_improvements": ["改进点1", "改进点2", "改进点3", "改进点4", "改进点5"]
}`;

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
        const result = await chatWithRetry([
          { role: "system", content: REWRITE_PROMPT },
          { role: "user", content: `原始简历：\n${body.original}\n\n诊断结果：\n${JSON.stringify(body.diagnosis).slice(0, 1000)}` },
        ], { max_tokens: 2500, temperature: 0.3 });
        return NextResponse.json(parseJSON(result));
      }
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: "简历内容太少，请至少输入20个字" }, { status: 400 });
    }

    const result = await chatWithRetry([
      { role: "system", content: DIAGNOSE_PROMPT },
      { role: "user", content: `请诊断以下简历：\n\n${text.slice(0, 3000)}` },
    ], { max_tokens: 2000, temperature: 0.3 });

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "分析失败";
    console.error("Resume error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
