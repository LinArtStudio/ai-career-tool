import { NextRequest, NextResponse } from "next/server";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";

const PROMPT = `你是一位资深HR和简历专家，精通中国各大企业的招聘标准。

请根据用户提供的信息，生成一份专业的中文简历。要求：
1. 严格遵循中国简历规范（包含照片位置、个人信息、求职意向等）
2. 使用STAR法则重写每段经历
3. 量化所有成果
4. 针对目标岗位优化关键词
5. 语言专业、简洁、有力

输出JSON格式：
{
  "resume": {
    "personal_info": {
      "name": "姓名",
      "phone": "手机",
      "email": "邮箱",
      "photo_placeholder": true,
      "birth_date": "出生日期",
      "location": "所在城市"
    },
    "objective": {
      "target_position": "目标岗位",
      "target_city": "期望城市",
      "salary_expectation": "期望薪资"
    },
    "education": [
      {
        "school": "学校",
        "major": "专业",
        "degree": "学历",
        "start_date": "开始时间",
        "end_date": "结束时间",
        "gpa": "GPA（如有）",
        "highlights": ["亮点1", "亮点2"]
      }
    ],
    "experience": [
      {
        "company": "公司",
        "position": "岗位",
        "start_date": "开始时间",
        "end_date": "结束时间",
        "responsibilities": ["职责1（STAR法则）", "职责2"],
        "achievements": ["成果1（量化）", "成果2"]
      }
    ],
    "projects": [
      {
        "name": "项目名",
        "role": "角色",
        "description": "描述",
        "technologies": ["技术栈"],
        "achievements": ["成果"]
      }
    ],
    "skills": {
      "technical": ["技术技能"],
      "tools": ["工具"],
      "languages": ["语言能力"],
      "soft_skills": ["软技能"]
    },
    "self_evaluation": "自我评价（100字以内）"
  },
  "optimization_notes": ["优化说明1", "优化说明2"]
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { basic_info, target_position, target_company } = body;

    if (!basic_info) return NextResponse.json({ error: "请填写基本信息" }, { status: 400 });

    const result = await chatWithRetry([
      { role: "system", content: PROMPT },
      { role: "user", content: `基本信息：${basic_info}\n目标岗位：${target_position || "未指定"}\n目标公司：${target_company || "未指定"}` },
    ], { max_tokens: 3000, temperature: 0.3 });

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "生成失败" }, { status: 500 });
  }
}
