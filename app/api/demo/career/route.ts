import { NextRequest, NextResponse } from "next/server";
import { chat, parseJSON } from "@/lib/llm/deepseek";
import { CAREER_PLAN_PROMPT } from "@/lib/llm/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { major, interests, skills } = body;
    if (!major) return NextResponse.json({ error: "请填写专业" }, { status: 400 });

    const result = await chat([
      { role: "system", content: CAREER_PLAN_PROMPT },
      {
        role: "user",
        content: [
          `专业：${major}`,
          interests?.length ? `兴趣：${interests.join("、")}` : "",
          skills?.length ? `技能：${skills.join("、")}` : "",
        ].filter(Boolean).join("\n"),
      },
    ]);

    return NextResponse.json(parseJSON(result));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "生成失败";
    console.error("Demo career error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
