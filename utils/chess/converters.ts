import IBoard from "../../types/iBoard";
import { IPieceType } from "../../types/iPieceType";
import ISquare from "../../types/iSquare";
import { ITeam } from "../../types/iTeam";
import { GRID_SIZE } from "./constants";

export function ConvertPieceTypeArrayToBoard(piecesTypes:IPieceType[][]) : IBoard {
    const squares : ISquare[][] = [];

    for (let i = 0; i < GRID_SIZE; i++) {
        const row : ISquare[] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            const team = GetTeamByStartRowIndex(i);
            if (piecesTypes[i][j] === null){
                row.push({piece:null});
                continue;
            }
            row.push({piece:{type:piecesTypes[i][j],team}})
        }
        squares.push(row);
    }
    return {squares,out:[]}
}

function GetTeamByStartRowIndex(rowID:number) : ITeam{
    if (rowID <= 1) return "Blacks";
    if (rowID >= GRID_SIZE-2) return "Whites";
    return null;
}