import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula, vs } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Toggle from "../Toggle";
import { OutputTextType } from "./OutputText.type";

export const OutputText = ({
  isThemeDark,
  isHumanToSql,
  isOutputTextUpperCase,
  setIsOutputTextUpperCase,
  outputText,
  isCopied,
  handleCopy,
}: OutputTextType) => {
  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <label htmlFor="outputText" className="block font-bold mb-2">
        {isHumanToSql ? "SQL Query" : "Human Language Query"}
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
  );
};
