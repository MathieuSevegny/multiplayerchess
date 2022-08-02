import IServer from "../../types/iServer";
import { ITeam } from "../../types/iTeam";
import { createRandomKey } from "../utils";
import { StartPosition } from "./startPositions";

export const servers : IServer[] = []

/**
 * Creates a server.
 * @param isStartingWithBlacks Is the user creating the server in black team?
 * @returns [serverID,userID]
 */
export function createServer(isStartingWithBlacks:boolean) : [string,string]{
    const serverID = createRandomKey();
    const userID = createRandomKey();
    const newServer : IServer = {uuid:serverID,teamBlack:null,teamWhite:null,board:StartPosition}
    if (isStartingWithBlacks) newServer.teamBlack = {id:userID};
    else newServer.teamWhite = {id:userID};
    
    servers.push(newServer);
    return [serverID,userID]
}

/**
 * Joins a server.
 * @param serverID ID of the server.
 * @returns [serverID,userID]
 */
 export function joinServer(serverID:string) : [string,string] | null{
    const server = findServer(serverID);
    if (server === null) return null;

    const userID = createRandomKey();

    const isAPlaceAvailable = server.teamBlack === null || server.teamWhite === null
    if (!isAPlaceAvailable) return null;

    if (server.teamBlack === null){
        
    }
    else{

    }
    return [serverID,userID]
}

export function findServer(serverID:string) : IServer | null {
    console.log(servers)
    for (const server of servers) {
        if (server.uuid === serverID){
            return server;
        }
    }
    return null;
}

export function getTeam(server:IServer,userID:string) : ITeam | null{
    if (server.teamBlack && server.teamBlack.id === userID) return "Blacks";
    if(server.teamWhite && server.teamWhite.id === userID) return "Whites";
    return null;
}