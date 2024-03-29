import IBoard from "../../types/iBoard";
import { IPieceType } from "../../types/iPieceType";
import ISquare from "../../types/iSquare";
import { ITeam } from "../../types/iTeam";
import { GRID_SIZE } from "./constants";

/**
 * Fonction pour convertir un IPieceType[][] en IBoard.
 * @param piecesTypes 
 * @returns 
 */
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
            row.push({piece:{type:piecesTypes[i][j],team,movementNb:0}})
        }
        squares.push(row);
    }
    return {squares,out:[],lastMovedItem:null,kingsPos:{
        "Whites":{isInCheck:false,coords:{isOut:false,position:{y:7,x:4}}},
        "Blacks":{isInCheck:false,coords:{isOut:false,position:{y:0,x:4}}}
    }}
}
/**
 * Donne l'équipe par position de début.
 * @param rowID 
 * @returns 
 */
function GetTeamByStartRowIndex(rowID:number) : ITeam{
    if (rowID <= 1) return "Blacks";
    if (rowID >= GRID_SIZE-2) return "Whites";
    return null;
}