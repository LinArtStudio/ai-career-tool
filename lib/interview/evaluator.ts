import { chat, parseJSON } from "@/lib/llm/deepseek";
import { INTERVIEW_EVALUATE_PROMPT } from "@/lib/llm/prompts";

export interface EvaluationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improved_answer: string;
  key_points: string[];
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  jobTitle: string
): Promise<EvaluationResult> {
  const result = await chat([
    { role: "system", content: INTERVIEW_EVALUATE_PROMPT },
    {
      role: "user",
      content: `岗位：${jobTitle}\n面试问题：${question}\n候选人回答：${answer}`,
    },
  ]);

  return parseJSON<EvaluationResult>(result);
}
