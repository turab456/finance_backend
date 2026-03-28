import OpenAI from "openai";

const client = new OpenAI({
  apiKey:
    "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",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // optional
    "X-Title": "Finance AI App",
  },
});

export const generateAIInsight = async (insightData) => {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 50,
      messages: [
        {
          role: "system",
          content: `
You are an expense insight engine.

STRICT RULES:
- ONLY use given data
- ONLY talk about expenses
- MUST mention top_category exactly
- MUST include top_percentage exactly
- ONE sentence only
- MAX 20 words
- NO emojis
- NO headings, NO labels
- NO generic advice
- Give 1 specific actionable suggestion
- If invalid data, return: "Not enough data."

DO NOT:
- Mention credit score, loans, rewards, investments
- Add extra text
- Change numbers
          `,
        },
        {
          role: "user",
          content: `
DATA:
${JSON.stringify(insightData)}

Generate 1 short insight.
          `,
        },
      ],
    });

    const msg = response.choices?.[0]?.message?.content?.trim();

    // ✅ Safety validation (VERY IMPORTANT)
    if (
      !msg ||
      msg.length > 120 ||
      !msg.toLowerCase().includes(insightData.top_category?.toLowerCase()) ||
      !msg.includes(String(insightData.top_percentage))
    ) {
      return null; // fallback to your rule-based message
    }

    return msg;

  } catch (err) {
    console.error("AI Error:", err?.response?.data || err.message);
    return null;
  }
};

