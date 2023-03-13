import { NextApiRequest, NextApiResponse } from "next";
import translateToSQL from "../../src/translateToSQL";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not defined in .env file. Please add it there (see README.md for more details)."
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { inputText, tableSchema } = req.body;
  try {
    const result = await translateToSQL(
      inputText,
      process.env.OPENAI_API_KEY,
      tableSchema
    );
    // console.log(res);
    res.status(200).json({ outputText: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error translating to SQL" });
  }
}
