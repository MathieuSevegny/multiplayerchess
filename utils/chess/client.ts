import { NextRouter } from "next/router";
import { TEXTS } from "../../text/text";
import { IAPIResult } from "../../types/api/iResult";
import IGamePageQueries from "../../types/iGamePageQueries";
import { ITeam } from "../../types/iTeam";
import { ICreateRequest, ICreateResponse } from "../../types/routes/create";
import { APIRequest } from "../api";

export default class Client {
    public static async CreateServer(team:ITeam,router:NextRouter){
        const body : ICreateRequest = {isStartingWithBlacks:team === "Blacks"};
        const response : IAPIResult<ICreateResponse> = await APIRequest("create","POST",body);

        if (response.error || !response.data){
            console.error(TEXTS.Errors.Creation)
            return;
        }

        const serverInfos = response.data;
        const queries : IGamePageQueries = {t:(team === "Whites" ? "w" : "b")}
        router.push({pathname:"/game",query:queries as any})
    }
}
