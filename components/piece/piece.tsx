import { useContext } from "react";
import { DragPreviewImage, useDrag } from "react-dnd";
import { TeamContext, TurnContext } from "../../pages/game";
import { IDnDItem } from "../../types/iDnDItem";

/**
 * Represent a chess piece.
 */
export default function Piece(props:IDnDItem){
  const turnContext = useContext(TurnContext);
  const teamContext = useContext(TeamContext);
  let canBeDragged = props.piece.team === teamContext && turnContext[0] === props.piece.team;
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