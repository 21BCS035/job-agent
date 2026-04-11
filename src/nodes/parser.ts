//Convert raw text → structured data
import { llm } from "../utils/llm.js";
import { safeLLM } from "../utils/llmWrapper.js";
import { logger } from "../utils/logger.js";

export async function parseJobDescription(text: string) {
  const prompt = `
You are a strict JSON generator.

Extract:
- company_name
- role
- required_skills (array)
- responsibilities (short summary)

IMPORTANT:
- Return ONLY raw JSON
- NO markdown
- NO backticks
- NO explanation

Job Description:
${text}
`;

  const response = await safeLLM(prompt);
  let content = response.content as string;

  content = content.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(content);
  } catch (e) {
    logger.error({ content }, "❌ Parser failed. Raw output");
        return {
      company_name: "Unknown",
      role: "Unknown",
      required_skills: [],
      responsibilities: "",
    };
  }
}