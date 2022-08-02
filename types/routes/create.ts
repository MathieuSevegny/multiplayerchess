import { ITeam } from "../iTeam";

export interface ICreateResponse{
    serverID:string;
    userID:string;
}
export interface ICreateRequest{
    isStartingWithBlacks:boolean;
}