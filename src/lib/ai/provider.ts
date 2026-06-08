// Server-only, OpenAI-compatible Chat Completions wrapper.
// Never import this from a Client Component — it reads secret env vars.

import "server-only";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  json?: boolean; // request a JSON object response
  temperature?: number;
  maxTokens?: number;
}

/** True when an AI key is configured and AI mode can be used. */
export function aiEnabled(): boolean {
  return Boolean(process.env.AI_API_KEY || process.env.OPENAI_API_KEY);
}

function apiKey(): string | undefined {
  return process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
}

/**
 * Calls the configured chat model. Returns the assistant message string,
 * or null on any failure (missing key, network error, bad status, timeout).
 * Callers MUST treat null as "use fallback" — this function never throws.
 */
export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {},
): Promise<string | null> {
  const key = apiKey();
  if (!key) return null;

  const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.4,
        max_tokens: options.maxTokens ?? 1200,
        ...(options.json
          ? { response_format: { type: "json_object" } }
          : {}),
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error(`AI provider returned ${res.status}`);
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    return content ?? null;
  } catch (err) {
    console.error("AI provider call failed:", err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Extract the first JSON object from a model response, tolerating fences. */
export function extractJson(raw: string): unknown | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}
