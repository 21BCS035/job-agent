import axios from "axios";

const API_KEY = process.env.HUNTER_API_KEY;

export async function verifyEmail(email: string): Promise<boolean> {
  try {
    const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${API_KEY}`;

    const res = await axios.get(url);

    const status = res.data.data.status;

    console.log("📬 Verification status:", status);

    return status === "valid";
  } catch (error) {
    console.log("❌ Email verification failed");
    return false;
  }
}