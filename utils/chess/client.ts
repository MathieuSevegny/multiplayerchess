import { NextRouter } from "next/router";
import { TEXTS } from "../../text/text";
import { IAPIResult } from "../../types/api/iResult";
import IGamePageQueries from "../../types/iGamePageQueries";
import { ITeam } from "../../types/iTeam";
import { ICreateResponse } from "../../types/routes/create";
import { IJoinRequest, IJoinResponse } from "../../types/routes/join";
import { APIRequest } from "../api";

/**
 * Requête pour créer un serveur.
 * @param team 
 * @param router 
 * @returns 
 */
export async function createServer(team:ITeam,router:NextRouter){
    const response : IAPIResult<ICreateResponse> = await APIRequest("create","POST");

    if (response.error || !response.data){
        console.error(TEXTS.Errors.Creation)
        return;
    }

    const serverInfos = response.data;
    const queries : IGamePageQueries = {t:(team === "Whites" ? "w" : "b"),serverID:serverInfos.serverID}
    router.push({pathname:"/game",query:queries as any})
}
/**
 * Requête pour rejoindre un serveur.
 * @param id 
 * @param router 
 * @returns 
 */
export async function joinServer(id:string,router:NextRouter){
    const body : IJoinRequest = {serverID:id}
    const response : IAPIResult<IJoinResponse> = await APIRequest("join","POST",body);

    if (response.error || !response.data || !response.data.team){
        console.error(TEXTS.Errors.Join)
        return;
    }

    const infos = response.data;
    const queries : IGamePageQueries = {t:(infos.team === "Whites" ? "w" : "b"),serverID:id}
    router.push({pathname:"/game",query:queries as any})
}
