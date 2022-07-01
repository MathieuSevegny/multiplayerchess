import IBoard from "../../types/iBoard";
import { IPieceType } from "../../types/iPieceType";
import { ConvertPieceTypeArrayToBoard } from "./converters";

export const StartPositionTypes : IPieceType[][] = (
    [
        ["rook","knight","bishop","queen","king","bishop","knight","rook"],
        ["pawn","pawn","pawn","pawn","pawn","pawn","pawn","pawn"],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ["pawn","pawn","pawn","pawn","pawn","pawn","pawn","pawn"],
        ["rook","knight","bishop","queen","king","bishop","knight","rook"],
    ]
)
export const StartPosition : IBoard  = ConvertPieceTypeArrayToBoard(StartPositionTypes);