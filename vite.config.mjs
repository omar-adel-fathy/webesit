import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
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
            if (req.method === "OPTIONS") {
              res.statusCode = 204;
              res.setHeader("Allow", "POST, OPTIONS");
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end();
              return;
            }

            if (req.method !== "POST") {
              res.statusCode = 405;
              res.setHeader("Allow", "POST, OPTIONS");
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
        configurePreviewServer(server) {
          if (typeof this.configureServer === "function") {
            this.configureServer(server);
          }
        },
      },
    ],
  };
});
