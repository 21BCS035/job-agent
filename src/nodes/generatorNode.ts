import type { AgentState } from "../graph/state.js";
import { generateEmail } from "./generator.js";

export async function generatorNode(state: AgentState): Promise<AgentState> {
  console.log("✉️ Generating email...");
  const email = await generateEmail(state.parsedJD!, state.resume!);

  return {
    ...state,
    email,
  };
}