import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";
import { IPromotedListLists,IPromotedListData } from "../model/dataTypes";

export class tileService {

   /** @param {Promise} promise
    * @returns {Promise} [ data, undefined ]
    * @returns {Promise} [ undefined, Error ]
    */
    private handle = <T>(promise: Promise<T>, defaultError: any = 'rejected'): Promise<T[] | [T, any]> => {
        return promise
          .then((data) => [data, undefined])
          .catch(error => ([undefined, error || defaultError]));
      }

    /**
     * 
     * @param context 
     * @returns 
     */
    public async getSiteLists(context: WebPartContext): Promise <IPromotedListLists[]> {
        let siteLists = new Array<IPromotedListLists>();
        const absoluteURL: string = context.pageContext.web.absoluteUrl;
        const LIST_OF_SITES = "/_api/web/lists?$filter=BaseTemplate%20eq%20100&$select=Title&$orderby=Title&$top=10";
        const endPointUrl: string = absoluteURL.concat(LIST_OF_SITES);       
        
        let [data,dataerr] = await this.handle(context.spHttpClient.get(endPointUrl, SPHttpClient.configurations.v1));
        if(dataerr) throw new Error('Could not fetch List details');

        let [jsonData, jsonDataErr] = await this.handle(data.json());
        if(jsonDataErr) throw new Error('Could not get List Details JSON Data');

        if (jsonData !== undefined){
            jsonData.value.map(respItem => {  
                if(respItem["Title"] !== undefined){
                 if (respItem["Title"].toLowerCase().includes("promoted")){
                    siteLists.push({key:respItem["Title"],  text:respItem["Title"]});
                 }
                 else{
                    siteLists = null;
                 }
                }
            });
        }
        console.log(siteLists);
        return siteLists;
    }

    /**
     * 
     * @param context 
     * @param listName 
     * @returns 
     */
    public async getListDate(context: WebPartContext,listName: string): Promise<IPromotedListData[]> {
        let listData = new Array<IPromotedListData>();
        const absoluteURL: string = context.pageContext.web.absoluteUrl;
        let listByTile = decodeURIComponent(listName);
        const LIST_OF_SITES = `/_api/web/Lists/GetByTitle('${listByTile}')/items?$select=Title,URL,Order`;
        const endPointUrl: string = absoluteURL.concat(LIST_OF_SITES);       
        
        let [data,dataerr] = await this.handle(context.spHttpClient.get(endPointUrl, SPHttpClient.configurations.v1));
        if(dataerr) throw new Error('Could not fetch List details');
        let [jsonData, jsonDataErr] = await this.handle(data.json());
        if (jsonData !== undefined){
            jsonData.value.map(respItem => {  
                if(respItem["Title"] !== undefined){
                 listData.push(
                    {
                        title:respItem["Title"],
                        url:respItem["URL"],
                        order:respItem["Order"],
                    }
                    );
                }
            });
        };
        return listData;

    }

    /**
     * 
     * @param hex 
     * @returns 
     */
    private hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

    /**
     * 
     * @param r 
     * @param g 
     * @param b 
     * @returns 
     */
    private rgbToHex(r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    /**
     * 
     * @param HEX 
     * @returns 
     */
    public Lighten(HEX)
    {       
        var R =  this.hexToRgb(HEX).r;
        var G =  this.hexToRgb(HEX).g;
        var B =  this.hexToRgb(HEX).b;

        R += 20; G += 20; B += 20;

        return this.rgbToHex(R,G,B);
    }
}

const tService = new tileService();
export default tService;