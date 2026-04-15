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
  resumePath: Annotation<string>(),
  resumeFileName: Annotation<string | undefined>(),
  email:    Annotation<{
    subject:     string;
    body:        string;
    coverLetter: string | undefined;
  }>(),
  shouldScrape: Annotation<boolean>(),
  finalReceiverEmail: Annotation<string | undefined>(),
  receiverEmail:      Annotation<string | undefined>(),
  isEmailValid:      Annotation<boolean | undefined>(),
});

export type AgentState = typeof AgentStateAnnotation.State;