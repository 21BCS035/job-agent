import type { AgentState } from "../graph/state.js";
import { sendEmail } from "../tools/emailSender.js";
import { logger } from "../utils/logger.js";

export async function emailNode(state: AgentState): Promise<AgentState> {
  logger.info("📧 Sending email...");

  await sendEmail(
    "yadavarp2003@gmail.com",
    "Job Application",
    state.email || ""
  );

  return state;
}