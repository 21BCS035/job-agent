import { z } from "zod";

const urlSchema = z.string().refine(
  (val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid URL" }
);

export const jobInputSchema = z.object({
  jobUrl: urlSchema,
  receiverEmail: z.email().optional(),
});