import type { AgentState } from "../graph/state.js";
import { logger } from "../utils/logger.js";

export async function sanityNode(state: AgentState): Promise<AgentState> {
  logger.info("🧪 Sanity check...");

  if (!state.parsedJD?.company_name || state.parsedJD.company_name === "Unknown") {
    logger.error("⚠️ Company not detected properly.");
  }

  return state;
}