import { llm } from "../utils/llm.js";

export async function generateEmail(jd: string, resume: string): Promise<string> {
  const prompt = `
You are a professional job applicant.

Using the job description and resume below, generate:
1. A cold email
2. A short cover letter

Job Description:
${jd}

Resume:
${resume}
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