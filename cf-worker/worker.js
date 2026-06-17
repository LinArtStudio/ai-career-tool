// AI求职工具 - Cloudflare Worker API
// 使用小米MiMo API，国内可访问

const LLM_API_URL = "https://token-plan-cn.xiaomimimo.com/v1/chat/completions";
const LLM_MODEL = "mimo-v2.5-pro";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let result;
      const path = url.pathname;

      if (path === "/api/interview" && request.method === "POST") {
        const body = await request.json();
        if (body.action === "generate") {
          result = await generateQuestions(body.jobTitle, body.company, env);
        } else if (body.action === "evaluate") {
          result = await evaluateAnswer(body.question, body.answer, body.jobTitle, env);
        }
      } else if (path === "/api/career" && request.method === "POST") {
        const body = await request.json();
        result = await generateCareerPlan(body.major, body.interests, body.skills, env);
      } else if (path === "/api/health") {
        return new Response(JSON.stringify({ status: "ok", model: LLM_MODEL }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        return new Response("Not Found", { status: 404, headers: corsHeaders });
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};

async function chat(messages, env, maxTokens = 4096) {
  const resp = await fetch(LLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`LLM API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  let text = data.choices[0].message.content || data.choices[0].message.reasoning_content || "";
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(text);
}

async function generateQuestions(jobTitle, company, env) {
  return await chat([
    { role: "system", content: "你是资深面试官，输出JSON格式。" },
    { role: "user", content: `岗位：${jobTitle}\n公司：${company || "目标公司"}\n请生成5个面试问题。\n\n输出JSON：{"questions":[{"id":"q1","question":"问题","category":"类别","difficulty":"easy/medium/hard","tips":"提示"}]}\n\n类别覆盖：自我介绍、行为面试、技术面试、情景模拟。从易到难。` },
  ], env);
}

async function evaluateAnswer(question, answer, jobTitle, env) {
  return await chat([
    { role: "system", content: "你是资深面试评估专家，输出JSON格式。" },
    { role: "user", content: `岗位：${jobTitle || ""}\n问题：${question}\n回答：${answer}\n\n输出JSON：{"score":0-100,"strengths":["优点"],"weaknesses":["不足"],"improved_answer":"优化后的参考回答(200字,用STAR法则)","key_points":["关键点"]}` },
  ], env);
}

async function generateCareerPlan(major, interests, skills, env) {
  const parts = [`专业：${major}`];
  if (interests?.length) parts.push(`兴趣：${interests.join("、")}`);
  if (skills?.length) parts.push(`技能：${skills.join("、")}`);

  return await chat([
    { role: "system", content: "你是职业规划专家，输出JSON格式。" },
    { role: "user", content: `${parts.join("\n")}\n\n输出JSON：{"career_paths":[{"title":"方向","match_score":0-100,"description":"描述","salary_range":"薪资","growth_potential":"high/medium/low","required_skills":["技能"],"skill_gaps":["缺少"],"learning_path":[{"stage":"阶段","duration":"时长","actions":["行动"],"resources":["资源"]}]}],"overall_advice":"建议"}` },
  ], env);
}
