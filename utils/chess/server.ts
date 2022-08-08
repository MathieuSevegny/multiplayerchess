import IServer from "../../types/iServer";
import { createRandomKey } from "../utils";
import { StartPosition } from "./startPositions";

export let servers : IServer[] = []

/**
 * Crée un serveur.
 * @param isStartingWithBlacks Est-ce que l'usager veut commencer avec les noirs?
 * @returns Identififiant du serveur.
 */
export function createServer() : string{
    const serverID = createRandomKey().split("-")[0];
    const newServer : IServer = {uuid:serverID,teamBlack:null,teamWhite:null,board:StartPosition,turn:"Whites"}
    
    servers.push(newServer);
    return serverID
}
/**
 * Cherche un serveur.
 * @param serverID 
 * @returns Le serveur si trouvé, null dans le cas contraire.
 */
export function findServer(serverID:string) : IServer | null {
    for (const server of servers) {
        if (server.uuid === serverID){
            return server;
        }
    }
    return null;
}
/**
 * Enlève un serveur de la liste des serveurs.
 * @param server 
 */
export function removeServer(server:IServer){
    servers.splice(servers.findIndex((s)=> s.uuid ===server.uuid),1);
}