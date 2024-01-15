import fetch from "isomorphic-unfetch";

const translateToHuman = async (query, apiKey) => {
  // Validate inputs
  if (!query || !apiKey) {
    throw new Error("Missing query or API key.");
  }

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: `Translate this SQL query into natural language:\n\n"${query}"\n\nNatural language query:`,
      temperature: 0.5,
      max_tokens: 2048,
      n: 1,
      stop: "\\n",
      model: "text-davinci-003",
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      logprobs: 10,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("API Error:", response.status, data);
    throw new Error(data.error || "Error translating to human language.");
  }

  return data.choices[0].text.trim();
};

export default translateToHuman;
