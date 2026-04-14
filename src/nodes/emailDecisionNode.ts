import type { AgentState } from "../graph/state.js";
import { findEmailsByDomain } from "../services/hunterService.js";
import { getDomainFromCompany } from "../utils/domain.js";
import { verifyEmail } from "../services/emailVerifier.js";

export async function emailDecisionNode(
  state: AgentState
): Promise<AgentState> {
  console.log("📧 Resolving receiver email...");

  // ✅ Case 1: User provided email
  if (state.receiverEmail) {
    const isValid = await verifyEmail(state.receiverEmail);

    return {
      ...state,
      finalReceiverEmail: isValid ? state.receiverEmail : undefined,
      isEmailValid: isValid,
    };
  }

  const company = state.parsedJD?.company_name;
  if (!company) return state;

  const domain = getDomainFromCompany(company);
  if (!domain) return state;

  console.log("🔍 Searching emails for domain:", domain);

  const emails = await findEmailsByDomain(domain);

  if (!emails || emails.length === 0) {
    console.log("❗ No emails found");
    return state;
  }

  // 🎯 Sort emails (HR first)
  const sortedEmails = emails.sort((a: any, b: any) => {
    const score = (e: any) => {
      let s = 0;

      if (e.value.includes("hr")) s += 5;
      if (e.value.includes("recruit")) s += 5;
      if (e.value.includes("careers")) s += 5;
      if (e.department === "hr") s += 5;
      if (e.seniority === "senior") s += 2;

      return s;
    };

    return score(b) - score(a);
  });

  // 🔁 Try emails one by one
  for (const e of sortedEmails) {
    console.log("🔍 Trying:", e.value);

    const isValid = await verifyEmail(e.value);

    if (isValid) {
      console.log("✅ Valid email found:", e.value);

      return {
        ...state,
        finalReceiverEmail: e.value,
        isEmailValid: true,
      };
    } else {
      console.log("❌ Invalid:", e.value);
    }
  }

  console.log("❗ No valid email found after trying all");

  return {
    ...state,
    finalReceiverEmail: undefined,
    isEmailValid: false,
  };
}