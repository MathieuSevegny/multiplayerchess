import ICoords from "./iCoords";
import { IDnDItem } from "./iDnDItem";
import IKingPos from "./iKingPos";
import IPiece from "./iPiece";
import ISquare from "./iSquare";

export default interface IBoard{
    squares:ISquare[][];
    out:IPiece[];
    lastMovedItem:IDnDItem | null;
    kingsPos:{[key: string]: IKingPos}
}