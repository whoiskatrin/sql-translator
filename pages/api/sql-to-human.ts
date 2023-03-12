import { NextApiRequest, NextApiResponse } from "next";
import translateToHuman from "../../src/translateToHuman";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { inputText } = req.body;
  try {
    const outputText = await translateToHuman(inputText, process.env.OPENAI_API_KEY);
    res.status(200).json({ outputText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error translating to natural language" });
  }
}
