import dns from "node:dns/promises";
import nodemailer from "nodemailer";
import path from "path";
import { logger } from "../utils/logger.js";

const SMTP_HOSTNAME = "smtp.gmail.com";

async function resolveSmtpIPv4(): Promise<string | null> {
  try {
    const addrs = await dns.resolve4(SMTP_HOSTNAME);
    return addrs[0] ?? null;
  } catch {
    return null;
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  attachmentPath?: string,
  attachmentName?: string
) {
  const ipv4 = await resolveSmtpIPv4();

  const transporter = nodemailer.createTransport({
    ...(ipv4
      ? {
          host: ipv4,
          port: 465,
          secure: true,
          tls: { servername: SMTP_HOSTNAME },
        }
      : { service: "gmail" }),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  if (ipv4) {
    logger.info({ smtpHost: SMTP_HOSTNAME, smtpConnectIp: ipv4 }, "📧 SMTP via IPv4");
  }

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