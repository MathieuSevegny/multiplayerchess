import IBoard from "./iBoard";
import { ITeam } from "./iTeam";

export default interface IServer {
    uuid:string;
    teamBlack: string | null;
    teamWhite: string | null;
    board:IBoard;
    turn:ITeam;
}