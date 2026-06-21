import { NextRequest, NextResponse } from "next/server";
import { chatWithRetry, parseJSON } from "@/lib/llm/deepseek";

const PROMPT = `职业规划专家。根据专业、兴趣、技能，推荐3条职业路径。
输出JSON：{career_paths:[{title:"方向",match_score:0-100,description:"50字描述",salary_range:"薪资",growth_potential:"high/medium/low",required_skills:["技能"],skill_gaps:["缺少"],learning_path:[{stage:"阶段",duration:"时长",actions:["行动"],resources:["资源"]}]}],overall_advice:"100字建议"}`;

export async function POST(req: NextRequest) {
  try {
    const { major, interests, skills } = await req.json();
    if (!major) return NextResponse.json({ error: "请填写专业" }, { status: 400 });

    const parts = [`专业：${major}`];
    if (interests?.length) parts.push(`兴趣：${interests.join("、")}`);
    if (skills?.length) parts.push(`技能：${skills.join("、")}`);

    const result = await chatWithRetry([
      { role: "system", content: PROMPT },
      { role: "user", content: parts.join("\n") },
    ], { max_tokens: 1200, temperature: 0.5 });

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "生成失败" }, { status: 500 });
  }
}
