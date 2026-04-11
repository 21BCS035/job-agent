import { config } from "../config.js";
import type { AgentState } from "../graph/state.js";
import { sendEmail } from "../tools/emailSender.js";
import { logger } from "../utils/logger.js";

export async function emailNode(state: AgentState): Promise<AgentState> {
  if (!config.SEND_EMAIL) {
  logger.info("📧 Skipping email (disabled)");
  return state;
}
  logger.info("📧 Sending email...");

  await sendEmail(
    "21bcs035@iiitdmj.ac.in",
    "Job Application",
    state.email || ""
  );

  return state;
}