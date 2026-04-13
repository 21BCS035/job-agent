import type { AgentState } from "../graph/state.js";
import { sendEmail } from "../tools/emailSender.js";
import { config } from "../config.js";

export async function emailNode(state: AgentState): Promise<AgentState> {
  console.log("📧 Preparing to send email...");

  if (!state.finalReceiverEmail) {
    console.log("❗ No receiver email available.");
    throw new Error("Receiver email missing");
  }

  if (!config.SEND_EMAIL) {
    console.log("📧 Skipping email (disabled)");
    return state;
  }

  await sendEmail(
    state.finalReceiverEmail,
    "Job Application",
    state.email || ""
  );

  console.log("✅ Email sent to:", state.finalReceiverEmail);

  return state;
}