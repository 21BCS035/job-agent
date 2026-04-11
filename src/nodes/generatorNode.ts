import type { AgentState } from "../graph/state.js";
import { logger } from "../utils/logger.js";
import { generateEmail } from "./generator.js";

export async function generatorNode(state: AgentState): Promise<AgentState> {
  logger.info("✉️ Generating email...");
  const email = await generateEmail(state.parsedJD!, state.resume!);

  return {
    ...state,
    email,
  };
}