import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "../utils/logger.js";

export async function getCompanyInfo(companyName: string) {
  try {
    const url = `https://www.google.com/search?q=${companyName}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    const description =
      $("meta[name='description']").attr("content") ||
      $("span").first().text();

    return description;
  } catch (error) {
    logger.error("⚠️ Company research failed");
    return "";
  }
}