import type { AgentState } from "../graph/state.js";
import { logger } from "../utils/logger.js";
import { getResumeContext } from "./rag.js";

export async function ragNode(state: AgentState): Promise<AgentState> {
  logger.info("📄 Loading resume...");

  const resume = await getResumeContext(state.resumePath);

  return {
    ...state,
    resume,
  };
}