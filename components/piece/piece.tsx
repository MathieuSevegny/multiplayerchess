import { DragPreviewImage, useDrag } from "react-dnd";
import { IDnDItem } from "../../types/iDnDItem";

export default function Piece(props:IDnDItem){
  const src = `/chesspieces/${props.piece.team === "Blacks" ? "b-" : "w-"}${props.piece.type}.png`
  const [{ isDragging }, drag,dragPreviewImage] = useDrag(() => ({
    type: "piece",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    item:props
  }))
    return <>
    <DragPreviewImage src={src} connect={dragPreviewImage} />
    <div ref={drag} 
    style={{
      visibility:isDragging?"hidden":"visible",
      cursor: 'move',
      backgroundImage:`url('${src}')`,
      width:props.coords.isOut ? 100 : 200,
      backgroundSize:100,
      backgroundPosition:"center",
      backgroundRepeat:"no-repeat"
    }}>
      </div>
      </>
}