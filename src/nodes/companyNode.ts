import type { AgentState } from "../graph/state.js";
import { getCompanyInfo } from "../tools/companyResearch.js";

export async function companyNode(state: AgentState): Promise<AgentState> {
  console.log("🏢 Researching company...");

  const companyName = state.parsedJD?.company_name || "";

  if (!companyName) {
    return state;
  }

  const info = await getCompanyInfo(companyName);

  return {
    ...state,
    parsedJD: {
      ...state.parsedJD,
      company_info: info,
    },
  };
}