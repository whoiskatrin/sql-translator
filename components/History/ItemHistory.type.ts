import { IHistory } from "../../pages";

export interface ItemHistory {
  entry: IHistory;
  index: number;
  handleEdit: (arg: IHistory) => void;
  isThemeDark: boolean;
}
