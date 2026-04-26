import { v } from "convex/values";
import { action } from "./_generated/server";

export const chat = action({
  args: {
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set. Set it via: npx convex env set GROQ_API_KEY <key>");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are Clef AI, a helpful assistant built for Clef (Sonata Interactive). Be concise and friendly." },
          ...args.messages
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      throw new Error("AI service error");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
});
