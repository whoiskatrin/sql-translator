import fetch from "isomorphic-unfetch";

const translateToSQL = async (query, apiKey, tableSchema = "") => {

  // Validate inputs
  if (!query || !apiKey) {
    throw new Error("Missing query or API key.");
  }

  const prompt = `Translate this natural language query into SQL without changing the case of the entries given by me:\n\n"${query}"\n\n${tableSchema ? `Use this table schema:\n\n${tableSchema}\n\n` : ''}SQL Query:`;
  
  console.log(prompt);
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      temperature: 0.5,
      max_tokens: 2048,
      n: 1,
      stop: "\\n",
      model: "gpt-3.5-turbo-instruct",
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      logprobs: 10,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("API Error:", response.status, data);
    throw new Error(data.error || "Error translating to SQL.");
  }

  return data.choices[0].text.trim();
};

export default translateToSQL;
