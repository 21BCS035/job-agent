import { Annotation } from "@langchain/langgraph";

export const AgentStateAnnotation = Annotation.Root({
  jobUrl:   Annotation<string>(),
  rawJD:    Annotation<string>(),
  parsedJD: Annotation<string>(),
  resume:   Annotation<string>(),
  email:    Annotation<string>(),
  shouldScrape: Annotation<boolean>(),
});

export type AgentState = typeof AgentStateAnnotation.State;