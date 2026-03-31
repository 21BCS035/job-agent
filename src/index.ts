import "dotenv/config";
import { createGraph } from "./graph/agent.js";

async function main() {
  const app = createGraph();

  const result = await app.invoke({
    jobUrl: "https://apply.careers.microsoft.com/careers/job/1970393556754343?utm_source=linkedin&domain=microsoft.com&src=LinkedIn",
  });

  console.log("\n✅ FINAL OUTPUT:\n");
  console.log(result.email);
}

main();