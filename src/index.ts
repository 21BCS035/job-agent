import "dotenv/config";
import { createGraph } from "./graph/agent.js";
import { logger } from "./utils/logger.js";
import { jobInputSchema } from "./validation/input.js";
import { processJob } from "./services/jobService.js";


const jobs = [
  "https://apply.careers.microsoft.com/careers/job/1970393556754343?utm_source=linkedin&domain=microsoft.com&src=LinkedIn",
  "https://www.amazon.jobs/en/jobs/3153514/software-dev-engineer-i-amazon-university-talent-acquisition",
  "https://fa-extu-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/2477?utm_medium=jobboard&utm_source=linkedin",
];

async function main() {

  for (const jobUrl of jobs) {
    try {
      logger.info(`\n🚀 Processing: ${jobUrl}`);

      const input = jobInputSchema.parse({ jobUrl });

      const result = await processJob(input);

      logger.info("✅ Email Generated:");
      logger.info(result.email);
    } catch (err) {
      logger.error({err},`❌ Failed for ${jobUrl}`);
    }
  }
}

main();