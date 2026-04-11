import { createGraph } from "../graph/agent.js";
import { jobInputSchema } from "../validation/input.js";

const app = createGraph();

export async function processJob(input: { jobUrl: string }) {
  jobInputSchema.parse( input );

  const result = await app.invoke( input );

  return {
    email: result.email,
    company: result.parsedJD?.company_name,
    role: result.parsedJD?.role,
  };
}