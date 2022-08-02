import { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GameContext } from "../../pages/game";
import IBoard from "../../types/iBoard";
import ICoords from "../../types/iCoords";
import { IDnDItem } from "../../types/iDnDItem";
import IPiece from "../../types/iPiece";
import { movePiece } from "../../utils/utils";
import Piece from "../piece/piece";
import styles from "./square.module.css";

export default function Square(props:{color:"White" | "Black",piece:IPiece | null,rowID:number,columnID:number}) : JSX.Element{
    const context = useContext(GameContext);
    const currentLocation : ICoords = {isOut:false,position:{x:props.columnID,y:props.rowID}}

    

    const [{ isOver,isInSameTeam }, drop] = useDrop(
        () => ({
          accept: "piece",
          drop: (item : IDnDItem, monitor) => movePiece(context,item.piece,item.coords,currentLocation),
          collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            isInSameTeam:(monitor.getItem()?.piece.team === props.piece?.team)
          })
        }),
        [props.columnID, props.rowID]
      )
    function shouldBeYellow(){
      return isOver && !isInSameTeam;
    }
      
    return <div 
    ref={drop}
    className={`${styles.square} ${props.color === "Black" ? styles.black : styles.white} ${shouldBeYellow() ? styles.over : ""}`}
        >
        {props.piece !== null && <Piece piece={props.piece} coords={currentLocation}/>}
        </div>;
}

