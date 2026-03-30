// extract job description from URL
import { chromium } from "playwright";

export async function scrapeJob(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const content = await page.evaluate(() => {
    return document.body.innerText;
  });

  await browser.close();

  return content;
}