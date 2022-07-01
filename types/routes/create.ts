import { ITeam } from "../iTeam";

export interface ICreateResponse{
    serverID:string;
    userID:string;
    teamColor:ITeam;
}
export interface ICreateRequest{
    isStartingWithBlacks:boolean;
}