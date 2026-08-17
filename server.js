import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jimmyHandler from "./api/jimmy.js";
import leadHandler from "./api/lead.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "10kb" }));

app.options("/api/jimmy", jimmyHandler);
app.get("/api/jimmy", jimmyHandler);
app.head("/api/jimmy", jimmyHandler);
app.post("/api/jimmy", jimmyHandler);

app.options("/api/lead", leadHandler);
app.get("/api/lead", leadHandler);
app.head("/api/lead", leadHandler);
app.post("/api/lead", leadHandler);

app.use(
  express.static(path.join(__dirname, "dist"), {
    setHeaders(res, filePath) {
      const fileName = path.basename(filePath);
      if (fileName === "robots.txt" || fileName === "llms.txt") {
        res.setHeader("X-Robots-Tag", "noindex, follow");
      }
    },
  }),
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Jimmy site listening on http://0.0.0.0:${PORT}`);
});
