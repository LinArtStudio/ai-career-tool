import { chat, parseJSON } from "@/lib/llm/deepseek";
import { RESUME_ANALYZE_PROMPT } from "@/lib/llm/prompts";

export interface ResumeAnalysis {
  score: number;
  summary: string;
  dimensions: {
    structure: { score: number; comment: string };
    content: { score: number; comment: string };
    keywords: { score: number; comment: string };
    impact: { score: number; comment: string };
    format: { score: number; comment: string };
  };
  top_issues: Array<{
    severity: "high" | "medium" | "low";
    issue: string;
    fix: string;
  }>;
  optimized_lines: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
  comparison: string;
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  // 截断过长的简历（控制token成本）
  const truncated = resumeText.slice(0, 5000);

  const result = await chat([
    { role: "system", content: RESUME_ANALYZE_PROMPT },
    { role: "user", content: `请分析以下简历：\n\n${truncated}` },
  ]);

  return parseJSON<ResumeAnalysis>(result);
}
