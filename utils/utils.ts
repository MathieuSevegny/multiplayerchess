import { Context, useContext } from 'react';
import {v4 as uuidv4} from 'uuid';
import { GameContext, GameContextType } from '../pages/game';
import { TEXTS } from '../text/text';
import IBoard from '../types/iBoard';
import ICoords from '../types/iCoords';
import { IMoveType } from '../types/iMoveType';
import IPiece from '../types/iPiece';
import { isACastling, isEnPassant } from './chess/canDrop';
import { GRID_SIZE } from './chess/constants';

export function createRandomKey() : string{
    return uuidv4();
}

export function movePiece(context:GameContextType,piece:IPiece,from:ICoords,to:ICoords){
    let oldBoard = JSON.parse(JSON.stringify(context[0])) as IBoard;
    //Moves a piece from the board to the out zone.
    if (from.isOut != to.isOut){
        //Out->Board
        if (from.isOut){
            oldBoard.out.splice(from.position.x, 1);
            oldBoard.squares[to.position.y][to.position.x].piece = piece;
        }
        //Board->Out
        else{
            oldBoard.squares[from.position.y][from.position.x].piece = null;
            oldBoard.out.push(piece)
        }
        context[1](oldBoard,"Move");
        return;
    }
    if (from.isOut && to.isOut){
        return;
    }
    let type : IMoveType = "Move"
    //Checks if the square is occupied by other team
    if (oldBoard.squares[to.position.y][to.position.x].piece?.team !== piece.team){
        //Move the piece
        oldBoard.squares[from.position.y][from.position.x].piece = null;
        if (oldBoard.squares[to.position.y][to.position.x].piece) {
            oldBoard.out.push(oldBoard.squares[to.position.y][to.position.x].piece!);
            type = 'Capture';
        }
        //If its a king => check for castling
        if (piece.type === "king"){
            if (isACastling(piece,from,to,oldBoard)){
                let rook : IPiece;
                let rookCoords : ICoords;
                let diffWithKing = -1;
                //If the new position greater that half of the grid => goes to the rook in id 7.
                if (to.position.x > GRID_SIZE/2){
                    rook = oldBoard.squares[from.position.y][GRID_SIZE-1].piece!;
                    rookCoords = {isOut:false,position:{y:from.position.y,x:GRID_SIZE-1}};
                }
                else{
                    diffWithKing = 1;
                    rook = oldBoard.squares[from.position.y][0].piece!;
                    rookCoords = {isOut:false,position:{y:from.position.y,x:0}};
                }
                oldBoard.squares[rookCoords.position.y][rookCoords.position.x].piece = null;
                oldBoard.squares[rookCoords.position.y][to.position.x + diffWithKing].piece = rook;
            }
        }
        //If its a pawn => check for en passant
        if (piece.type === "pawn"){
            if (isEnPassant(piece,from,to,oldBoard)){
                let otherPawn : IPiece;
                let otherPawnCoords : ICoords;
                //If the new position greater that half of the grid => goes to the rook in id 7.
                if (to.position.y > GRID_SIZE/2){
                    otherPawn = oldBoard.squares[to.position.y-1][to.position.x].piece!;
                    otherPawnCoords = {isOut:false,position:{y:to.position.y-1,x:to.position.x}};
                }
                else{
                    otherPawn = oldBoard.squares[to.position.y+1][to.position.x].piece!;
                    otherPawnCoords = {isOut:false,position:{y:to.position.y+1,x:to.position.x}};
                }
                oldBoard.squares[otherPawnCoords.position.y][otherPawnCoords.position.x].piece = null;
                oldBoard.out.push(otherPawn);
                type = 'Capture';
            }
        }
        //Detect promotion
        if (piece.type === "pawn"){
            let goal = GRID_SIZE-1;
            if (piece.team === "Whites"){
                goal = 0;
            }
            if (to.position.y === goal){
                let newPiece : IPiece | null = null;
                while(newPiece === null){
                    const input = prompt(TEXTS.Game.Promotion);//En quel type de pièce voulez-vous promouvoir? 1 => Reine, 2 => Tour, 3 => Fou, 4 => Cavalier
                    if (Number(input) === 1){
                        piece.type = "queen"
                        newPiece = piece;
                    }
                    if (Number(input) === 2){
                        piece.type = "rook"
                        newPiece = piece;
                    }
                    if (Number(input) === 3){
                        piece.type = "bishop"
                        newPiece = piece;
                    }
                    if (Number(input) === 4){
                        piece.type = "knight"
                        newPiece = piece;
                    }
                }
            }
        }

        piece.movementNb++;
        oldBoard.squares[to.position.y][to.position.x].piece = piece;
        oldBoard.lastMovedItem = {piece,coords:to}
    }
    context[1](oldBoard,type);
}