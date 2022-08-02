import IBoard from "./iBoard";
import IPlayer from "./iPlayer";

export default interface IServer {
    uuid:string;
    teamBlack:IPlayer | null;
    teamWhite:IPlayer | null;
    board:IBoard;
}