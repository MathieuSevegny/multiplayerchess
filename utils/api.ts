import { IMethod } from "../types/api/iMethods";
import { IAPIResult } from "../types/api/iResult";

/**
 * Base de l'URL de l'API.
 */
 export const API_BASE_URL = `${process.env.NEXT_PUBLIC_URL}api/`;

 /**
  * Crée les options pour les requêtes d'API.
  * @param method Méthode HTTP.
  * @param data Données à envoyer.(Si nécessaire)
  * @returns « Init » requis pour faire la requête.
  * @source https://blog.mathieusevegny.com/
  * @example
  * await fetch(url+ "/login",createRequestOptions("POST",body))
          .then(async (response) => {
                 user = JSON.parse(await response.text());
               })
  */
 export function createRequestOptions(method:IMethod,data?:any){
     //Crée les « headers » pour la requête.
     let header = new Headers();
     //Spécifie le type de contenu de la requête.
     header.append("Content-Type","application/json")
 
     let init : any = {method:method};
 
     //Ajoute les « headers » dans le « init ».
     init.headers = header;
 
     if (data !== null){
         //Ajoute les données dans le « init ».
         init.body = JSON.stringify(data);
     }
 
     return init;
 }
 
 /**
  * Fait un appel d'API.
  * @param endURL Fin de l'URL.
  * @param method Méthode HTTP.
  * @param body Données à envoyer. (Si nécessaire)
  * @returns Réponse de l'appel d'API.
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
         })
     }
     catch(e){
         error = "The connection to the server failed.";
     }
 
     return {data,error}
 }
  