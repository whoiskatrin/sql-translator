import { useState } from "react";

import { IHistory } from "../../pages/index";
import ItemHistory from "./ItemHistory";

export const HistorysList = ({history, handleEdit,isThemeDark}:any) => {

  const [showHistory, setShowHistory] = useState(false);
  
  return (
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
                <ItemHistory isThemeDark={isThemeDark} handleEdit={handleEdit} entry={entry} key={index} index={index}/>
              ))}
          </>
        )}
      </>
    </div>
  );
};