import { TextEntryType } from "./Form.type";

export const TextEntry = ({
  isHumanToSql,
  inputText,
  handleInputChange,
  handleSubmit,
}: TextEntryType) => {
  return (
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
  );
};
