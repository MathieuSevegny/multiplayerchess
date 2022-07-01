import IServer from "../../types/iServer";
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
    const newServer : IServer = {uuid:serverID,teamBlackID:null,teamWhiteID:null,board:StartPosition}
    if (isStartingWithBlacks) newServer.teamBlackID = userID;
    else newServer.teamWhiteID = userID;

    servers.push(newServer);
    return [serverID,userID]
}

/**
 * Creates a server.
 * @param isStartingWithBlacks Is the user creating the server in black team?
 * @returns [serverID,userID]
 */
 export function joinServer(serverID:string) : [string,string] | null{
    const server = findServer(serverID);
    if (server === null) return null;

    const userID = createRandomKey();

    const isAPlaceAvailable = server.teamBlackID === null || server.teamWhiteID === null
    if (!isAPlaceAvailable) return null;

    if (server.teamBlackID === null){
        
    }
    else{

    }
    return [serverID,userID]
}

export function findServer(serverID:string) : IServer | null {
    for (const server of servers) {
        if (server.uuid === serverID){
            return server;
        }
    }
    return null;
}