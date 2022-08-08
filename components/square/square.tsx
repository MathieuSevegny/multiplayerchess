import { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GameContext, TeamContext } from "../../pages/game";
import IBoard from "../../types/iBoard";
import ICoords from "../../types/iCoords";
import { IDnDItem } from "../../types/iDnDItem";
import IPiece from "../../types/iPiece";
import { canPieceDrop } from "../../utils/chess/canDrop";
import { movePiece } from "../../utils/chess/movement";
import Piece from "../piece/piece";
import styles from "./square.module.css";

/**
 * Represent a square of the chess board.
 */
export default function Square(props:{color:"White" | "Black",piece:IPiece | null,rowID:number,columnID:number}) : JSX.Element{
    const context = useContext(GameContext);
    const teamContext = useContext(TeamContext);
    const currentLocation : ICoords = {isOut:false,position:{x:props.columnID,y:props.rowID}}

    const [{ isOver,canDrop }, drop] = useDrop(
        () => ({
          accept: "piece",
          canDrop(item:IDnDItem, monitor) {
            return canPieceDrop(teamContext,item.piece,context[0]!,item.coords,currentLocation);
          },
          drop: (item : IDnDItem, monitor) => movePiece(context,item.piece,item.coords,currentLocation),
          collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
          })
        }),
        [props.columnID, props.rowID]
      )
    function getColor(){
      if(isOver && !canDrop) return "red";
      if(!isOver && canDrop) return "yellow";
      if(isOver && canDrop) return "green";

      if (props.color === "Black") return "#4b7399";
      return "#eae9d2"
    }
    
    return <div 
    ref={drop}
    style={
      {
        backgroundColor:getColor()
      }
    }
    className={`${styles.square}`}
        >
        {props.piece !== null && <Piece piece={props.piece} coords={currentLocation}/>}
        </div>;
}

