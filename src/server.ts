import express from "express";
import cors from "cors";
import "dotenv/config";

import { processJob } from "./services/jobService.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/apply", async (req, res) => {
  try {
    const { jobUrl } = req.body;
    const result = await processJob({jobUrl});
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
  console.error("❌ ERROR:", err);

  res.status(500).json({
    success: false,
    error: err?.message || "Something went wrong",
  });
}
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});