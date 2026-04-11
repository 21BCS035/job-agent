import "dotenv/config";
import { createGraph } from "./graph/agent.js";
import { logger } from "./utils/logger.js";

async function main() {
  const app = createGraph();

  const result = await app.invoke({
    jobUrl: "https://apply.careers.microsoft.com/careers/job/1970393556754343?utm_source=linkedin&domain=microsoft.com&src=LinkedIn",
  });

  logger.info("\n✅ FINAL OUTPUT:\n");
  logger.info(result.email);
}

main();