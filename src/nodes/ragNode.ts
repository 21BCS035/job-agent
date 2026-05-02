import type { AgentState } from "../graph/state.js";
import { logger } from "../utils/logger.js";
import { getResumeContext } from "./rag.js";
import { retrieveRelevantResumeExcerpts } from "../services/resumeRetrieval.js";

export async function ragNode(state: AgentState): Promise<AgentState> {
  logger.info("📄 Loading resume");
  logger.info(
    `🧠 Pinecone enabled: ${Boolean(
      process.env.PINECONE_API_KEY?.trim() &&
        process.env.PINECONE_INDEX_NAME?.trim()
    )}`
  );

  const resumeFull = await getResumeContext(state.resumePath);
  const resume =
    process.env.RESUME_RAG === "0"
      ? resumeFull
      : await retrieveRelevantResumeExcerpts(resumeFull, state.parsedJD);

  return {
    ...state,
    resumeFull,
    resume,
  };
}