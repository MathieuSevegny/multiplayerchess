import IPiece from "./iPiece";
import ISquare from "./iSquare";
import { ITeam } from "./iTeam";

export default interface IBoard{
    squares:ISquare[][];
    out:IPiece[];
    turn:ITeam
}