import type { AgentState } from "../graph/state.js";
import { logger } from "../utils/logger.js";
import { retry } from "../utils/retry.js";
import { scrapeJob } from "./scraper.js";

export async function scraperNode(state: AgentState): Promise<AgentState> {
  logger.info("🔍 Scraping job...");
  const rawJD = await retry(() => scrapeJob(state.jobUrl));

  return {
    ...state,
    rawJD,
  };
}