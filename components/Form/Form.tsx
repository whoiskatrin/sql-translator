import { useState } from "react";
import toast from "react-hot-toast";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula, vs } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { faTrashAlt, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LoadingDots from "../LoadingDots";
import { FormType } from "./Form.type";

export const Form = ({
  isThemeDark,
  isHumanToSql,
  tableSchema,
  translating,
  setOutputText,
  setTableSchema,
  setIsHumanToSql,
  inputText,
  setInputText,
  //   addHistoryEntry,
  translate,
}: FormType) => {
  const [showTableSchema, setShowTableSchema] = useState(false);

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

      //   addHistoryEntry({
      //     inputText: JSON.stringify(inputText),
      //     tableSchema,
      //     isHumanToSql,
      //   });

      translate({ inputText, tableSchema, isHumanToSql });
    } catch (error) {
      console.log(error);
      toast.error(`Error translating ${isHumanToSql ? "to SQL" : "to human"}.`);
    }
  };

  const isValidTableSchema = (text: string) => {
    console.log(text);
    const pattern =
      /^CREATE\s+TABLE\s+\w+\s*\(((\s*\w+\s+\w+\(?\d*\)?\s*(,|$)\s*)+)\)\s*;?$/im;
    const regex = new RegExp(pattern);
    console.log(regex.test(text));
    return regex.test(text);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    if (!showTableSchema) {
      setTableSchema("");
    }
  };
  return (
    <>
      <form
        onSubmit={(event) => handleSubmit(event)}
        className="rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md px-6 pt-6 pb-8 mb-4 w-full custom-width sm:w-auto"
      >
        <div className="flex flex-col mb-4">
          <label htmlFor="inputText" className="block font-bold mb-2">
            {isHumanToSql ? "Human Language" : "SQL"}
          </label>
          <textarea
            className="rounded-lg shadow appearance-none border-white w-full py-2 px-3 border text-gray-700 dark:text-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          <div className="mt-4 mb-2">
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

        <div className="flex items-center justify-between mb-4 space-x-10">
          {isHumanToSql && (
            <button
              className={`rounded-full flex items-center justify-center space-x-4 border bg-gradient-to-r from-gray-50 to-gray-100 text-black px-5 py-2 text-sm hover:bg-blue-500 bg-blue-600 font-medium transition ${
                showTableSchema ? "bg-blue-500" : "bg-gray-200"
              } px-4 py-2 rounded-full`}
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
            className={`cursor-pointer border-none py-2 px-4 bg-transparent rounded-full border bg-gradient-to-r from-blue-700 to-blue-500 shadow-2xl flex flex-row items-center justify-start ${
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
        </div>

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
      </form>
    </>
  );
};
