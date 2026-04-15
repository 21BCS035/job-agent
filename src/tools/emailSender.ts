import nodemailer from "nodemailer";
import path from "path";
import { logger } from "../utils/logger.js";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  attachmentPath?: string,
  attachmentName?: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: attachmentPath
      ? [
          {
            filename: attachmentName || path.basename(attachmentPath),
            path: attachmentPath,
          },
        ]
      : [],
  });

  logger.info("📧 Email sent!");
}