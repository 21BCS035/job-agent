import type { AgentState } from "../graph/state.js";
import { llm } from "../utils/llm.js";

export async function decisionNode(state: AgentState): Promise<AgentState> {
  console.log("🧠 Deciding whether to scrape...");

  const prompt = `
You are an AI agent.

Input: ${state.jobUrl}

Decide:
- If this is a URL → shouldScrape = true
- If this is already job description text → shouldScrape = false

Return ONLY JSON:
{
  "shouldScrape": true/false
}
`;

  const response = await llm.invoke(prompt);

  let shouldScrape = true;

  try {
    const parsed = JSON.parse(response.content as string);
    shouldScrape = parsed.shouldScrape;
  } catch {
    console.log("⚠️ Defaulting to scrape");
  }

  return {
    ...state,
    shouldScrape,
  };
}