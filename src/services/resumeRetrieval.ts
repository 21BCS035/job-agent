import { OpenAIEmbeddings } from "@langchain/openai";
import { createHash } from "node:crypto";
import { Pinecone } from "@pinecone-database/pinecone";
import { chunkResumeText } from "../utils/resumeChunk.js";
import type { AgentState } from "../graph/state.js";

type ResumeIndex = {
  chunks: string[];
  vectors: number[][];
  createdAtMs: number;
};

const resumeIndexCache = new Map<string, ResumeIndex>();
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});
const pineconeUpserted = new Set<string>();
let pineconeClient: Pinecone | null | undefined;

function getResumeFingerprint(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function getCacheCapacity(): number {
  const parsed = Number(process.env.RESUME_RAG_CACHE_SIZE ?? 24);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 24;
}

function isPineconeEnabled(): boolean {
  return Boolean(
    process.env.PINECONE_API_KEY?.trim() &&
      process.env.PINECONE_INDEX_NAME?.trim()
  );
}

function getPineconeNamespace(): string {
  return process.env.PINECONE_NAMESPACE?.trim() || "resume-rag";
}

function getPineconeClient(): Pinecone | null {
  if (!isPineconeEnabled()) return null;
  if (pineconeClient !== undefined) return pineconeClient;
  pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  return pineconeClient;
}

function touchCacheEntry(key: string, value: ResumeIndex): void {
  if (resumeIndexCache.has(key)) {
    resumeIndexCache.delete(key);
  }
  resumeIndexCache.set(key, value);
}

function evictIfNeeded(): void {
  const capacity = getCacheCapacity();
  while (resumeIndexCache.size > capacity) {
    const oldestKey = resumeIndexCache.keys().next().value as string | undefined;
    if (!oldestKey) break;
    resumeIndexCache.delete(oldestKey);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const x = a[i]!;
    const y = b[i]!;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

function joinScoredTexts(
  ranked: Array<{ text: string; score: number }>,
  topK: number,
  maxChars: number
): string {
  const out: string[] = [];
  let total = 0;
  for (const { text } of ranked.slice(0, topK)) {
    const sep = out.length ? "\n\n---\n\n" : "";
    if (total + sep.length + text.length > maxChars) break;
    out.push(text);
    total += sep.length + text.length;
  }
  return out.join("\n\n---\n\n");
}

async function queryPineconeByDocHash(
  docHash: string,
  queryVec: number[],
  topK: number,
  maxChars: number
): Promise<string | null> {
  const client = getPineconeClient();
  if (!client) return null;

  const indexName = process.env.PINECONE_INDEX_NAME!;
  const namespace = getPineconeNamespace();
  const index = client.index(indexName).namespace(namespace);
  const result = await index.query({
    vector: queryVec,
    topK,
    includeMetadata: true,
    filter: { docHash: { $eq: docHash } },
  });

  const ranked = (result.matches ?? [])
    .map((m) => {
      const text = typeof m.metadata?.text === "string" ? m.metadata.text : "";
      return { text, score: m.score ?? 0 };
    })
    .filter((m) => m.text.trim().length > 0);

  if (ranked.length === 0) return null;
  return joinScoredTexts(ranked, topK, maxChars) || null;
}

async function upsertPineconeDoc(
  docHash: string,
  chunks: string[],
  vectors: number[][]
): Promise<void> {
  const client = getPineconeClient();
  if (!client) return;
  if (pineconeUpserted.has(docHash)) return;

  const indexName = process.env.PINECONE_INDEX_NAME!;
  const namespace = getPineconeNamespace();
  const index = client.index(indexName).namespace(namespace);
  const vectorsPayload = chunks.map((text, i) => ({
    id: `${docHash}:${i}`,
    values: vectors[i]!,
    metadata: {
      docHash,
      chunkIndex: i,
      text,
    },
  }));
  await index.upsert({ records: vectorsPayload });
  pineconeUpserted.add(docHash);
  console.log(`🧠 Pinecone upserted resume chunks=${chunks.length}`);
}

function buildRetrievalQuery(parsed: AgentState["parsedJD"] | undefined): string {
  if (!parsed) return "";
  const parts = [
    parsed.role,
    parsed.company_name,
    ...(parsed.required_skills ?? []),
    parsed.responsibilities?.slice(0, 2500),
    ...(parsed.matched_skills ?? []),
  ].filter((p): p is string => Boolean(p && String(p).trim()));
  return parts.join("\n");
}

export async function retrieveRelevantResumeExcerpts(
  fullResume: string,
  parsedJD: AgentState["parsedJD"] | undefined,
  options?: { topK?: number; maxChars?: number }
): Promise<string> {
  const trimmed = fullResume.trim();
  if (!trimmed) return "";

  const topK = options?.topK ?? 6;
  const maxChars = options?.maxChars ?? 4500;
  const pineconeEnabled = isPineconeEnabled();

  if (!pineconeEnabled && trimmed.length < 1400) return trimmed;

  const chunks = chunkResumeText(trimmed);
  if (chunks.length === 0) return trimmed;

  if (!pineconeEnabled && chunks.length <= topK) return chunks.join("\n\n---\n\n");

  const queryText = buildRetrievalQuery(parsedJD).trim() || trimmed.slice(0, 1200);

  try {
    const queryVec = await embeddings.embedQuery(queryText);
    const fingerprint = getResumeFingerprint(trimmed);

    if (pineconeEnabled) {
      const fromPinecone = await queryPineconeByDocHash(
        fingerprint,
        queryVec,
        topK,
        maxChars
      );
      if (fromPinecone) {
        console.log("⚡ Pinecone retrieval hit");
        return fromPinecone;
      }
    }

    let index = resumeIndexCache.get(fingerprint);

    if (!index) {
      const vectors = await embeddings.embedDocuments(chunks);
      index = {
        chunks,
        vectors,
        createdAtMs: Date.now(),
      };
      touchCacheEntry(fingerprint, index);
      evictIfNeeded();
      console.log(`📚 Resume index built (chunks=${chunks.length}, cache=${resumeIndexCache.size})`);
    } else {
      touchCacheEntry(fingerprint, index);
      console.log(`⚡ Resume index cache hit (chunks=${index.chunks.length})`);
    }

    if (pineconeEnabled) {
      await upsertPineconeDoc(fingerprint, index.chunks, index.vectors);
      const afterUpsert = await queryPineconeByDocHash(
        fingerprint,
        queryVec,
        topK,
        maxChars
      );
      if (afterUpsert) {
        return afterUpsert;
      }
    }

    const scored = index.chunks.map((text, i) => ({
      text,
      score: cosineSimilarity(queryVec, index.vectors[i]!),
    }));
    scored.sort((a, b) => b.score - a.score);
    const out = joinScoredTexts(scored, topK, maxChars);
    return out || trimmed;
  } catch (err) {
    console.warn("⚠️ Resume RAG retrieval failed, using full résumé:", err);
    return trimmed;
  }
}
