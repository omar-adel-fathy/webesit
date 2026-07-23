import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const JIMMY_SYSTEM_PROMPT = `
You are Jimmy AI, the concise fit assistant for Creative Scaling.
Creative Scaling helps Shopify brands build predictable creative engines for paid ads and organic growth.
Offer: performance statics, performance video creatives, creative strategy, weekly creative sprints, delivery structure, feedback flow, and performance reviews.
Best fit: Shopify brands doing $30k+/month with real product demand who need more consistent creative output and better testing structure.
Not a fit: very early brands, cheapest-editor shoppers, one random video requests, or people expecting guaranteed ad results without testing.
Packages: Starter starts at $2,000/mo, Growth starts at $5,000/mo, Scale starts at $8,000/mo.
Primary CTA: complete the short Strategy Review application, then book the call if qualified.
Keep replies under 120 words. Be direct, premium, calm, and practical. Do not make guarantees. If asked for the next step, tell them to complete the Strategy Review application.
`;

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

async function deepseekReply({ messages, env }) {
  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    const error = new Error("Missing DEEPSEEK_API_KEY");
    error.status = 500;
    throw error;
  }

  const response = await fetch(env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL || "deepseek-chat",
      temperature: 0.35,
      max_tokens: 450,
      messages: [
        { role: "system", content: JIMMY_SYSTEM_PROMPT },
        ...messages.slice(-12).map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: String(message.content || "").slice(0, 1200),
        })),
      ],
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error?.message || "DeepSeek request failed");
    error.status = response.status;
    throw error;
  }

  return data?.choices?.[0]?.message?.content?.trim() || "I could not generate a reply. Try asking that another way.";
}

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return {
    plugins: [
      react(),
      {
        name: "jimmy-ai-dev-api",
        configureServer(server) {
          server.middlewares.use("/api/jimmy", async (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Method not allowed" }));
              return;
            }

            try {
              const body = await readJson(req);
              const reply = await deepseekReply({ messages: Array.isArray(body.messages) ? body.messages : [], env });
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ reply }));
            } catch (error) {
              res.statusCode = error.status || 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error.message || "Jimmy AI failed" }));
            }
          });
        },
      },
    ],
  };
});
