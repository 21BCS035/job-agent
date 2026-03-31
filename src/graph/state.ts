import { Annotation } from "@langchain/langgraph";

export const AgentStateAnnotation = Annotation.Root({
  jobUrl:   Annotation<string>(),
  rawJD:    Annotation<string>(),
    parsedJD: Annotation<{
    company_name?:    string;
    role?:            string;
    required_skills?: string[];
    responsibilities?: string;
    matched_skills?:  string[];
    company_info?: string;
  }>(),
  resume:   Annotation<string>(),
  email:    Annotation<string>(),
  shouldScrape: Annotation<boolean>(),
});

export type AgentState = typeof AgentStateAnnotation.State;