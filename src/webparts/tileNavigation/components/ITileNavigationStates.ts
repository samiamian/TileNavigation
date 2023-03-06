import { IPromotedListData } from "../../model/dataTypes";

export interface ITileNavigationStates {
  listData: IPromotedListData[];
  tileColor: string;
  listNotFound: boolean;
}
