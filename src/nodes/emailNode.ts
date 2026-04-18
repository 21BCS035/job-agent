import type { AgentState } from "../graph/state.js";
import { sendEmail } from "../tools/emailSender.js";

export async function emailNode(state: AgentState): Promise<AgentState> {
  console.log("📧 Preparing to send email...");

  if (!state.finalReceiverEmail) {
    console.log("⚠️ Skipping email - no valid receiver");
    return state;
  }

  if (!state.sendEmail) {
    console.log("📧 Skipping email (sendEmail is false)");
    return state;
  }

  await sendEmail(
    state.finalReceiverEmail,
    state.email?.subject || "Job Application",
    state.email?.body || "",
    state.resumePath,
    state.resumeFileName
  );

  console.log("✅ Email sent to:", state.finalReceiverEmail);

  return state;
}