import type { AgentState } from "../graph/state.js";

export async function sanityNode(state: AgentState): Promise<AgentState> {
  console.log("🧪 Sanity check...");

  if (!state.parsedJD?.company_name || state.parsedJD.company_name === "Unknown") {
    console.log("⚠️ Company not detected properly.");
  }

  return state;
}