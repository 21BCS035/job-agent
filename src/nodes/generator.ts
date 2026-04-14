import { safeLLM } from "../utils/llmWrapper.js";

export async function generateEmail(parsedJD: any, resume: string) {
const prompt = `
You are an expert job application assistant.

Generate:
1. Email subject
2. Email body (professional cold email)
3. Short cover letter

STRICT RULES:
- Return ONLY valid JSON
- No markdown, no code blocks
- Use \\n for line breaks between paragraphs
- Email body MUST follow this exact structure:
    Line 1: "Dear [Company] Hiring Team,"
    Line 2: (empty line)
    Line 3: Opening paragraph - express interest in the role
    Line 4: (empty line)
    Line 5: Middle paragraph - highlight relevant experience and skills
    Line 6: (empty line)
    Line 7: Closing paragraph - thank them and express eagerness
    Line 8: (empty line)
    Line 9: "Best regards,"
    Line 10: Candidate full name
    Line 11: "Email: " + candidate email
    Line 12: "Mobile: " + candidate mobile number

- DO NOT merge paragraphs into one block
- DO NOT use curly braces for sign-off
- DO NOT include subject line in body
- NO placeholders like [Your Name]
- Make it feel personal and specific to the company

FORMAT:
{
  "subject": "...",
  "body": "Dear ...\\n\\nOpening paragraph...\\n\\nMiddle paragraph...\\n\\nClosing paragraph...\\n\\nBest regards,\\nCandidate Name\\nEmail: ...\\nMobile: ...",
  "coverLetter": "..."
}

Job Details:
Company: ${parsedJD.company_name ?? "Not specified"}
Role: ${parsedJD.role ?? "Not specified"}
Skills Required: ${parsedJD.required_skills?.join(", ") ?? "Not specified"}
Responsibilities: ${parsedJD.responsibilities ?? "Not specified"}

Company Info:
${parsedJD.company_info ?? "Not available"}

Candidate Resume:
${resume}

Make it feel like the candidate truly understands the company and the role.
`;

  const response = await safeLLM(prompt);

  const raw = response.content;
  let content = typeof raw === "string"
    ? raw
    : (raw as any[]).map((b) => ("text" in b ? b.text : "")).join("\n");

  content = content.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("❌ Generator JSON parsing failed");
    console.error("Raw content was:", content);
    return {
      subject: "Job Application",
      body: content,
      coverLetter: "",
    };
  }
}