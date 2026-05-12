import { v } from "convex/values";
import { action } from "./_generated/server";

// Primary model: fast and cheap. Fallback: more capable, used if primary fails.
const PRIMARY_MODEL = "llama-3.1-8b-instant";
const FALLBACK_MODEL = "llama-3.3-70b-versatile";

async function callGroq(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are Clef AI, a helpful assistant built for Clef (Sonata Interactive). Be concise and friendly.",
        },
        ...messages,
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error (${model}): ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}

export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not set. Set it via: npx convex env set GROQ_API_KEY <key>"
      );
    }

    // Try primary model first, fall back to secondary on failure
    try {
      return await callGroq(apiKey, PRIMARY_MODEL, args.messages);
    } catch (primaryError) {
      console.warn(
        `Primary model (${PRIMARY_MODEL}) failed, trying fallback (${FALLBACK_MODEL}):`,
        primaryError
      );
      try {
        return await callGroq(apiKey, FALLBACK_MODEL, args.messages);
      } catch (fallbackError) {
        console.error(`Fallback model (${FALLBACK_MODEL}) also failed:`, fallbackError);
        throw new Error("AI service unavailable. Both primary and fallback models failed.");
      }
    }
  },
});
