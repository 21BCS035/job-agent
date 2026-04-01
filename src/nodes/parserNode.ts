import type { AgentState } from "../graph/state.js";
import { parseJobDescription } from "./parser.js";

export async function parserNode(state: AgentState): Promise<AgentState> {
  console.log("🧠 Parsing...");
  const parsedJD = await parseJobDescription(state.rawJD!);

  return {
    ...state,
    parsedJD,
  };
}