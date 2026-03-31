import type { AgentState } from "../graph/state.js";
import { parseJobDescription } from "./parser.js";

export async function parserNode(state: AgentState): Promise<AgentState> {
  console.log("🧠 Parsing...");
  const parsedJD = await parseJobDescription(state.rawJD!);
  console.log("\n📦 Parsed JD:\n", parsedJD);

  return {
    ...state,
    parsedJD,
  };
}