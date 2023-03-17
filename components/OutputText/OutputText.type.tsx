import { MouseEventHandler } from "react";

export interface OutputTextType {
  isHumanToSql: boolean;
  isOutputTextUpperCase: boolean;
  setIsOutputTextUpperCase: (textUpper: boolean) => void;
  outputText: string;
  isCopied: boolean;
  handleCopy: MouseEventHandler;
  isThemeDark: boolean;
}
