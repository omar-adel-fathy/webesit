import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jimmyHandler from "./api/jimmy.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "10kb" }));

app.options("/api/jimmy", jimmyHandler);
app.get("/api/jimmy", jimmyHandler);
app.head("/api/jimmy", jimmyHandler);
app.post("/api/jimmy", jimmyHandler);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Jimmy site listening on http://0.0.0.0:${PORT}`);
});
