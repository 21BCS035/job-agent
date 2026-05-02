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
  /** RAG-selected excerpts for email generation (narrow, job-relevant). */
  resume: Annotation<string>(),
  /** Full résumé text (for skill matching and fallback). */
  resumeFull: Annotation<string | undefined>(),
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
  sendEmail: Annotation<boolean>(),
});

export type AgentState = typeof AgentStateAnnotation.State;