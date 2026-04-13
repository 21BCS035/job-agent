import type { AgentState } from "../graph/state.js";
import { verifyEmail } from "../services/emailVerifier.js";

export async function emailVerifyNode(
  state: AgentState
): Promise<AgentState> {
  console.log("🔍 Verifying email...");

  const email = state.finalReceiverEmail;

  if (!email) {
    return {
      ...state,
      isEmailValid: false,
    };
  }

  const isValid = await verifyEmail(email);

  if (!isValid) {
    console.log("❗ Invalid email detected:", email);
  }

  return {
    ...state,
    isEmailValid: isValid,
  };
}