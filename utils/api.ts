import { IMethod } from "../types/api/iMethods";
import { IAPIResult } from "../types/api/iResult";

/**
 * Base URL for the API
 */
 export const API_BASE_URL = `${process.env.NEXT_PUBLIC_URL}api/`;

 /**
  * Create options for the fetch request.
  * @param method HTTP method.
  * @param data Data to send.(If needed)
  * @returns « Init » needed to make the fetch request.
  * @example
  * await fetch(url+ "/login",createRequestOptions("POST",body))
          .then(async (response) => {
                 user = JSON.parse(await response.text());
               })
  */
 export function createRequestOptions(method:IMethod,data?:any){
     //Create headers for the request.
     let header = new Headers();
     //Specify the content type in the header.
     header.append("Content-Type","application/json")
 
     let init : any = {method:method};
 
     //Add the header to the init.
     init.headers = header;
 
     if (data !== null){
         //Add the data to the init.
         init.body = JSON.stringify(data);
     }
 
     return init;
 }
 
 /**
  * Do an API request.
  * @param endURL End of URL.
  * @param method HTTP method.
  * @param isAuth Is user connected?
  * @param body Data to send.(If needed)
  * @returns Response of the API call.
  */
  export async function APIRequest<T>(endURL:string,method:IMethod,body?:any):Promise<IAPIResult<T>>{
     let data;
     let error;
     try{
         await fetch(API_BASE_URL+endURL,createRequestOptions(method,body))
         .then(response => {
             return response.text();
         })
         .then(text => {
             data = JSON.parse(text);
             //In my API if there is an error, the reveived data as no content.
             if (!data.content){
                 error = data.message;
             }
             else{
                 data = data.content;
             }
         })
     }
     catch(e){
         error = "The connection to the server failed.";
     }
 
     return {data,error}
 }
  