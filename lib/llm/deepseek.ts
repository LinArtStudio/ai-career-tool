// LLM API 封装 - 支持小米MiMo / DeepSeek等OpenAI兼容API

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  json_mode?: boolean;
}

function getLLMConfig() {
  return {
    apiUrl: process.env.LLM_API_URL || "https://api.deepseek.com/v1/chat/completions",
    apiKey: process.env.LLM_API_KEY || process.env.DEEPSEEK_API_KEY || "",
    model: process.env.LLM_MODEL || "deepseek-chat",
  };
}

export async function chat(
  messages: ChatMessage[],
  options?: ChatOptions
): Promise<string> {
  const config = getLLMConfig();
  if (!config.apiKey) throw new Error("LLM_API_KEY not set");

  const body: Record<string, unknown> = {
    model: options?.model || config.model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.max_tokens ?? 4096,
  };

  if (options?.json_mode !== false) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LLM API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const msg = data.choices[0].message;

  // 优先取content，若为空则取reasoning_content（MiMo等推理模型）
  let text = msg.content || msg.reasoning_content || "";

  // 去除markdown代码块包裹
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  return text;
}

/** 解析LLM返回的JSON，带容错 */
export function parseJSON<T>(text: string): T {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse JSON from LLM response: " + text.slice(0, 200));
  }
}
