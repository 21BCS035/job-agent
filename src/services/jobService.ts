import { createGraph } from "../graph/agent.js";

const app = createGraph();

export async function processJob(input: { jobUrl: string }) {
  return app.invoke(input);
}