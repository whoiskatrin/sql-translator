import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter"));
import { vs, dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Head from "next/head";
import Github from "../components/GitHub";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Analytics } from "@vercel/analytics/react";
import Footer from "../components/Footer";
import ThemeButton from "../components/ThemeButton";
import {
  faCopy,
  faTrashAlt,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslate } from "../hooks/useTranslate";
import { toast } from "react-hot-toast";
import LoadingDots from "../components/LoadingDots";
import { useTheme } from "next-themes";
import Toggle from '../components/Toggle';

interface IHistory {
  inputText: string;
  tableSchema?: string;
  isHumanToSql?: boolean;
}

export default function Home() {
  const { theme } = useTheme();
  const isThemeDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  const {
    translate,
    translating,
    outputText,
    setOutputText,
    translationError,
  } = useTranslate();
  const [inputText, setInputText] = useState("");
  const [isHumanToSql, setIsHumanToSql] = useState(true);
  const [isOutputTextUpperCase, setIsOutputTextUpperCase] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [tableSchema, setTableSchema] = useState("");
  const [showTableSchema, setShowTableSchema] = useState(false);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (translationError) toast.error(translationError);
  }, [translationError]);

  if (!mounted) {
    return null;
  }

  const isValidTableSchema = (text: string) => {
    console.log(text);
    const pattern = /^CREATE\s+TABLE\s+\w+\s*\((\s*.+\s*,?\s*)+\);?$/i;
    const regex = new RegExp(pattern);
    return regex.test(text);
  };

  const addHistoryEntry = (entry: IHistory) => {
    if (history.some(({inputText}) => inputText === entry.inputText)) return
    setHistory([...history, entry]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    if (!showTableSchema) {
      setTableSchema("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const handleEdit = (entry: IHistory) => {
    const { inputText, tableSchema, isHumanToSql } = entry;
    setInputText(JSON.parse(inputText));
    tableSchema ? setTableSchema(tableSchema) : setTableSchema("");
    isHumanToSql ? setIsHumanToSql(isHumanToSql) : setIsHumanToSql(false);
    setOutputText("");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setTableSchema("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Validate input syntax
      if (!isHumanToSql) {
        const pattern =
          /^\s*(select|insert|update|delete|create|alter|drop|truncate|grant|revoke|use|begin|commit|rollback)\s/i;
        const regex = new RegExp(pattern);
        if (!regex.test(inputText)) {
          toast.error("Invalid SQL syntax.");
          return;
        }
      }
      if (showTableSchema && !isValidTableSchema(tableSchema)) {
        toast.error("Invalid table schema.");
        return;
      }

      addHistoryEntry({
        inputText: JSON.stringify(inputText),
        tableSchema,
        isHumanToSql,
      });

      translate({ inputText, tableSchema, isHumanToSql });
    } catch (error) {
      console.log(error);
      toast.error(`Error translating ${isHumanToSql ? "to SQL" : "to human"}.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>
          {isHumanToSql ? "Human to SQL Translator" : "SQL to Human Translator"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-lg mx-auto my-12 px-4">
        <ThemeButton className="absolute top-2.5 right-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition" />
        <div className="flex items-center justify-center">
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-500 bg-blue-600 font-medium transition"
            href="https://github.com/whoiskatrin/sql-translator"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>Star on GitHub</p>
          </a>
        </div>

        <h1 className="text-3xl font-bold text-center mt-4 mb-8">
          {isHumanToSql ? "Human to SQL Translator" : "SQL to Human Translator"}
        </h1>

        <form
          onSubmit={(event) => handleSubmit(event)}
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="flex flex-col mb-4">
            <label htmlFor="inputText" className="block font-bold mb-2">
              {isHumanToSql ? "Human Language Query" : "SQL Query"}
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="inputText"
              rows={3}
              placeholder={
                isHumanToSql
                  ? "e.g. show me all the cars that are red"
                  : "SELECT * FROM cars WHERE color = 'red'"
              }
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  handleSubmit(event);
                }
              }}
              required
            />
          </div>
          {tableSchema && showTableSchema && (
            <div className="mt-4">
              <h2 className="font-bold text-lg mb-2">Table Schema</h2>
              <SyntaxHighlighter
                language="sql"
                style={isThemeDark ? dracula : vs}
                wrapLines={true}
                showLineNumbers={true}
                lineNumberStyle={{ color: isThemeDark ? "gray" : "#ccc" }}
                customStyle={{
                  maxHeight: "none",
                  height: "auto",
                  overflow: "visible",
                  wordWrap: "break-word",
                  color: "inherit",
                  backgroundColor: isThemeDark ? "#374151" : "#fff",
                  borderColor: "#6b7280",
                  borderRadius: 4,
                  borderWidth: 1,
                }}
                lineProps={{ style: { whiteSpace: "pre-wrap" } }}
              >
                {tableSchema}
              </SyntaxHighlighter>
            </div>
          )}

          {isHumanToSql && (
            <div className="flex items-center mb-4">
              <input
                id="showTableSchema"
                type="checkbox"
                checked={showTableSchema}
                onChange={() => {
                  setShowTableSchema(!showTableSchema);
                  if (!showTableSchema) {
                    setTableSchema("");
                  }
                }}
                className="mr-2"
              />
              <label htmlFor="showTableSchema">Provide Table Schema</label>
            </div>
          )}

          {isHumanToSql && showTableSchema && (
            <div className="flex flex-col mb-4">
              <label htmlFor="tableSchema" className="block font-bold mb-2">
                Table Schema (optional)
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="tableSchema"
                rows={3}
                placeholder="e.g. CREATE TABLE cars (id INT, make TEXT, model TEXT, year INT, color TEXT)"
                value={tableSchema}
                autoFocus
                onChange={(event) => setTableSchema(event.target.value)}
                onBlur={() => {
                  if (!showTableSchema) {
                    setTableSchema("");
                  }
                }}
              />
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon
                onClick={handleClear}
                icon={faTrashAlt}
                className="text-gray-700 dark:text-gray-200 font-bold ml-2 cursor-pointer text-xs icon-size-30 switch-icon w-4 h-4 hover:scale-110 transition"
              />

              <FontAwesomeIcon
                icon={faExchangeAlt}
                className={`text-gray-700 dark:text-gray-200 font-bold ml-2 cursor-pointer hover:scale-110 transition-transform duration-300 ${
                  isHumanToSql ? "transform rotate-90" : ""
                } icon-size-30 switch-icon w-4 h-4`}
                onClick={() => {
                  setIsHumanToSql(!isHumanToSql);
                  setOutputText("");
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              translating && "opacity-50 pointer-events-none"
            }`}
            disabled={translating}
          >
            {translating ? (
              <>
                Translating
                <LoadingDots color="white" />
              </>
            ) : (
              `Translate to ${isHumanToSql ? "SQL" : "Natural Language"}`
            )}
          </button>
        </form>

        {outputText && (
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <label htmlFor="outputText" className="block font-bold mb-2">
              {isHumanToSql ? "SQL Query" : "Human Language Query"}
            </label>
            {isHumanToSql && (
              <Toggle isUppercase={isOutputTextUpperCase} handleSwitchText={setIsOutputTextUpperCase} />
            )}

            {isHumanToSql ? (
              <SyntaxHighlighter
                language="sql"
                style={isThemeDark ? dracula : vs}
                wrapLines={true}
                showLineNumbers={true}
                lineNumberStyle={{ color: isThemeDark ? "gray" : "#ccc" }}
                customStyle={{
                  maxHeight: "none",
                  height: "auto",
                  overflow: "visible",
                  wordWrap: "break-word",
                  color: "inherit",
                  backgroundColor: isThemeDark ? "#374151" : "#fff",
                  borderColor: "#6b7280",
                  borderRadius: 4,
                  borderWidth: 1,
                }}
                lineProps={{ style: { whiteSpace: "pre-wrap" } }}
              >
                {isOutputTextUpperCase
                  ? outputText.toUpperCase()
                  : outputText.toLowerCase()}
              </SyntaxHighlighter>
            ) : (
              <textarea
                readOnly
                className="h-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
                value={
                  isOutputTextUpperCase
                    ? outputText.toUpperCase()
                    : outputText.toLowerCase()
                }
              />
            )}
            <FontAwesomeIcon
              onClick={handleCopy}
              icon={faCopy}
              className="text-gray-700 dark:text-gray-200 font-bold ml-2 cursor-pointer text-xs icon-size-30 w-4 h-4 mr-2 mt-3 hover:scale-110 transition"
            />
            {isCopied && (
              <p className="text-blue-500 text-sm">Copied to clipboard!</p>
            )}
            <textarea
              className="hidden"
              id="outputText"
              value={
                isOutputTextUpperCase
                  ? outputText.toUpperCase()
                  : outputText.toLowerCase()
              }
              readOnly
            />
          </div>
        )}

        {history.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded px-8 pt-6 pb-1 mb-4">
            <>
              <div className="flex justify-between mb-4 items-center">
                <label htmlFor="outputText" className="block font-bold mb-2">
                  History
                </label>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-15 h-10"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? "Hide" : "Show"}
                </button>
              </div>

              {showHistory && (
                <>
                  {history.length > 0 &&
                    history.map((entry: IHistory, index: number) => (
                      <div key={index} className="flex justify-between mb-4">
                        <SyntaxHighlighter
                          language="sql"
                          style={isThemeDark ? dracula : vs}
                          wrapLines={true}
                          showLineNumbers={true}
                          lineNumberStyle={{
                            color: isThemeDark ? "gray" : "#ccc",
                          }}
                          customStyle={{
                            maxHeight: "none",
                            height: "auto",
                            overflow: "visible",
                            wordWrap: "break-word",
                            color: "inherit",
                            backgroundColor: isThemeDark ? "#374151" : "#fff",
                            borderColor: "#6b7280",
                            borderRadius: 4,
                            borderWidth: 1,
                          }}
                          lineProps={{ style: { whiteSpace: "pre-wrap" } }}
                          startingLineNumber={index + 1}
                        >
                          {JSON.parse(entry?.inputText)}
                        </SyntaxHighlighter>
                        <FontAwesomeIcon
                          onClick={() => handleEdit(entry)}
                          icon={faPencil}
                          className="text-gray-700 hover:text-blue-700 dark:text-gray-200 ml-2 text-xs icon-size-1 w-4 h-4 mt-2"
                        />
                      </div>
                    ))}
                </>
              )}
            </>
          </div>
        )}
      </main>
      <Analytics />
      <Footer />
    </div>
  );
}
