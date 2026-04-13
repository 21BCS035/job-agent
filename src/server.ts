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
    const { jobUrl, receiverEmail } = req.body;
    const result = await processJob({jobUrl, receiverEmail});
    if (!result.finalReceiverEmail) {
      return res.status(400).json({
        success: false,
        message: "No email found. Please provide receiverEmail.",
      });
    }
    if (!result.isEmailValid) {
        return res.status(400).json({
            success: false,
            message: "Email found is invalid. Please provide a valid email.",
            emailTried: result.finalReceiverEmail,
        });
        }
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