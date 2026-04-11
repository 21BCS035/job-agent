import { llm } from "./llm.js";

let lastCall = 0;

export async function safeLLM(prompt: string) {
  const now = Date.now();

  if (now - lastCall < 1000) {
    await new Promise((r) => setTimeout(r, 1000));
  }

  lastCall = Date.now();

  return llm.invoke(prompt);
}