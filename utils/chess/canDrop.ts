import IBoard from "../../types/iBoard";
import ICoords from "../../types/iCoords";
import IPiece from "../../types/iPiece";
import { ITeam } from "../../types/iTeam";
import { GRID_SIZE } from "./constants";

/**
 * Donne la vérification que la pièce peut être déplacer à l'endroit spécifié.
 * @param team 
 * @param piece 
 * @param board 
 * @param from 
 * @param to 
 * @returns 
 */
export function canPieceDrop(team:ITeam,piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    if (isThereATeammate(team,board,to)) return false;

    let canPossiblyDrop = false;

    switch (piece.type) {
        case "pawn":
            canPossiblyDrop = canPawnDrop(piece,board,from,to);
            break;
        case "knight":
            canPossiblyDrop = canKnightDrop(piece,board,from,to);
            break;
        case "queen":
            canPossiblyDrop = canQueenDrop(piece,board,from,to);
            break;
        case "bishop":
            canPossiblyDrop = canBishopDrop(piece,board,from,to);
            break;
        case "rook":
            canPossiblyDrop = canRookDrop(piece,board,from,to);
            break;
        case "king":
            canPossiblyDrop = canKingDrop(piece,board,from,to);
            break;
        default:
            break;
    }
    if (canPossiblyDrop){
        if (!detectCauseCheck(piece,board,from,to)){
            return true;
        }
    }
    return false;
}
//Y=Rangées
//X=Colonnes
/**
 * Regarde si le pion peut être déplacer dans le carré spécifié.
 * @param piece 
 * @param board 
 * @param from 
 * @param to 
 * @returns 
 */
function canPawnDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    let fowardValue = -1;
    if (piece.team === "Blacks"){
        fowardValue = 1;
    }

    let target = board.squares[to.position.y][to.position.x].piece;
    //Est-ce que c'est dans la rangée en avant?
    if (from.position.y + fowardValue === to.position.y){
        //Est-ce que c'est dans la même colonne?
        if (from.position.x === to.position.x){
            //Est-ce que le carré est vide?
            if (target === null){
                return true;
            }
        }
        //Est-ce qu'il est sur la colonne à côté?
        if ((isPossibleCase(from.position.x + 1) && (from.position.x + 1) === to.position.x) 
        || (isPossibleCase(from.position.x - 1) &&(from.position.x - 1) === to.position.x)){
            //Est-ce que la case ciblée n'est pas vide et est rempli par un ennemi?
            if (target !== null && target.team !== piece.team){
                return true;
            }
        }
    }
    //Est-ce que c'est le premier déplacement et que la case ciblée est deux rangées en avant?
    if (piece.movementNb === 0 && from.position.x === to.position.x && from.position.y + fowardValue*2 === to.position.y){
        //Est-ce qu'il y a des obstacles?
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
/**
 * Regarde si le cavalier peut être déplacer dans le carré spécifié.
 * @param piece 
 * @param board 
 * @param from 
 * @param to 
 * @returns 
 */
function canKnightDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    //En haut à gauche.
    if (from.position.y + 2 === to.position.y && from.position.x - 1 === to.position.x) return true;
    if (from.position.y + 1 === to.position.y && from.position.x - 2 === to.position.x) return true;
    //En bas à gauche.
    if (from.position.y - 2 === to.position.y && from.position.x - 1 === to.position.x) return true;
    if (from.position.y - 1 === to.position.y && from.position.x - 2 === to.position.x) return true;
    //En haut à droite.
    if (from.position.y - 2 === to.position.y && from.position.x + 1 === to.position.x) return true;
    if (from.position.y - 1 === to.position.y && from.position.x + 2 === to.position.x) return true;
    //En bas à droite.
    if (from.position.y + 2 === to.position.y && from.position.x + 1 === to.position.x) return true;
    if (from.position.y + 1 === to.position.y && from.position.x + 2 === to.position.x) return true;

    return false;
}
/**
 * Regarde si la reine peut être déplacer dans le carré spécifié.
 * @param piece 
 * @param board 
 * @param from 
 * @param to 
 * @returns 
 */
function canQueenDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    let squaresBetween : ICoords[];

    //Regarde la ligne verticale : |
    const vertical = makeLine(from,true);
    let listIndexFrom = findIndexInListCoords(vertical,from);
    let listIndexTo = findIndexInListCoords(vertical,to);
    if (listIndexTo !== -1){
        squaresBetween = extractSquaresBetween(vertical,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Regarde la ligne horizontale : -
    const horizontal = makeLine(from,false);
    listIndexFrom = findIndexInListCoords(horizontal,from);
    listIndexTo = findIndexInListCoords(horizontal,to);
    if (listIndexTo !== -1){
        squaresBetween = extractSquaresBetween(horizontal,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Regarde la première ligne diagonale : /
    const diag1 = makeDiagonal(from,true);
    listIndexFrom = findIndexInListCoords(diag1,from);
    listIndexTo = findIndexInListCoords(diag1,to);
    if (listIndexTo !== -1){
        squaresBetween = extractSquaresBetween(diag1,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Regarde la deuxième ligne diagonale : \
    const diag2 = makeDiagonal(from,false);
    listIndexFrom = findIndexInListCoords(diag2,from);
    listIndexTo = findIndexInListCoords(diag2,to);
    if (listIndexTo !== -1){
        squaresBetween = extractSquaresBetween(diag2,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    return false;
}
/**
 * Regarde si le fou peut être déplacer dans le carré spécifié.
 * @param piece 
 * @param board 
 * @param from 
 * @param to 
 * @returns 
 */
function canBishopDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    let squaresBetween : ICoords[];

    //Regarde la première ligne diagonale : /
    const diag1 = makeDiagonal(from,true);
    let listIndexFrom = findIndexInListCoords(diag1,from);
    let listIndexTo = findIndexInListCoords(diag1,to);
    if (listIndexTo !== -1){
        squaresBetween = extractSquaresBetween(diag1,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Regarde la deuxième ligne diagonale : \
    const diag2 = makeDiagonal(from,false);
    listIndexFrom = findIndexInListCoords(diag2,from);
    listIndexTo = findIndexInListCoords(diag2,to);
    if (listIndexTo !== -1){
        squaresBetween = extractSquaresBetween(diag2,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    return false;
}
/**
 * Regarde si la tour peut être déplacer dans le carré spécifié.
 * @param piece 
 * @param board 
 * @param from 
 * @param to 
 * @returns 
 */
function canRookDrop(piece:IPiece,board:IBoard,from:ICoords,to:ICoords) : boolean {
    let squaresBetween : ICoords[];

    //Regarde la ligne verticale : |
    const vertical = makeLine(from,true);
    let listIndexFrom = findIndexInListCoords(vertical,from);
    let listIndexTo = findIndexInListCoords(vertical,to);
    if (listIndexTo !== -1){
        squaresBetween = extractSquaresBetween(vertical,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }
    //Regarde la ligne horizontale : -
    const horizontal = makeLine(from,false);
    listIndexFrom = findIndexInListCoords(horizontal,from);
    listIndexTo = findIndexInListCoords(horizontal,to);
    if (listIndexTo !== -1){
        squaresBetween = extractSquaresBetween(horizontal,listIndexFrom,listIndexTo);
        if (!isTherePiecesBetween(board,squaresBetween)) return true;
    }

    return false;
}
/**
 * Regarde si le roi peut être déplacer dans le carré spécifié.
 * @param piece 
 * @param board 
 * @param from 
 * @param to 
 * @returns 
 */
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
    if (isACastling(piece,from,to,board)) return true;

    return false;
}
/**
 * Regarde si la pièce donnée est la dernière déplacée.
 * @param piece 
 * @param coords 
 * @param board 
 * @returns 
 */
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
/**
 * Regarde si la position donnée est possible.
 * @param position 
 * @returns 
 */
function isPossibleCase(position:number){
    return position < GRID_SIZE && position >= 0;
}
/**
 * Regarde si la case contient un coéquipier.
 * @param team 
 * @param board 
 * @param coords 
 * @returns 
 */
function isThereATeammate(team:ITeam, board:IBoard, coords:ICoords) : boolean{
    let row = board.squares[coords.position.y];
    let square = row[coords.position.x]
    if (square.piece === null) return false
    if (square.piece.team === team) return true;
    return false;
}
/**
 * Regarde si une pièce est contenue dans une liste de coordonnées.
 * @param board 
 * @param squaresBetween 
 * @returns 
 */
function isTherePiecesBetween(board:IBoard,squaresBetween:ICoords[]){
    for (const coords of squaresBetween) {
        if (board.squares[coords.position.y][coords.position.x].piece !== null){
            return true;
        }
    }
    return false;
}
/**
 * Réalise une diagonale (en bas à en haut / ou en haut à en bas \)
 * @param start 
 * @param bottomToTop 
 * @returns 
 */
function makeDiagonal(start:ICoords,bottomToTop:boolean):ICoords[]{
    let squares : ICoords[] = []
    let startCorner : ICoords;

    if (bottomToTop){//=> /
        let x = start.position.x;
        let y = start.position.y;
        
        if (x <= y){
            y -= x;
            x = 0;
        }else{
            x -= y;
            y = 0;
        }
        startCorner = {isOut:false,position:{x,y}}
    }
    else{//=> \
        let x = start.position.x;
        let y = start.position.y;

        let diffX = (GRID_SIZE-1) - x;
        let diffY = y - 0;
        
        //Si la position est plus proche de X.
        if (diffX <= diffY){
            x = GRID_SIZE-1;
            y -= diffX; 
        }
        //Sinon la position est plus proche de y
        else{
            x += diffY;
            y = 0; 
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
/**
 * Réalise une ligne (verticale/horizontale)
 * @param start 
 * @param vertical 
 * @returns 
 */
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
/**
 * Trouve la position d'une coordonnée dans une liste de coordonnées.
 * @param list 
 * @param coords 
 * @returns 
 */
function findIndexInListCoords(list:ICoords[],coords:ICoords) : number{
    return list.findIndex((c)=> c.position.x === coords.position.x && c.position.y === coords.position.y)
}
/**
 * Extrait les carrés entre deux index.
 * @param list 
 * @param a 
 * @param b 
 * @returns 
 */
function extractSquaresBetween(list:ICoords[],a:number,b:number){
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
/**
 * Regarde si c'est un roque valide.
 * @param piece 
 * @param from 
 * @param to 
 * @param board 
 * @returns 
 */
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
        //Est-ce que le carré deux colonnes à côté et dans la même rangée.
        if (nDiffX === 2 && nDiffY === 0){
            let rook : IPiece | null = null;
            let rookCoords : ICoords;
            //Est-ce que la différence est négative => la tour doit être à la position 7.
            if (diffX < 0){
                rook = board.squares[from.position.y][0].piece;
                rookCoords = {isOut:false,position:{y:from.position.y,x:GRID_SIZE-1}}
            }
            //Est-ce que la différence est positive => la tour doit être à la position 0.
            else{
                rook = board.squares[from.position.y][GRID_SIZE-1].piece;
                rookCoords = {isOut:false,position:{y:from.position.y,x:0}}
            }
            //Si il y a une tour et quelle n'a pas encore bougé.
            if (rook !== null && rook.movementNb === 0){
                let line = makeLine(from,true);
                let fromID = findIndexInListCoords(line,from);
                let rookID = findIndexInListCoords(line,rookCoords);
                let squaresInBetween = extractSquaresBetween(line,fromID,rookID);
                if (!isTherePiecesBetween(board,squaresInBetween)){
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * Regarde si c'est un « en passant » valide.
 * @param piece 
 * @param from 
 * @param to 
 * @param board 
 * @returns 
 */
export function isEnPassant(piece:IPiece,from:ICoords,to:ICoords,board:IBoard):boolean{
    let fowardValue = -1;
    let otherTeamPawnStart = 1;
    if (piece.team === "Blacks"){
        fowardValue = 1;
        otherTeamPawnStart = 6;
    }
    //Si la cible est une position en devant de la ligne ennemie et la pièce 2 positions en devant de la ligne ennemi.
    if (to.position.y === otherTeamPawnStart - fowardValue && from.position.y === otherTeamPawnStart - 2*fowardValue){
        let otherPieceCoords : ICoords = {isOut:false,position:{y:otherTeamPawnStart - 2*fowardValue,x:to.position.x}}
        //Regarde si il y a une pièce présente à 2 positions devant la ligne ennemie.
        if (board.squares[otherPieceCoords.position.y][otherPieceCoords.position.x].piece !== null){
            let otherpiece = board.squares[otherPieceCoords.position.y][otherPieceCoords.position.x].piece;
            //Regarde si l'autre pièce est à son premier déplacement de réalisé et que c'est la dernière pièce déplacée.
            if (otherpiece!.movementNb === 1 && isLastMovedPiece(otherpiece!,otherPieceCoords,board)){
                //Regarde si la case est sur les côtés.
                if ((isPossibleCase(from.position.x + 1) && (from.position.x + 1) === to.position.x) 
                || (isPossibleCase(from.position.x - 1) && (from.position.x - 1) === to.position.x)){
                    //Regarde si l'ennemi sur la même colonne.
                    if (from.position.y === otherPieceCoords.position.y){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
/**
 * Détecte si un déplacement cause un échec.
 * @param piece 
 * @param board 
 * @param from 
 * @param to 
 * @returns 
 */
function detectCauseCheck(piece:IPiece,board:IBoard,from:ICoords,to:ICoords){
    //Crée un jeu alternatif
    let altBoard = JSON.parse(JSON.stringify(board)) as IBoard;
    
    if (piece.type === "king"){
        altBoard.kingsPos[piece.team!].coords = to;
    }
    //Change la position de la pièce.
    altBoard.squares[from.position.y][from.position.x].piece = null;
    altBoard.squares[to.position.y][to.position.x].piece = piece;

    return detectCheck(piece.team,altBoard);
}
/**
 * Détecte si le roi d'une équipe est en échec.
 * @param team 
 * @param board 
 * @returns 
 */
export function detectCheck(team:ITeam,board:IBoard){
    for (let rowID = 0; rowID < GRID_SIZE; rowID++) {
        for (let columnID = 0; columnID < GRID_SIZE; columnID++) {
            let otherPiece = board.squares[rowID][columnID].piece;
            if (otherPiece === null || otherPiece.team === team){
                continue;
            }
            let currentCoords : ICoords = {isOut:false, position:{y:rowID,x:columnID}}
            //Regarde si la pièce peut attaquer le roi.
            if (canPieceDrop(otherPiece.team,otherPiece,board,currentCoords,board.kingsPos[team!].coords)){
                return true;
            }
        }
    }
    return false;
}