import { useState } from "react";
import toast from "react-hot-toast";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula, vs } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { faTrashAlt, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LoadingDots from "../LoadingDots";
import { TextEntry } from "./TextEntry";
import { Checkbox } from "./Checkbox";
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
  addHistoryEntry,
  translate,
}: FormType) => {
  const [showTableSchema, setShowTableSchema] = useState(false);

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

  const isValidTableSchema = (text: string) => {
    console.log(text);
    const pattern = /^CREATE\s+TABLE\s+\w+\s*\((\s*.+\s*,?\s*)+\);?$/i;
    const regex = new RegExp(pattern);
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
        className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="flex flex-col mb-4">
          <label htmlFor="inputText" className="block font-bold mb-2">
            {isHumanToSql ? "Human Language Query" : "SQL Query"}
          </label>
          <TextEntry
            isHumanToSql={isHumanToSql}
            inputText={inputText}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
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
          <Checkbox
            showTableSchema={showTableSchema}
            setShowTableSchema={setShowTableSchema}
            setTableSchema={setTableSchema}
          />
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
    </>
  );
};
