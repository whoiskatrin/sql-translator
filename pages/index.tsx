import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { useTheme } from "next-themes";

import { useTranslate } from "../hooks/useTranslate";

import { Header } from "../components/Header";
import {Form} from "../components/Form";
import { OutputText } from "../components/OutputText";
import {HistorysList} from "../components/History";
import Footer from "../components/Footer";

export interface IHistory {
  inputText: string;
  tableSchema?: string;
  isHumanToSql?: boolean;
}

export default function Home() {
  const { theme, systemTheme } = useTheme();
  const isSystemTheme = theme === "system" ? systemTheme : theme
  const isThemeDark = isSystemTheme === "dark";
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
  const [history, setHistory] = useState<IHistory[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (translationError) toast.error(translationError);
  }, [translationError]);

  if (!mounted) {
    return null;
  }

  const addHistoryEntry = (entry: IHistory) => {
    if (history.some(({ inputText }) => inputText === entry.inputText)) return;
    setHistory([...history, entry]);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>
          {isHumanToSql ? "Human to SQL Translator" : "SQL to Human Translator"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-lg mx-auto my-12 px-4">
        <Header />
        <h1 className="text-3xl font-bold text-center mt-4 mb-8">
          {isHumanToSql ? "Human to SQL Translator" : "SQL to Human Translator"}
        </h1>
        <Form
          isThemeDark={isThemeDark}
          translate={translate}
          isHumanToSql={isHumanToSql}
          tableSchema={tableSchema}
          translating={translating}
          setOutputText={setOutputText}
          setTableSchema={setTableSchema}
          addHistoryEntry={addHistoryEntry}
          inputText={inputText}
          setInputText={setInputText}
          setIsHumanToSql={setIsHumanToSql}
        />
        {outputText && (
          <OutputText
            isThemeDark={isThemeDark}
            isHumanToSql={isHumanToSql}
            isOutputTextUpperCase={isOutputTextUpperCase}
            setIsOutputTextUpperCase={setIsOutputTextUpperCase}
            outputText={outputText}
            isCopied={isCopied}
            handleCopy={handleCopy}
          />
        )}
        {history.length > 0 && (
          <HistorysList isThemeDark history={history} handleEdit={handleEdit} />
        )}
      </main>
      <Analytics />
      <Footer />
    </div>
  );
}
