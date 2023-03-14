import { NextApiRequest, NextApiResponse } from "next";
import rateLimit from "express-rate-limit";
import translateToHuman from "../../src/translateToHuman";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not defined in .env file. Please add it there (see README.md for more details)."
  );
}


export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { inputText } = req.body;
  try {
    const outputText = await translateToHuman(
      inputText,
      process.env.OPENAI_API_KEY
    );
    res.status(200).json({ outputText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error translating to natural language" });
  }
}


export const rateLimitedHandler = limiter(handler);
