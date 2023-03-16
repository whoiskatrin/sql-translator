import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula, vs } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ItemHistory } from "./ItemHistory.type";

const ItemHistory = ({
  entry,
  index,
  handleEdit,
  isThemeDark,
}: ItemHistory) => {
  return (
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
          color: "#fff",
          backgroundColor: isThemeDark ? "#374151" : "#fff",
          borderColor: "#6b7280",
          borderRadius: 4,
          borderWidth: 1,
        }}
        lineProps={{ style: { whiteSpace: "pre-wrap" } }}
        startingLineNumber={index + 1}
      >
        {JSON.parse(entry?.inputText).replace('\n',' ')}
      </SyntaxHighlighter>
      <FontAwesomeIcon
        onClick={() => handleEdit(entry)}
        icon={faPencil}
        className="text-gray-700 hover:text-blue-700 dark:text-gray-200 ml-2 text-xs icon-size-1 w-4 h-4 mt-2"
      />
    </div>
  );
};

export default ItemHistory;
