const apiKey = "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";

async function translate(query) {
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: `Translate this natural language query into SQL:\n\n"${query}"\n\nSQL Query:`,
      temperature: 0.5,
      max_tokens: 2048, // Increased max_tokens to 2048 for more context
      n: 1,
      stop: "\n",
      model: "text-davinci-003",
      frequency_penalty: 0.5, // Added frequency_penalty and presence_penalty
      presence_penalty: 0.5,
      logprobs: 10, // Increased logprobs to 10 for more diverse output
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Error translating to SQL.");
  }

  return data.choices[0].text.trim();
}

export default translate;
