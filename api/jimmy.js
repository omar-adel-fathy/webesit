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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing DEEPSEEK_API_KEY" });
    return;
  }

  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const response = await fetch(process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
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
      res.status(response.status).json({ error: data?.error?.message || "DeepSeek request failed" });
      return;
    }

    res.status(200).json({
      reply: data?.choices?.[0]?.message?.content?.trim() || "I could not generate a reply. Try asking that another way.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Jimmy AI failed" });
  }
}
