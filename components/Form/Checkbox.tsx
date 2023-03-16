import { ChecboxType } from "./Form.type";

export const Checkbox = ({
  showTableSchema,
  setShowTableSchema,
  setTableSchema,
}: ChecboxType) => {
  return (
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
  );
};
