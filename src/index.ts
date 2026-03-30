import "dotenv/config";
import { createGraph } from "./graph/agent.js";

async function main() {
  const app = createGraph();

  const result = await app.invoke({
    jobUrl: "https://careers.ibm.com/en_US/careers/JobDetail?jobId=74371&source=SN_LinkedIn",
  });

  console.log("\n✅ FINAL OUTPUT:\n");
  console.log(result.email);
}

main();