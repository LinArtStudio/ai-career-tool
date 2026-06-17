import { chat, parseJSON } from "@/lib/llm/deepseek";
import { INTERVIEW_GENERATE_PROMPT } from "@/lib/llm/prompts";

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tips: string;
}

export async function generateQuestions(
  jobTitle: string,
  company: string,
  count: number = 5
): Promise<InterviewQuestion[]> {
  const result = await chat([
    { role: "system", content: INTERVIEW_GENERATE_PROMPT },
    {
      role: "user",
      content: `岗位：${jobTitle}\n公司：${company}\n请生成${count}个面试问题。`,
    },
  ]);

  const parsed = parseJSON<{ questions: InterviewQuestion[] }>(result);
  return parsed.questions;
}
