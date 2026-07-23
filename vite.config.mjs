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

const rateLimitStore = new Map();
const MAX_REQUESTS_PER_MINUTE = 20;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_CONVERSATION_TURNS = 20;
const BLOCKED_PATTERNS = [
  /system\s*prompt/i, /ignore\s*(all|previous|above)/i, /forget/i,
  /reset/i, /you are (not|are not)/i, /jailbreak/i, /dan/i,
  /how\s*to\s*(hack|exploit|bypass|scam)/i,
  /generate\s*(key|token|password|secret)/i,
  /unlock/i, /crack/i, /illegal/i,
];

function getClientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - 60000;
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  const timestamps = rateLimitStore.get(ip).filter((t) => t > windowStart);
  if (timestamps.length >= MAX_REQUESTS_PER_MINUTE) return false;
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return true;
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return { valid: false, error: "No messages provided" };
  if (messages.length > MAX_CONVERSATION_TURNS) return { valid: false, error: "Conversation too long" };
  for (const msg of messages) {
    if (typeof msg.content !== "string") return { valid: false, error: "Invalid message format" };
    if (msg.content.length > MAX_MESSAGE_LENGTH) return { valid: false, error: "Message too long" };
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(msg.content)) return { valid: false, error: "Blocked content detected" };
    }
  }
  return { valid: true };
}

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
          content: String(message.content || "").slice(0, MAX_MESSAGE_LENGTH),
        })),
      ],
    }),
  });

  const raw = await response.text().catch(() => "");
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { raw };
  }

  if (!response.ok) {
    const error = new Error(data?.error?.message || data?.message || data?.raw || "DeepSeek request failed");
    error.status = response.status;
    throw error;
  }

  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    const error = new Error("Jimmy returned an empty reply. Try asking that another way.");
    error.status = 502;
    throw error;
  }

  return reply;
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
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "Method not allowed" }));
              return;
            }

            const ip = getClientIp(req);
            if (!checkRateLimit(ip)) {
              res.statusCode = 429;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "Too many requests. Please wait and try again." }));
              return;
            }

            try {
              const body = await readJson(req);
              const validation = validateMessages(body.messages);
              if (!validation.valid) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify({ error: validation.error }));
                return;
              }
              const reply = await deepseekReply({ messages: body.messages, env });
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ reply }));
            } catch (error) {
              res.statusCode = error.status || 500;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: error.message || "Jimmy AI failed" }));
            }
          });
        },
      },
    ],
  };
});
