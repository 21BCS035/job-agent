import type { AgentState } from "../graph/state.js";
import { llm } from "../utils/llm.js";
import { logger } from "../utils/logger.js";

export async function skillMatchNode(state: AgentState): Promise<AgentState> {
  logger.info("🎯 Matching skills...");

  const prompt = `
Compare the job skills and resume.

Job Skills:
${state.parsedJD?.required_skills}

Resume:
${state.resume}

Return top 3 matching skills in JSON:
{
  "matched_skills": ["skill1", "skill2", "skill3"]
}
`;

  const response = await llm.invoke(prompt);

  let matched = [];

  try {
    matched = JSON.parse(response.content as string).matched_skills;
  } catch {}

  return {
    ...state,
    parsedJD: {
      ...state.parsedJD,
      matched_skills: matched,
    },
  };
}