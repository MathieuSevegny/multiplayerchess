import { useContext, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { GameContext } from "../../pages/game";
import { TEXTS } from "../../text/text";
import ICoords from "../../types/iCoords";
import { IDnDItem } from "../../types/iDnDItem";
import IPiece from "../../types/iPiece";
import { createRandomKey, movePiece } from "../../utils/utils";
import Piece from "../piece/piece";
import styles from "./outzone.module.css"

/**
 * Represent the zone where dead pieces are.
 */
export default function OutZone(){
    const context = useContext(GameContext);
    const [height,setHeight] = useState<number>(700);
    const [{ isOver }, drop] = useDrop(
        () => ({
          accept: "piece",
          drop: (item : IDnDItem, monitor) => movePiece(context,item.piece,item.coords,{isOut:true,position:{x:0,y:0}}),
          collect: (monitor) => ({
            isOver: !!monitor.isOver()
          })
        }))
    useEffect(()=>{
      setHeight(window.innerHeight);
    },[])
    
    return <>
      <div style={{
        minHeight:(height / 1.7) + "px",
      }} 
      className={styles.zone + " " + (isOver ? styles.over : "")} ref={drop}>
          {context[0]!.out.map((piece,i) => {
              return <div className={styles.item} key={createRandomKey()}><Piece key={createRandomKey()} piece={piece} coords={{isOut:true,position:{x:i,y:0}}}/></div>
          })}
      </div>
    </>
}