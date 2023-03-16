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
import Toggle from "../components/Toggle";
import Header from "../components/Header";

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
    if (history.some(({ inputText }) => inputText === entry.inputText)) return;
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
      <Header />
      <Head>
        <title className="flex justify-between items-center w-full mt-5 pb-7 sm:px-4 px-2">
          {isHumanToSql ? "Human to SQL Translator" : "SQL to Human Translator"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeButton className="absolute top-2.5 right-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition" />
      <div className="flex flex-wrap gap-1 items-start justify-center">
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-auto ml-20"
        >
          <div className="flex flex-col mb-4">
            <label htmlFor="inputText" className="block font-bold mb-2">
              {isHumanToSql ? "Human Language" : "SQL"}
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
              <label htmlFor="showTableSchema">Add Schema</label>
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

          <button
            type="submit"
            className={`cursor-pointer border-none py-2 px-4 bg-transparent rounded-7xl bg-gradient-to-r from-blue-700 to-blue-500 shadow-2xl flex flex-row items-center justify-start ${
              translating && "opacity-50 pointer-events-none"
            }`}
            disabled={translating}
          >
            <img src="/stars.svg"></img>
            <div className="relative text-sm font-semibold font-inter text-white text-center inline-block mx-auto">
              {translating ? (
                <>
                  Translating
                  <LoadingDots color="white" />
                </>
              ) : (
                `Generate ${isHumanToSql ? "SQL" : "Natural Language"}`
              )}
            </div>
          </button>
        </form>

        <div className="flex justify-between">
          <div className="flex items-center">
            <img src="/switch.svg"></img>
            <button
              className={`text-gray-700 dark:text-gray-200 font-bold ml-2 cursor-pointer hover:scale-110 transition-transform duration-300 ${
                isHumanToSql ? "transform rotate-90" : ""
              }`}
              onClick={() => {
                setIsHumanToSql(!isHumanToSql);
                setOutputText("");
              }}
            ></button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-auto ml-20">
          <label htmlFor="outputText" className="block font-bold mb-2">
            {isHumanToSql ? "SQL" : "Human Language"}
          </label>
          {isHumanToSql && (
            <Toggle
              isUppercase={isOutputTextUpperCase}
              handleSwitchText={setIsOutputTextUpperCase}
            />
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
      </div>
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
      <Analytics />
      <Footer />
    </div>
  );
}
