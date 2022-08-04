import IBoard from "../../types/iBoard";
import ICoords from "../../types/iCoords";
import IPiece from "../../types/iPiece";
import { ITeam } from "../../types/iTeam";
import { GRID_SIZE } from "./constants";

export function canPieceDrop(team:ITeam,piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    //if (team !== piece.team) return false;

    if (to.position.y === 5 && to.position.x === 0){
        console.log("Test")
    }

    if (isThereATeammate(team,board,to)) return false;
    switch (piece.type) {
        case "pawn":
            return canPawnDrop(piece,board,from,to);
        case "knight":
            return canKnightDrop(piece,board,from,to);
        case "queen":
            return canQueenDrop(piece,board,from,to);
        case "bishop":
            return canBishopDrop(piece,board,from,to);
        case "rook":
            return canRookDrop(piece,board,from,to);
        case "king":
            return canKingDrop(piece,board,from,to);
        default:
            break;
    }
    return false;
}
//Y=Row
//X=Columns

function canPawnDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    let fowardValue = -1;
    if (piece.team === "Blacks"){
        fowardValue = 1;
    }

    let target = board.squares[to.position.y][to.position.x].piece;
    //Is in row in front
    if (from.position.y + fowardValue === to.position.y){
        //Is in same column
        if (from.position.x === to.position.x){
            //If the target is empty
            if (target === null){
                return true;
            }
        }
        //Is at the column to side
        if ((isPossibleCase(from.position.x + 1) && (from.position.x + 1) === to.position.x) 
        || (isPossibleCase(from.position.x - 1) &&(from.position.x - 1) === to.position.x)){
            //If the target is not empty and is not in same team
            if (target !== null && target.team !== piece.team){
                return true;
            }
        }
    }
    //If is the start position and two row in front
    if (piece.movementNb === 0 && from.position.x === to.position.x && from.position.y + fowardValue*2 === to.position.y){
        if (board.squares[from.position.y + fowardValue][from.position.x].piece === null && 
            board.squares[from.position.y + fowardValue*2][from.position.x].piece === null){
            return true;
        }
    }
    if (board.lastMovedItem === null) return false;
    //En passant
    if (isEnPassant(piece,from,to,board)) return true;

    return false;
}
function canKnightDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    //Left top
    if (from.position.y + 2 === to.position.y && from.position.x - 1 === to.position.x) return true;
    if (from.position.y + 1 === to.position.y && from.position.x - 2 === to.position.x) return true;
    //Left bottom
    if (from.position.y - 2 === to.position.y && from.position.x - 1 === to.position.x) return true;
    if (from.position.y - 1 === to.position.y && from.position.x - 2 === to.position.x) return true;
    //Right top
    if (from.position.y - 2 === to.position.y && from.position.x + 1 === to.position.x) return true;
    if (from.position.y - 1 === to.position.y && from.position.x + 2 === to.position.x) return true;
    //Right bottom
    if (from.position.y + 2 === to.position.y && from.position.x + 1 === to.position.x) return true;
    if (from.position.y + 1 === to.position.y && from.position.x + 2 === to.position.x) return true;

    return false;
}
function canQueenDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    let squaresBetween : ICoords[];

    //Check the vertical line : |
    const vertical = makeLine(from,true);
    let listIndexFrom = findIndexInListCoords(vertical,from);
    let listIndexTo = findIndexInListCoords(vertical,to);
    if (listIndexTo !== -1){
        squaresBetween = extractPiecesBetween(vertical,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Check the horizontal line : -
    const horizontal = makeLine(from,false);
    listIndexFrom = findIndexInListCoords(horizontal,from);
    listIndexTo = findIndexInListCoords(horizontal,to);
    if (listIndexTo !== -1){
        squaresBetween = extractPiecesBetween(horizontal,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Check the diagonal line : /
    const diag1 = makeDiagonal(from,true);
    listIndexFrom = findIndexInListCoords(diag1,from);
    listIndexTo = findIndexInListCoords(diag1,to);
    if (listIndexTo !== -1){
        squaresBetween = extractPiecesBetween(diag1,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Check the second diagonal line : \
    const diag2 = makeDiagonal(from,false);
    listIndexFrom = findIndexInListCoords(diag2,from);
    listIndexTo = findIndexInListCoords(diag2,to);
    if (listIndexTo !== -1){
        squaresBetween = extractPiecesBetween(diag2,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    return false;
}
function canBishopDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    let squaresBetween : ICoords[];

    //Check the diagonal line : /
    const diag1 = makeDiagonal(from,true);
    let listIndexFrom = findIndexInListCoords(diag1,from);
    let listIndexTo = findIndexInListCoords(diag1,to);
    if (listIndexTo !== -1){
        squaresBetween = extractPiecesBetween(diag1,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Check the second diagonal line : \
    const diag2 = makeDiagonal(from,false);
    listIndexFrom = findIndexInListCoords(diag2,from);
    listIndexTo = findIndexInListCoords(diag2,to);
    if (listIndexTo !== -1){
        squaresBetween = extractPiecesBetween(diag2,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    return false;
}
function canRookDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    let squaresBetween : ICoords[];

    //Check the vertical line : |
    const vertical = makeLine(from,true);
    let listIndexFrom = findIndexInListCoords(vertical,from);
    let listIndexTo = findIndexInListCoords(vertical,to);
    if (listIndexTo !== -1){
        squaresBetween = extractPiecesBetween(vertical,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Check the horizontal line : -
    const horizontal = makeLine(from,false);
    listIndexFrom = findIndexInListCoords(horizontal,from);
    listIndexTo = findIndexInListCoords(horizontal,to);
    if (listIndexTo !== -1){
        squaresBetween = extractPiecesBetween(horizontal,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }

    return false;
}
function canKingDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    let diffX = from.position.x - to.position.x;
    let diffY = from.position.y - to.position.y;
    let nDiffX = diffX;
    let nDiffY = diffY;

    if (diffX < 0){
        nDiffX = -diffX;
    }
    if (diffY < 0){
        nDiffY = -diffY;
    }

    if (nDiffX === 1 && nDiffY === 0){
        return true;
    }
    if (nDiffX === 0 && nDiffY === 1){
        return true;
    }
    if (nDiffX === 1 && nDiffY === 1){
        return true;
    }
    if (to.position.x === 6 && to.position.y === 7){
        console.log("Test")
    }
    //Rook
    //If the king has not moved yet
    if (isACastling(piece,from,to,board)) return true;

    return false;
    //TODO Do promotion
}

function isLastMovedPiece(piece:IPiece,coords:ICoords,board:IBoard) : boolean{
    if (board.lastMovedItem === null) return false;
    if (piece.type !== board.lastMovedItem.piece.type) return false;
    if (piece.team !== board.lastMovedItem.piece.team) return false;
    if (piece.movementNb !== board.lastMovedItem.piece.movementNb) return false;
    if (coords.isOut) return false;
    if (coords.position.x !== board.lastMovedItem.coords.position.x) return false;
    if (coords.position.y !== board.lastMovedItem.coords.position.y) return false;
    return true;
}
function isPossibleCase(position:number){
    return position < GRID_SIZE && position >= 0;
}
function isThereATeammate(team:ITeam, board:IBoard, coords:ICoords) : boolean{
    let row = board.squares[coords.position.y];
    let square = row[coords.position.x]
    if (square.piece === null) return false
    if (square.piece.team === team) return true;
    return false;
}
function isTherePiecesBetween(board:IBoard,squaresBetween:ICoords[]){
    for (const coords of squaresBetween) {
        if (board.squares[coords.position.y][coords.position.x].piece !== null){
            return true;
        }
    }
    return false;
}
function makeDiagonal(start:ICoords,bottomToTop:boolean):ICoords[]{
    let squares : ICoords[] = []
    let startCorner : ICoords;

    if (bottomToTop){//=> /
        let x = start.position.x;
        let y = start.position.y;
        while(x > 0 && y > 0){
            x--;
            y--;
        }
        startCorner = {isOut:false,position:{x,y}}
    }
    else{//=> \
        let x = start.position.x;
        let y = start.position.y;
        while(x < GRID_SIZE-1 && y > 0){
            x++;
            y--;
        }
        startCorner = {isOut:false,position:{x,y}}
    }
    let x = startCorner.position.x;
    let y = startCorner.position.y;

    while((bottomToTop && x < GRID_SIZE && y < GRID_SIZE) || 
    (!bottomToTop && x >= 0 && y < GRID_SIZE)){
        squares.push({isOut:false,position:{x,y}});
        if (bottomToTop){
            x++;
            y++;
        }
        else{
            x--;
            y++
        }
    }
    return squares;
}
function makeLine(start:ICoords,vertical:boolean):ICoords[]{
    let newSquare : ICoords = {isOut:false, position:{y:Number(start.position.y),x:Number(start.position.x)}}

    if (vertical) newSquare.position.y = 0;
    else newSquare.position.x = 0;

    let squares : ICoords[] = []
    
    for (let index = 0; index < GRID_SIZE; index++) {
        if (vertical)squares.push({isOut:false, position:{y:start.position.y,x:index}})
        else squares.push({isOut:false, position:{y:index,x:start.position.x}})
    }
    return squares;
}
function findIndexInListCoords(list:ICoords[],coords:ICoords) : number{
    return list.findIndex((c)=> c.position.x === coords.position.x && c.position.y === coords.position.y)
}
function extractPiecesBetween(list:ICoords[],a:number,b:number){
    let diff = a - b;
    if (diff < 0){
        return list.splice(a+1,(-diff)-1);
    }
    else if (diff === 0){
        return list;
    }
    else{
        return list.splice(b+1,(diff)-1);
    }
}
export function isACastling(piece:IPiece,from:ICoords,to:ICoords,board:IBoard) : boolean{
    let diffX = from.position.x - to.position.x;
    let diffY = from.position.y - to.position.y;
    let nDiffX = diffX;
    let nDiffY = diffY;

    if (diffX < 0){
        nDiffX = -diffX;
    }
    if (diffY < 0){
        nDiffY = -diffY;
    }

    if (piece.movementNb === 0){
        //If the case is two square to the side
        if (nDiffX === 2 && nDiffY === 0){
            let rook : IPiece | null = null;
            let rookCoords : ICoords;
            //If the diff negative => the rook needs to be at the index 7.
            if (diffX < 0){
                rook = board.squares[from.position.y][0].piece;
                rookCoords = {isOut:false,position:{y:from.position.y,x:GRID_SIZE-1}}
            }
            //If the diff positive => the rook needs to be at the index 0.
            else{
                rook = board.squares[from.position.y][GRID_SIZE-1].piece;
                rookCoords = {isOut:false,position:{y:from.position.y,x:0}}
            }
            //If there is a rook and it has not moved yet.
            if (rook !== null && rook.movementNb === 0){
                let line = makeLine(from,true);
                let fromID = findIndexInListCoords(line,from);
                let rookID = findIndexInListCoords(line,rookCoords);
                let squaresInBetween = extractPiecesBetween(line,fromID,rookID);
                if (!isTherePiecesBetween(board,squaresInBetween)){
                    return true;
                }
            }
        }
    }
    return false;
}
export function isEnPassant(piece:IPiece,from:ICoords,to:ICoords,board:IBoard):boolean{
    let fowardValue = -1;
    let otherTeamPawnStart = 1;
    if (piece.team === "Blacks"){
        fowardValue = 1;
        otherTeamPawnStart = 6;
    }
    //Is the target one position in front of the enemy line and from 2 position in front of enemy line.
    if (to.position.y === otherTeamPawnStart - fowardValue && from.position.y === otherTeamPawnStart - 2*fowardValue){
        let otherPieceCoords : ICoords = {isOut:false,position:{y:otherTeamPawnStart - 2*fowardValue,x:to.position.x}}
        //Checks if there is a piece present 2 rows in front of the enemy line.
        if (board.squares[otherPieceCoords.position.y][otherPieceCoords.position.x].piece !== null){
            let otherpiece = board.squares[otherPieceCoords.position.y][otherPieceCoords.position.x].piece;
            //Check if the piece is at his first move and was the last moved piece.
            if (otherpiece!.movementNb === 1 && isLastMovedPiece(otherpiece!,otherPieceCoords,board)){
                //Check if the piece is at the sides
                if ((isPossibleCase(from.position.x + 1) && (from.position.x + 1) === to.position.x) 
                || (isPossibleCase(from.position.x - 1) && (from.position.x - 1) === to.position.x)){
                    //Checks if the enemy on the same row
                    if (from.position.y === otherPieceCoords.position.y){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}