import { createGraph } from "../graph/agent.js";
import { jobInputSchema } from "../validation/input.js";

const app = createGraph();

export async function processJob(input: { 
    jobUrl: string;
    receiverEmail?: string;
    resumePath?: string;
    resumeFileName?: string;
}) {
  jobInputSchema.parse(input);

  const result = await app.invoke(input);

  return {
    email: result.email,
    company: result.parsedJD?.company_name,
    role: result.parsedJD?.role,
    finalReceiverEmail: result.finalReceiverEmail,
    isEmailValid: result.isEmailValid,
    parsedJD: result.parsedJD,
    resumePath: result.resumePath,
    resumeFileName: result.resumeFileName
  };
}