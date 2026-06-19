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

export async function chat(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
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
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LLM API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const msg = data.choices[0].message;
  let text = msg.content || msg.reasoning_content || "";
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return text;
}

export function parseJSON<T>(text: string): T {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {}

  // Try to extract JSON object
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]);
    } catch {
      // Try fixing common JSON errors
      let fixed = objMatch[0];
      // Fix trailing commas
      fixed = fixed.replace(/,\s*([}\]])/g, "$1");
      // Fix missing quotes on keys
      fixed = fixed.replace(/(\s)(\w+)(\s*:)/g, '$1"$2"$3');
      // Fix single quotes
      fixed = fixed.replace(/'/g, '"');
      // Fix unescaped newlines in strings
      try {
        return JSON.parse(fixed);
      } catch {}
    }
  }

  // Try to extract JSON array
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try {
      return JSON.parse(arrMatch[0]);
    } catch {
      let fixed = arrMatch[0];
      fixed = fixed.replace(/,\s*([}\]])/g, "$1");
      try {
        return JSON.parse(fixed);
      } catch {}
    }
  }

  throw new Error("Failed to parse JSON: " + text.slice(0, 200));
}

export async function chatWithRetry(
  messages: ChatMessage[],
  options?: ChatOptions,
  maxRetries: number = 2
): Promise<string> {
  let lastError: Error | null = null;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await chat(messages, { ...options, temperature: (options?.temperature ?? 0.7) - i * 0.2 });
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i < maxRetries) await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw lastError;
}
