import { ITeam } from "../iTeam";

export interface IJoinResponse{
    team:ITeam | null
}
export interface IJoinRequest{
    serverID:string;
}