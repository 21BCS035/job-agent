import axios from "axios";

const API_KEY = process.env.HUNTER_API_KEY;

export async function findEmailsByDomain(domain: string) {
  try {
    const url = `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${API_KEY}`;

    const response = await axios.get(url);

    return response.data.data.emails;
  } catch (error) {
    console.log("❌ Hunter API failed");
    return [];
  }
}