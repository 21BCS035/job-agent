import type { AgentState } from "../graph/state.js";
import { getResumeContext } from "./rag.js";

export async function ragNode(state: AgentState): Promise<AgentState> {
  console.log("📄 Loading resume...");
  const resume = getResumeContext();

  return {
    ...state,
    resume,
  };
}