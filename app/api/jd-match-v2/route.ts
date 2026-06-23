// ============================================================
// JD智能匹配诊断 API
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";
import { checkUsageLimit } from "@/lib/api-usage";
import { JD_MATCH_PROMPT } from "@/lib/prompts/jd-match";

export async function POST(req: NextRequest) {
  // 检查使用限制
  const usageError = checkUsageLimit(req, "/api/jd-match-v2");
  if (usageError) return usageError;

  try {
    const body = await req.json();
    const { resume, jd } = body;

    // 参数验证
    if (!resume || typeof resume !== "string") {
      return NextResponse.json(
        { error: "请提供简历内容" },
        { status: 400 }
      );
    }

    if (!jd || typeof jd !== "string") {
      return NextResponse.json(
        { error: "请提供岗位描述(JD)" },
        { status: 400 }
      );
    }

    // 内容长度验证
    if (resume.trim().length < 50) {
      return NextResponse.json(
        { error: "简历内容过短，请提供更完整的简历" },
        { status: 400 }
      );
    }

    if (jd.trim().length < 50) {
      return NextResponse.json(
        { error: "岗位描述过短，请提供更完整的JD" },
        { status: 400 }
      );
    }

    // 截断过长的内容（避免token溢出）
    const maxResumeLength = 3000;
    const maxJdLength = 2000;
    const truncatedResume = resume.length > maxResumeLength 
      ? resume.slice(0, maxResumeLength) + "\n...(简历内容已截断)"
      : resume;
    const truncatedJd = jd.length > maxJdLength 
      ? jd.slice(0, maxJdLength) + "\n...(JD内容已截断)"
      : jd;

    // 调用LLM进行分析
    const result = await chatWithRetry(
      [
        { role: "system", content: JD_MATCH_PROMPT },
        { 
          role: "user", 
          content: `请分析以下简历和JD的匹配度：\n\n【简历】\n${truncatedResume}\n\n【岗位描述(JD)】\n${truncatedJd}` 
        },
      ],
      { 
        max_tokens: 4000, 
        temperature: 0.3,
        json_mode: true 
      }
    );

    // 解析JSON结果
    const parsedResult = parseJSON(result);

    // 验证返回数据结构
    if (!parsedResult.match_score || !parsedResult.jd_analysis) {
      throw new Error("AI返回数据格式异常，请重试");
    }

    // 添加使用统计
    parsedResult._meta = {
      timestamp: new Date().toISOString(),
      version: "2.0",
      feature: "jd-match-v2"
    };

    return NextResponse.json(parsedResult);
  } catch (err: unknown) {
    console.error("JD匹配分析失败:", err);
    
    // 错误分类处理
    let errorMessage = "分析失败，请重试";
    
    if (err instanceof Error) {
      if (err.message.includes("timeout") || err.message.includes("超时")) {
        errorMessage = "分析超时，请缩短简历或JD内容后重试";
      } else if (err.message.includes("JSON") || err.message.includes("parse")) {
        errorMessage = "AI返回数据解析失败，请重试";
      } else if (err.message.includes("token") || err.message.includes("length")) {
        errorMessage = "内容过长，请缩短简历或JD后重试";
      } else {
        errorMessage = err.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// GET请求返回功能说明
export async function GET() {
  return NextResponse.json({
    name: "JD智能匹配诊断",
    version: "2.0",
    description: "深度分析简历和JD的匹配度，提供多维度评分、差距分析、简历优化建议和面试问题预测",
    features: [
      "JD深度解析",
      "多维度匹配评分",
      "精准差距分析",
      "针对性简历优化建议",
      "面试问题预测"
    ],
    pricing: {
      free: "每天3次基础分析",
      paid: "¥9.9/次完整分析"
    }
  });
}
