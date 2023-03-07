import { WebPartContext } from "@microsoft/sp-webpart-base";  

export interface ITileNavigationProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  color: string;
  setWidth: string;
  listName: string;
  tileAnimation: boolean;
  context: WebPartContext; 
}
