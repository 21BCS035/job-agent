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
        return res.status(200).json({
          success: false,
          needsUserInput: true,
          message:
            "We could not find a valid email. Please provide receiverEmail.",
          data: {
            company: result.parsedJD?.company_name,
            role: result.parsedJD?.role,
            generatedEmail: result.email,
          },
        });
      }
    res.json({
      success: true,
      data: result,
      subject: result.email?.subject,
      body: result.email?.body,
      coverLetter: result.email?.coverLetter,
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