import fs from "fs";

export function getResumeContext() {
  const resume = fs.readFileSync("resume.txt", "utf-8");
  return resume;
}