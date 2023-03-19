import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter"));
import { vs, dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import ThemeButton from "../components/ThemeButton";
import { useTranslate } from "../hooks/useTranslate";
import { toast } from "react-hot-toast";
import LoadingDots from "../components/LoadingDots";
import { useTheme } from "next-themes";
import Toggle from "../components/Toggle";
import { Header } from "../components/Header/Header";

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

  const buttonStyles = {
    light: "light-button-w-gradient-border text-black",
    dark: "dark-button-w-gradient-border text-[#D8D8D8]",
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

      <div className="flex flex-col md:flex-row w-full gap-6 bg-[#EEEEEE] dark:bg-black dark:border-gray-800 rounded-2xl p-2">
        <div className="w-full">
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="rounded-xl bg-white border dark:border-gray-800 dark:bg-custom-gray p-3 h-full w-full"
          >
            <div className="flex flex-col h-full">
              <label
                htmlFor="inputText"
                className="block font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                {isHumanToSql ? "Human Language" : "SQL"}
              </label>
              <textarea
                className="appearance-none border-0 rounded-lg w-full py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  if (
                    event.key === "Enter" &&
                    (event.metaKey || event.ctrlKey)
                  ) {
                    handleSubmit(event);
                  }
                }}
                required
              />
              {tableSchema && showTableSchema && (
                <div className="mt-4">
                  <h2 className="mb-2 font-medium text-sm text-gray-500">
                    Table Schema
                  </h2>
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
                      backgroundColor: isThemeDark ? "#1D1D1D" : "#F8F8F8",
                      borderRadius: "0.5rem",
                    }}
                    lineProps={{ style: { whiteSpace: "pre-wrap" } }}
                  >
                    {tableSchema}
                  </SyntaxHighlighter>
                </div>
              )}

              <div className="flex items-center justify-between my-3 last:mb-0 space-x-10">
                {isHumanToSql && (
                  <button
                    className={`rounded-full flex items-center justify-center space-x-4 border text-sm font-medium px-4 py-2 [text-shadow:0_0_1px_rgba(0,0,0,0.25)] ${
                      theme === "light" ? buttonStyles.light : buttonStyles.dark
                    }`}
                    onClick={() => {
                      setShowTableSchema(!showTableSchema);
                      if (!showTableSchema) {
                        setTableSchema("");
                      }
                    }}
                  >
                    {showTableSchema ? "Remove Schema" : "Add Schema"}
                  </button>
                )}

                <button
                  type="submit"
                  className={`cursor-pointer py-2 px-4 rounded-full blue-button-w-gradient-border [text-shadow:0_0_1px_rgba(0,0,0,0.25)] shadow-2xl flex flex-row items-center justify-start ${
                    translating && "opacity-50 pointer-events-none"
                  }`}
                  disabled={translating}
                >
                  <img src="/stars.svg"></img>&nbsp;
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
              </div>

              {isHumanToSql && showTableSchema && (
                <div className="flex flex-col mt-2">
                  <label
                    htmlFor="tableSchema"
                    className="block mb-2 text-sm font-medium text-gray-500"
                  >
                    Table Schema Input
                    <span className="ml-2 text-blue-600 bg-blue-50 dark:bg-blue-900/50 text-xs px-[4px] py-1 rounded-md">
                      Optional
                    </span>
                  </label>
                  <textarea
                    className="appearance-none border-0 rounded-lg w-full py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            </div>
          </form>
        </div>
        <div>
          <div className="flex items-center md:h-full">
            <button
              className={`text-gray-700 dark:text-gray-200 cursor-pointer mx-auto`}
              onClick={() => {
                setIsHumanToSql(!isHumanToSql);
                setOutputText("");
              }}
            >
              <img
                src={theme === "light" ? "/switch.svg" : "/switchDark.svg"}
                alt="Switch"
                className="w-12 h-12 md:w-24 md:h-24"
              />
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col rounded-xl bg-white  border dark:border-gray-700 dark:bg-custom-gray p-3 h-full w-full custom-width sm:w-auto">
            <div className="flex flex-col flex-1">
              <label
                htmlFor="outputText"
                className="block mb-2 font-medium  text-gray-700 dark:text-gray-200"
              >
                {isHumanToSql ? "SQL" : "Human Language"}
              </label>
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
                  backgroundColor: isThemeDark ? "#1D1D1D" : "#F8F8F8",
                  flex: 1,
                  borderRadius: "0.5rem",
                }}
                lineProps={{ style: { whiteSpace: "pre-wrap" } }}
              >
                {isOutputTextUpperCase
                  ? outputText.toUpperCase()
                  : outputText.toLowerCase() ||
                    (isHumanToSql
                      ? "SELECT * FROM cars WHERE color = 'red'"
                      : "show me all the cars that are red")}
              </SyntaxHighlighter>
            </div>

            <div className="flex items-center mt-3">
              <button
                className={`flex items-center disabled:pointer-events-none disabled:opacity-70 justify-center space-x-4 rounded-full px-5 py-2 text-sm font-medium transition ${
                  theme === "light" ? buttonStyles.light : buttonStyles.dark
                }`}
                onClick={handleCopy}
                disabled={outputText.length === 0 || isCopied}
              >
                <img
                  src={theme === "light" ? "/copyDark.svg" : "/copy.svg"}
                  alt="Copy"
                />
              </button>
              {isHumanToSql && (
                <div className="flex items-center ml-4">
                  <Toggle
                    isUppercase={isOutputTextUpperCase}
                    handleSwitchText={setIsOutputTextUpperCase}
                  />
                </div>
              )}
            </div>
            {isCopied && (
              <p className="text-black-500 text-xs">Copied to clipboard</p>
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
      </div>

      {/* {history.length > 0 && ( // TODO: redo this with a new design
        <div className="rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md px-6 pt-6 pb-8 mb-4 w-full custom-width w-full sm:w-auto">
          <>
            <div className="flex justify-between mb-4 items-center">
              <label
                htmlFor="outputText"
                className="block font-mono font-bold mb-2"
              >
                History
              </label>
              <button
                type="button"
                className="cursor-pointer border-none py-2 px-4 font-mono bg-transparent rounded-full border text-white bg-gradient-to-r from-blue-700 to-blue-500 shadow-2xl flex flex-row items-center justify-start"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? "Hide" : "Show"}
              </button>
            </div> */}

      {/* {showHistory && ( 
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
            )} */}
      {/* </>
        </div>
      )} */}
      <Analytics />
    </div>
  );
}
