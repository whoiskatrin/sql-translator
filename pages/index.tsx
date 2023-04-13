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
  outputText: string;
  tableSchema?: string;
  isHumanToSql?: boolean;
}

interface IHistoryEntry {
  inputText: string;
  outputText: string;
  tableSchema?: string;
  isHumanToSql?: boolean;
}

interface ITextCopied {
  isCopied: boolean;
  isHistory: boolean;
  text: string;
}
interface prev{
  previnput: string;
  prevoutput: string;
}

export default function Home() {
  
  const { resolvedTheme } = useTheme();
  const isThemeDark = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);
  const {
    translate,
    translating,
    outputText,
    setOutputText,
    translationError,
  } = useTranslate();
  const [inputText, setInputText] = useState("");
  const [prevquery, setPrevquery] = useState<prev[]>([]);
  const [isHumanToSql, setIsHumanToSql] = useState(true);
  const [isOutputTextUpperCase, setIsOutputTextUpperCase] = useState(false);
  const [tableSchema, setTableSchema] = useState("");
  const [showTableSchema, setShowTableSchema] = useState(false);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hasTranslated, setHasTranslated] = useState(false);
  const [copied, setCopied] = useState<ITextCopied>();

  useEffect(() => {
    if (inputText && hasTranslated) {
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          inputText: JSON.stringify(inputText),
          outputText: JSON.stringify(outputText),
          tableSchema,
          isHumanToSql,
        },
      ]);

      addHistoryEntry({
        inputText: JSON.stringify(inputText),
        tableSchema,
        isHumanToSql,
        outputText: JSON.stringify(outputText),
      });

      setHasTranslated(false);
    }
  }, [outputText]);

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
    const pattern = /^CREATE\s+TABLE\s+\w+\s*\((\s*.+\s*,?\s*)+\);?$/i;
    const regex = new RegExp(pattern);
      return regex.test(text.trim());
  };

  const addHistoryEntry = (entry: IHistory) => {
    if (
      !history.some(
        ({ inputText, outputText }) =>
          inputText === entry.inputText && outputText === entry.outputText
      ) &&
      !prevquery.some(
        ({ previnput, prevoutput }) =>
          previnput === entry.inputText && prevoutput === entry.outputText
      )
    ) {
      setHistory([...history, entry]);
      
    }
    const newhistory: prev = {previnput : entry.inputText, prevoutput : entry.outputText};
    setPrevquery([...prevquery,newhistory]);
    
  };

  function safeJSONParse(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.error("JSON parse error:", e);
      return null;
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    if (!showTableSchema) {
      setTableSchema("");
    }
  };

  const handleCopy = (text: string, isHistory: boolean) => {
    navigator.clipboard.writeText(text);
    setCopied({
      isCopied: true,
      isHistory: isHistory,
      text: text
    })
     setTimeout(() => {
      setCopied({
        isCopied: false,
        isHistory: isHistory,
        text: text
      }) 
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

      translate({ inputText, tableSchema, isHumanToSql });
      setHasTranslated(true);
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

      <div className="flex flex-col md:flex-row w-full gap-6 bg-[#EEEEEE] dark:text-white dark:bg-black dark:border dark:border-white/20 rounded-2xl p-2">
        <div className="w-full">
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="rounded-xl bg-white dark:bg-custom-gray container-w-gradient-border dark:dark-container-w-gradient-border p-3 h-full w-full"
          >
            <div className="flex flex-col h-full">
              <label
                htmlFor="inputText"
                className="block font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                {isHumanToSql ? "Human Language" : "SQL"}
              </label>
              <textarea
                className={`appearance-none border-0 rounded-lg w-full py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline ${
                  isThemeDark ? "placeholder-dark" : ""
                }`}
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
                  <h2 className="mb-2 font-medium text-sm text-gray-500 dark:text-white">
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
                    type='button'
                    className={`rounded-full flex items-center justify-center space-x-4 border text-sm font-medium px-4 py-2 [text-shadow:0_0_1px_rgba(0,0,0,0.25)] ${
                      resolvedTheme === "light"
                        ? buttonStyles.light
                        : buttonStyles.dark
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
                    className="block mb-2 text-sm font-medium text-gray-500 dark:text-white"
                  >
                    Table Schema Input
                    <span className="ml-2 text-blue-600 bg-blue-50 dark:bg-gray-200 text-xs px-[4px] py-1 rounded-md">
                      Optional
                    </span>
                  </label>
                  <textarea
                    className={`appearance-none border-0 rounded-lg w-full py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline ${
                      isThemeDark ? "placeholder-dark" : ""
                    }`}
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
                src={
                  resolvedTheme === "light" ? "/switch.svg" : "/switchDark.svg"
                }
                alt="Switch"
                className="w-12 h-12 md:w-24 md:h-24"
              />
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col rounded-xl bg-white container-w-gradient-border dark:dark-container-w-gradient-border dark:bg-custom-gray p-3 h-full w-full custom-width sm:w-auto">
            <div className="flex flex-col flex-1">
              <label
                htmlFor="outputText"
                className="block mb-2 font-medium  text-gray-700 dark:text-gray-200"
              >
                {isHumanToSql ? "SQL" : "Human Language"}
              </label>
              <SyntaxHighlighter
                language={isHumanToSql ? "sql" : "text"}
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

            <div className="flex items-center mt-3 justify-between">
              <div className="flex items-center gap-1">
                <button
                  className={`flex items-center disabled:pointer-events-none disabled:opacity-70 justify-center space-x-4 rounded-full px-5 py-2 text-sm font-medium transition ${
                    resolvedTheme === "light"
                      ? buttonStyles.light
                      : buttonStyles.dark
                  }`}
                  onClick={() => handleCopy(outputText, false)}
                  disabled={!copied?.isHistory && copied?.text === outputText || copied?.isCopied }
                >
                  <img
                    src={
                      resolvedTheme === "light" ? "/copyDark.svg" : "/copy.svg"
                    }
                    alt="Copy"
                  />
                </button>

                {!copied?.isHistory && copied?.isCopied && copied.text == outputText && (
                  <p className="text-black-500 text-xs">Copied to clipboard</p>
                )}
              </div>
              {isHumanToSql && (
                <div className="flex items-center ml-4">
                  <Toggle
                    isUppercase={isOutputTextUpperCase}
                    handleSwitchText={setIsOutputTextUpperCase}
                  />
                </div>
              )}
            </div>
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

      {history.length > 0 && (
        <button
          className={`rounded-full flex items-center justify-center space-x-4 border text-sm font-medium mt-2 mb-2 px-4 py-2 [text-shadow:0_0_1px_rgba(0,0,0,0.25)] ${
            resolvedTheme === "light" ? buttonStyles.light : buttonStyles.dark
          }`}
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      )}

      {showHistory && (
        <>
          {history.length > 0 && 
            history.map((entry: IHistoryEntry, index: number) => (
              <div key={index} className="w-full mb-6">
                <div className="flex flex-col md:flex-row w-full gap-6 bg-custom-background bg-gray-100 dark:bg-black dark:border-gray-800 border rounded-3xl from-blue-500 p-3">
                  <div className="w-full">
                    <div className="rounded-xl bg-white border dark:border-gray-800 dark:bg-custom-gray shadow-md p-6 w-full h-full">
                      <label
                        htmlFor="inputText"
                        className="block mb-2 text-gray-300"
                      >
                        {entry.isHumanToSql ? "Human Language" : "SQL"}
                      </label>
                      {entry.isHumanToSql ? (
                        <div
                          className={`${
                            isThemeDark ? "text-white" : "text-black"
                          } whitespace-pre-wrap`}
                        >
                          {safeJSONParse(entry?.inputText)}
                        </div>
                      ) : (
                        <SyntaxHighlighter
                          language="sql"
                          style={isThemeDark ? dracula : vs}
                          wrapLines={true}
                          showLineNumbers={true}
                          lineNumberStyle={{
                            color: isThemeDark ? "gray" : "#ccc",
                          }}
                          customStyle={{
                            minHeight: "70px",
                            maxHeight: "none",
                            height: "auto",
                            overflow: "visible",
                            wordWrap: "break-word",
                            color: "inherit",
                            backgroundColor: isThemeDark
                              ? "#1D1D1D"
                              : "#F8F8F8",
                          }}
                          lineProps={{ style: { whiteSpace: "pre-wrap" } }}
                        >
                          {safeJSONParse(entry?.inputText)}
                        </SyntaxHighlighter>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="rounded-xl bg-white border dark:border-gray-800 dark:bg-custom-gray shadow-md p-6 w-full h-full">
                      <label
                        htmlFor="outputText"
                        className="block mb-2 text-gray-300"
                      >
                        {entry.isHumanToSql ? "SQL" : "Human Language"}
                      </label>
                      {entry.isHumanToSql ? (
                        <SyntaxHighlighter
                          language="sql"
                          style={isThemeDark ? dracula : vs}
                          wrapLines={true}
                          showLineNumbers={true}
                          lineNumberStyle={{
                            color: isThemeDark ? "gray" : "#ccc",
                          }}
                          customStyle={{
                            minHeight: "70px",
                            maxHeight: "none",
                            height: "auto",
                            overflow: "visible",
                            wordWrap: "break-word",
                            color: "inherit",
                            backgroundColor: isThemeDark
                              ? "#1D1D1D"
                              : "#F8F8F8",
                          }}
                          lineProps={{ style: { whiteSpace: "pre-wrap" } }}
                        >
                          {safeJSONParse(entry?.outputText)}
                        </SyntaxHighlighter>
                      ) : (
                        <div
                          className={`${
                            isThemeDark ? "text-white" : "text-black"
                          } whitespace-pre-wrap`}
                        >
                          {safeJSONParse(entry?.outputText)}
                        </div>
                      )}
                      <div className="flex items-center mt-3 gap-1">
                        <button
                          className={`flex items-center disabled:pointer-events-none disabled:opacity-70 justify-center space-x-4 rounded-full px-5 py-2 text-sm font-medium transition ${
                            resolvedTheme === "light"
                            ? buttonStyles.light
                            : buttonStyles.dark
                            }`}
                          onClick={() => handleCopy(safeJSONParse(entry?.outputText), true)}
                          disabled={copied?.isHistory && JSON.stringify(copied?.text) === entry?.outputText || copied?.isCopied } 
                        >
                          <img
                            src={
                            resolvedTheme === "light" ? "/copyDark.svg" : "/copy.svg"
                            }
                            alt="Copy"
                          />
                        </button>
                        {copied?.isHistory && copied?.isCopied && copied.text == safeJSONParse(entry?.outputText) && (
                          <p className="text-black-500 text-xs">Copied to clipboard</p>
                        )}
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            ))}
        </>
      )}

      <Analytics />
    </div>
  );
}
