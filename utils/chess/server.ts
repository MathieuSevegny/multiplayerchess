import IServer from "../../types/iServer";
import { ITeam } from "../../types/iTeam";
import { createRandomKey } from "../utils";
import { StartPosition } from "./startPositions";

export let servers : IServer[] = []

/**
 * Creates a server.
 * @param isStartingWithBlacks Is the user creating the server in black team?
 * @returns serverID
 */
export function createServer() : string{
    const serverID = createRandomKey().split("-")[0];
    const newServer : IServer = {uuid:serverID,teamBlack:null,teamWhite:null,board:StartPosition,turn:"Whites"}
    
    servers.push(newServer);
    return serverID
}

export function findServer(serverID:string) : IServer | null {
    for (const server of servers) {
        if (server.uuid === serverID){
            return server;
        }
    }
    return null;
}

export function removeServer(server:IServer){
    servers.splice(servers.findIndex((s)=> s.uuid ===server.uuid),1);
}