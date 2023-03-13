import fetch from "isomorphic-unfetch";

const translateToSQL = async (query, apiKey, tableSchema = "") => {
  let prompt = `Translate this natural language query into SQL:\n\n"${query}"\n\nSQL Query:`;
  if (tableSchema) {
    prompt = `Translate this natural language query into SQL:\n\n"${query}"\n\nUse this table schema:\n\n${tableSchema}\n\n${prompt}`;
  }
  console.log(prompt);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      max_tokens: 2048,
      stream: false,
      n: 1,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.log(response);
    throw new Error(data.error || "Error translating to SQL.");
  }

  return data.choices[0].message?.content.trim();
};

export default translateToSQL;
