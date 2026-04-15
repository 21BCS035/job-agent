import { z } from "zod";

export const jobInputSchema = z.object({
  jobUrl: z.string().trim().min(1, "jobUrl is required"),
  receiverEmail: z.email().optional(),
  resumePath: z.string().optional(),
  resumeFileName: z.string().optional(),
});