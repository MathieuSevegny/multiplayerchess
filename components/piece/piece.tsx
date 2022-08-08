import { useContext } from "react";
import { DragPreviewImage, useDrag } from "react-dnd";
import { GameContext, TeamContext, TurnContext } from "../../pages/game";
import IBoard from "../../types/iBoard";
import { IDnDItem } from "../../types/iDnDItem";
import IPiece from "../../types/iPiece";
import styles from "./piece.module.css";

/**
 * Représente une pièce d'échec.
 */
export default function Piece(props:IDnDItem){
  const turnContext = useContext(TurnContext);
  const gameContext = useContext(GameContext);
  const teamContext = useContext(TeamContext);
  let canBeDragged = process.env.NODE_ENV == "development" ? true : props.piece.team === teamContext && turnContext[0] === props.piece.team;
  const src = `/chesspieces/${props.piece.team === "Blacks" ? "b-" : "w-"}${props.piece.type}.png`
  const [{ isDragging }, drag,dragPreviewImage] = useDrag(() => ({
    type: "piece",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: (monitor) => {
      return canBeDragged
    },
    item:props
  }))
    return <>
    <DragPreviewImage src={src} connect={dragPreviewImage} />
    <div ref={drag} 
    className={isPieceInCheck(props.piece,gameContext[0]!) ? styles.inCheck : ""}
      style={{
        visibility:isDragging?"hidden":"visible",
        cursor: canBeDragged ? 'move' : "default",
        backgroundImage:`url('${src}')`,
        width:props.coords.isOut ? 100 : 200,
        backgroundSize: typeof window !== "undefined" ? (window.innerHeight / 10) + "px" : 80 + "px",
        backgroundPosition:"center",
        backgroundRepeat:"no-repeat"
    }}>
      </div>
      </>
}
function isPieceInCheck(piece:IPiece,board:IBoard){
  if (piece.type !== "king") return false;
  console.log(board.kingsPos[piece.team!].isInCheck)
  return board.kingsPos[piece.team!].isInCheck;
}