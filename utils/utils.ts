import { Context, useContext } from 'react';
import {v4 as uuidv4} from 'uuid';
import { GameContext, GameContextType } from '../pages/game';
import IBoard from '../types/iBoard';
import ICoords from '../types/iCoords';
import IPiece from '../types/iPiece';

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
        context[1](oldBoard);
        return;
    }
    if (from.isOut && to.isOut){
        return;
    }
    //Checks if the square is occupied by 
    if (oldBoard.squares[to.position.y][to.position.x].piece?.team !== piece.team){
        //Move the piece
        oldBoard.squares[from.position.y][from.position.x].piece = null;
        if (oldBoard.squares[to.position.y][to.position.x].piece) {
            oldBoard.out.push(oldBoard.squares[to.position.y][to.position.x].piece!);
        }
        oldBoard.squares[to.position.y][to.position.x].piece = piece;
    }
    context[1](oldBoard);
}