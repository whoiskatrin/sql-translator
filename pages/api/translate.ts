import { NextApiRequest, NextApiResponse } from "next";
import translateToSQL from "../../src/translateToSQL";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { inputText } = req.body;
    try {
      const result = await translateToSQL(inputText, process.env.OPENAI_API_KEY);
      res.status(200).json({ outputText: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error translating to SQL" });
    }
  }
  