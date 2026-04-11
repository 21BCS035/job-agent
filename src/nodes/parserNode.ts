import type { AgentState } from "../graph/state.js";
import { logger } from "../utils/logger.js";
import { parseJobDescription } from "./parser.js";

export async function parserNode(state: AgentState): Promise<AgentState> {
  logger.info("🧠 Parsing...");
  const parsedJD = await parseJobDescription(state.rawJD!);

  return {
    ...state,
    parsedJD,
  };
}