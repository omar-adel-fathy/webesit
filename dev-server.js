import express from "express";
import handler from "./api/jimmy.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "10kb" }));

app.post("/api/jimmy", (req, res) => {
  handler(req, res);
});

app.options("/api/jimmy", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`🚀 Jimmy AI dev server running on http://localhost:${PORT}`);
  console.log(`📝 Vite dev server should proxy /api to this server`);
});
