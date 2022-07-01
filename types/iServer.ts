import IBoard from "./iBoard";

export default interface IServer {
    uuid:string;
    teamBlackID: string | null;
    teamWhiteID: string | null;
    board:IBoard;
}