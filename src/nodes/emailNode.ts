import type { AgentState } from "../graph/state.js";
import { sendEmail } from "../tools/emailSender.js";
import { config } from "../config.js";

export async function emailNode(state: AgentState): Promise<AgentState> {
  console.log("📧 Preparing to send email...");

  if (!state.finalReceiverEmail) {
    console.log("⚠️ Skipping email - no valid receiver");
    return state;
  }

  if (!config.SEND_EMAIL) {
    console.log("📧 Skipping email (disabled)");
    return state;
  }

  await sendEmail(
    state.finalReceiverEmail,
    state.email?.subject || "Job Application",
    state.email?.body || ""
  );

  console.log("✅ Email sent to:", state.finalReceiverEmail);

  return state;
}