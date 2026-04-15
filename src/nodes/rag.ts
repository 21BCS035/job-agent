import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const PDFParse =
  pdfParseModule?.PDFParse ??
  pdfParseModule?.default?.PDFParse ??
  pdfParseModule?.default;

export async function getResumeContext(resumePath?: string) {

  try {
    if (resumePath) {

      const buffer = fs.readFileSync(resumePath);

      if (resumePath.endsWith(".pdf")) {
        console.log("📄 Parsing PDF...");
        if (!PDFParse) {
          throw new Error("pdf-parse did not expose PDFParse class");
        }

        const parser = new PDFParse({ data: new Uint8Array(buffer) });
        let data;
        try {
          data = await parser.getText();
        } finally {
          await parser.destroy();
        }
        return data.text;
      }

      return buffer.toString("utf-8");
    }

    return fs.readFileSync("resume.txt", "utf-8");

  } catch (err) {
    console.error("❌ Resume loading failed — actual error:", err);
    return "";
  }
}