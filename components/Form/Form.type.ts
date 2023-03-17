import { ChangeEventHandler, KeyboardEvent } from "react";

export interface FormType {
  isThemeDark: boolean;
  isHumanToSql: boolean;
  tableSchema: string;
  translating: boolean;
  setOutputText: (arg: string) => void;
  setTableSchema: (arg: string) => void;
  setIsHumanToSql: (arg: boolean) => void;
  inputText: string;
  setInputText: (arg: string) => void;
  addHistoryEntry: (arg: {
    inputText: string;
    tableSchema: string;
    isHumanToSql: boolean;
  }) => void;
  translate: (arg: {
    inputText: string;
    tableSchema: string;
    isHumanToSql: boolean;
  }) => void;
}

export interface TextEntryType {
  isHumanToSql: boolean;
  inputText: string;
  handleInputChange: ChangeEventHandler;
  handleSubmit: (e: KeyboardEvent) => void;
}

export interface ChecboxType {
  showTableSchema: boolean;
  setShowTableSchema: (arg: boolean) => void;
  setTableSchema: (arg: string) => void;
}
