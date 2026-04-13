import type { AgentState } from "../graph/state.js";
import { llm } from "../utils/llm.js";
import { safeLLM } from "../utils/llmWrapper.js";
import { logger } from "../utils/logger.js";

export async function validationNode(state: AgentState): Promise<AgentState> {
  logger.info("🔍 Validating job description...");

  const prompt = `
Check if the following text is a valid job description.

Text:
${state.rawJD}

Return JSON:
{
  "isValid": true/false
}
`;

  const response = await safeLLM(prompt);

  let isValid = true;

  try {
    const parsed = JSON.parse(response.content as string);
    isValid = parsed.isValid;
  } catch {}

  if (!isValid) {
    throw new Error("Invalid Job Description");
  }

  return state;
}