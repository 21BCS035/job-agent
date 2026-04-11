import { chromium } from "playwright";
import { logger } from "../utils/logger.js";

export async function scrapeJob(url: string) {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: "load", 
      timeout: 60000,  
    });

    await page.waitForTimeout(3000);

    const content = await page.evaluate(() => {
      const selectors = [
        "main",
        "[class*='job-description']",
        "[class*='description']",
        "[id*='job-description']",
        "article",
        "body",
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent?.trim()) {
          return el.textContent.trim();
        }
      }

      return document.body.textContent?.trim() ?? "No content found";
    });

    return content;

  } catch (error) {
    logger.error({error},"Scraping failed:");
    throw error;
  } finally {
    await browser.close();
  }
}