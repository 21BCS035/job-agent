import type { AgentState } from "../graph/state.js";
import { findEmailsByDomain } from "../services/hunterService.js";
import { getDomainFromCompany } from "../utils/domain.js";

export async function emailDecisionNode(
  state: AgentState
): Promise<AgentState> {
  console.log("📧 Resolving receiver email...");

  // ✅ Case 1: User provided
  if (state.receiverEmail) {
    console.log("receiver email is : ", state.receiverEmail);
    return {
      ...state,
      finalReceiverEmail: state.receiverEmail,
    };
  }

  const company = state.parsedJD?.company_name;

  if (!company) {
    console.log("❗ No company name found");
    return state;
  }

  const domain = getDomainFromCompany(company);

  if (!domain) {
    console.log("❗ Could not derive domain");
    return state;
  }

  console.log("🔍 Searching emails for domain:", domain);

  const emails = await findEmailsByDomain(domain);

  if (!emails || emails.length === 0) {
    console.log("❗ No emails found via Hunter");
    return state;
  }
   console.log("emails from hunter api : ",emails);
  // 🎯 Prefer HR / recruiting emails
  const preferred =
    emails.find((e: any) =>
      e.value.includes("hr") ||
      e.value.includes("recruit") ||
      e.value.includes("careers")
    ) || emails[0];

  console.log("✅ Selected email:", preferred.value);

  return {
    ...state,
    finalReceiverEmail: preferred.value,
  };
}