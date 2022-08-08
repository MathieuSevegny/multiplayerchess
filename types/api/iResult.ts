/**
 * Résultat de l'appel d'API.
 */
export interface IAPIResult<T>{
    data?:T;
    error?:string;
}