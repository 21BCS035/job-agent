import express from "express";
import cors from "cors";
import path from "path"; 
import "dotenv/config";

import { processJob } from "./services/jobService.js";
import { upload } from "./middleware/upload.js";

if (!process.env.OPENAI_API_KEY?.trim()) {
  console.warn(
    "⚠️ OPENAI_API_KEY is not set"
  );
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    const { jobUrl, receiverEmail, sendEmail: sendEmailRaw } = req.body;
    const sendEmail =
      sendEmailRaw === true ||
      String(sendEmailRaw).toLowerCase() === "true";
    const resumePath = req.file?.path
      ? path.resolve(req.file.path)
      : undefined;
    const resumeFileName = req.file?.originalname;

    const result = await processJob({
      jobUrl,
      receiverEmail,
      sendEmail,
      ...(resumePath && { resumePath }),
      ...(resumeFileName && { resumeFileName }),
    });

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

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
});