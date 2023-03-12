import React, { useState } from "react";
import Head from "next/head";
import translate from "../src/sqlTranslator";
import Github from "../components/GitHub";

export default function Home(props: { apiKey: any; }) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await translate(inputText, props.apiKey);
      setOutputText(result);
    } catch (error) {
      console.log(error);
      setOutputText("Error translating to SQL.");
    }
    setIsLoading(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Human to SQL Translator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-lg mx-auto my-12 px-4">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/whoiskatrin/sql-translator"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="text-3xl font-bold text-center mb-8">
          Human to SQL Translator
        </h1>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="inputText" className="block text-gray-700 font-bold mb-2">
              Input Text
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="inputText"
              rows={3}
              placeholder="e.g. show me all the cars that are red"
              value={inputText}
              onChange={handleInputChange}
              required
              autoFocus
            ></textarea>

          </div>
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading && "opacity-50 cursor-not-allowed"
              }`}
            disabled={isLoading}
          >
            {isLoading ? "Translating..." : "Translate to SQL"}
          </button>
        </form>

        {outputText && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <label htmlFor="outputText" className="block text-gray-700 font-bold mb-2">
              Output Text
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="outputText"
              rows={3}
              value={outputText}
              readOnly
            ></textarea>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const apiKey = process.env.OPENAI_API_KEY;
  return { props: { apiKey } };
}

