import type { AgentState } from "../graph/state.js";
import { sendEmail } from "../tools/emailSender.js";

export async function emailNode(state: AgentState): Promise<AgentState> {
  console.log("📧 Sending email...");

  await sendEmail(
    "yadavarp2003@gmail.com",
    "Job Application",
    state.email || ""
  );

  return state;
}