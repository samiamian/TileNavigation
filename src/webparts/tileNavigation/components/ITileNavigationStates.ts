import { IPromotedListData } from "../../model/dataTypes";

export interface ITileNavigationStates {
  listData: IPromotedListData[];
  tileColor: string;
  listName: string;
  listNotFound: boolean;
  listDataNotFound: boolean;
}
