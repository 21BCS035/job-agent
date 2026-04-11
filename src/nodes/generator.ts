import { llm } from "../utils/llm.js";
import { safeLLM } from "../utils/llmWrapper.js";

export async function generateEmail(parsedJD: any, resume: string): Promise<string> {
  const prompt = `
You are an expert job application assistant.

Generate:
1. Highly personalized cold email
2. Short cover letter

STRICT RULES:
- Do NOT use placeholders (e.g., [Company Name], [Role])
- If company_name is provided and not "Unknown", use it explicitly
- If company_name is "Unknown", do NOT guess or infer it
- Do NOT use any company names from the resume as the target company
- Use ONLY the job description and provided inputs (no external assumptions)
- If company_name is known, personalize using company context (mission/product/domain)
- Include 3-4 relevant skills from the resume that match the job description
- Add 1 strong impact statement (quantified if possible)
- Keep the response concise, professional, and tailored

Job Details:
Company: ${parsedJD.company_name}
Role: ${parsedJD.role}
Skills Required: ${parsedJD.required_skills}
Responsibilities: ${parsedJD.responsibilities}

Company Info:
${parsedJD.company_info}

Candidate Resume:
${resume}

Make it feel like the candidate truly understands the company.
`;

  const response = await safeLLM(prompt);

  const content = response.content;
  if (typeof content === "string") {
    return content;
  }

  return content
    .map((block) => ("text" in block ? block.text : ""))
    .join("\n");
}