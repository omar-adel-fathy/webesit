import "dotenv/config";
import express from "express";
import handler from "./api/jimmy.js";
import leadHandler from "./api/lead.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "10kb" }));

app.options("/api/jimmy", handler);
app.get("/api/jimmy", handler);
app.head("/api/jimmy", handler);
app.post("/api/jimmy", handler);

app.options("/api/lead", leadHandler);
app.get("/api/lead", leadHandler);
app.head("/api/lead", leadHandler);
app.post("/api/lead", leadHandler);

app.listen(PORT, () => {
  console.log(`🚀 Jimmy AI dev server running on http://localhost:${PORT}`);
  console.log(`📝 Vite dev server should proxy /api to this server`);
});
