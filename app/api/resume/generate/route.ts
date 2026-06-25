// ============================================================
// AI简历生成器 API
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { generateResume, generateResumeText, type ResumeInput } from "@/lib/resume-generator";
import { checkUsageLimit } from "@/lib/api-usage";

export async function POST(req: NextRequest) {
  // 检查使用限制
  const usageError = checkUsageLimit(req, "/api/resume/generate");
  if (usageError) return usageError;

  try {
    const body = await req.json();
    const { jobTitle, jobDescription, personalInfo, experience, education, skills, projects } = body;

    // 参数验证
    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "请提供目标岗位和岗位描述" },
        { status: 400 }
      );
    }

    if (!personalInfo?.name || !personalInfo?.email) {
      return NextResponse.json(
        { error: "请提供姓名和邮箱" },
        { status: 400 }
      );
    }

    if (!experience || experience.length === 0) {
      return NextResponse.json(
        { error: "请提供至少一条工作经历" },
        { status: 400 }
      );
    }

    // 构建输入
    const input: ResumeInput = {
      jobTitle,
      jobDescription,
      personalInfo,
      experience,
      education: education || [],
      skills: skills || [],
      projects: projects || [],
    };

    // 生成简历
    const result = await generateResume(input);

    // 生成简历文本
    const resumeText = generateResumeText(result, input);

    return NextResponse.json({
      success: true,
      resume: result,
      resumeText,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0",
        feature: "resume-generator",
      },
    });
  } catch (err: unknown) {
    console.error("简历生成失败:", err);

    let errorMessage = "简历生成失败，请重试";

    if (err instanceof Error) {
      if (err.message.includes("timeout") || err.message.includes("超时")) {
        errorMessage = "生成超时，请缩短内容后重试";
      } else if (err.message.includes("JSON") || err.message.includes("parse")) {
        errorMessage = "AI返回数据解析失败，请重试";
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
    name: "AI简历生成器",
    version: "1.0",
    description: "根据目标岗位JD生成针对性简历",
    features: [
      "针对JD定制简历",
      "ATS优化",
      "STAR法则描述",
      "关键词优化",
      "多维度评分"
    ],
    pricing: {
      free: "每天1次基础生成",
      paid: "¥9.9/次完整生成"
    }
  });
}
