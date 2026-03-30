//Convert raw text → structured data
import { llm } from "../utils/llm.js";

export async function parseJobDescription(text: string) {
  const prompt = `
Extract the following from the job description:
- Role
- Required skills
- Experience

Job Description:
${text}

Return in JSON format.
`;

  const response = await llm.invoke(prompt);

  const content = response.content;
  if (typeof content === "string") {
    return content;
  }

  return content
    .map((block) => ("text" in block ? block.text : ""))
    .join("\n");
}