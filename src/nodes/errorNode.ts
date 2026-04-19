import type { AgentState } from "../graph/state.js";

export async function errorNode(state: AgentState): Promise<AgentState> {
  console.log("⚠️ Handling error safely...");
  return {
    ...state,
    email: {
      subject: "Application processing failed",
      body: "Something went wrong. Please try again.",
      coverLetter: undefined,
    },
  };
}