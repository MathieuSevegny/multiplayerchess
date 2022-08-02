/**
 * Result of API call.
 */
export interface IAPIResult<T>{
    data?:T;
    error?:string;
}