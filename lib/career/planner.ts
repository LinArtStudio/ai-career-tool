import { chat, parseJSON } from "@/lib/llm/deepseek";
import { CAREER_PLAN_PROMPT } from "@/lib/llm/prompts";

export interface CareerPath {
  title: string;
  match_score: number;
  description: string;
  salary_range: string;
  growth_potential: "high" | "medium" | "low";
  required_skills: string[];
  skill_gaps: string[];
  learning_path: Array<{
    stage: string;
    duration: string;
    actions: string[];
    resources: string[];
  }>;
}

export interface CareerPlan {
  career_paths: CareerPath[];
  overall_advice: string;
}

export async function generateCareerPlan(
  major: string,
  interests: string[],
  skills: string[],
  preferences?: {
    work_style?: string;
    location?: string;
    salary_expectation?: string;
  }
): Promise<CareerPlan> {
  const result = await chat([
    { role: "system", content: CAREER_PLAN_PROMPT },
    {
      role: "user",
      content: [
        `专业：${major}`,
        `兴趣：${interests.join("、")}`,
        `技能：${skills.join("、")}`,
        preferences?.work_style ? `工作偏好：${preferences.work_style}` : "",
        preferences?.location ? `地域：${preferences.location}` : "",
        preferences?.salary_expectation ? `薪资期望：${preferences.salary_expectation}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    },
  ]);

  return parseJSON<CareerPlan>(result);
}
