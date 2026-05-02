/**
 * Split résumé text into overlapping chunks for embedding / retrieval.
 * Paragraphs are preserved when short; long blocks are windowed.
 */
export function chunkResumeText(
  text: string,
  opts?: { maxChunkChars?: number; overlapChars?: number; minChunkChars?: number }
): string[] {
  const max = opts?.maxChunkChars ?? 900;
  const overlap = opts?.overlapChars ?? 120;
  const minChunk = opts?.minChunkChars ?? 25;

  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!normalized) return [];

  const blocks = normalized.split(/\n{2,}/).flatMap((block) => {
    const t = block.trim();
    if (!t) return [];
    if (t.length <= max) return [t];

    const parts: string[] = [];
    let start = 0;
    while (start < t.length) {
      const end = Math.min(start + max, t.length);
      const slice = t.slice(start, end).trim();
      if (slice.length >= minChunk) parts.push(slice);
      if (end >= t.length) break;
      start = Math.max(0, end - overlap);
    }
    return parts;
  });

  return [...new Set(blocks)].filter((c) => c.length >= minChunk);
}
