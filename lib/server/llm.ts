import OpenAI from "openai";

function getClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1"
  });
}

export async function generateJson<T>(prompt: string, fallback: T, model = "openai/gpt-4o-mini"): Promise<T> {
  const client = getClient();
  if (!client) return fallback;

  try {
    const res = await client.chat.completions.create({
      model,
      temperature: 0.3,
      messages: [
        { role: "system", content: "Return valid minified JSON only. No markdown." },
        { role: "user", content: prompt }
      ]
    });

    const content = res.choices[0]?.message?.content?.trim();
    if (!content) return fallback;
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}
