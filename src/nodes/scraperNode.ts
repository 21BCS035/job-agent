import type { AgentState } from "../graph/state.js";
import { scrapeJob } from "./scraper.js";

export async function scraperNode(state: AgentState): Promise<AgentState> {
  console.log("🔍 Scraping job...");
  const rawJD = await scrapeJob(state.jobUrl);

  return {
    ...state,
    rawJD,
  };
}