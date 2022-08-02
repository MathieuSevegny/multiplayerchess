import { DefaultEventsMap } from '@socket.io/component-emitter'
import { useRouter } from 'next/router'
import { createContext, SetStateAction, useCallback, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { io, Socket } from 'socket.io-client'
import Board from '../components/board/board'
import OutZone from '../components/outzone/outzone'
import IBoard from '../types/iBoard'
import { ITeam } from '../types/iTeam'
import { IJoinServerInfos } from '../types/ws/queries'
import { StartPosition } from '../utils/chess/startPositions'
import styles from "../styles/game.module.css"
import { createRandomKey } from '../utils/utils'

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export type GameContextType = [IBoard | null,(board:IBoard | null)=>void]

export const GameContext = createContext<GameContextType>([null,() => console.error("too soon")]);

export default function Game() {
  const router = useRouter()

  const [board, setBoard] = useState<IBoard | null>(StartPosition);
  const [serverInfos, setServerInfos] = useState<IJoinServerInfos | null>(null);
  const [team,setTeam] = useState<ITeam | null>("Blacks");
  
  
  /*useEffect(() => {
    initializeServer(router.query);
    socketInitializer(router.query);
  },[router.query]);

  const initializeServer = (query:any) => {
    const serverInfos : IJoinServerInfos = query;
    setServerInfos(serverInfos);

    if (!serverInfos){
      return;
    }
    if (!serverInfos!.serverID || !serverInfos!.userID ){
      router.push({pathname:"/"});
    }
  }

  const socketInitializer = async (serverInfos:any) => {
    await fetch('/api/socket');
    socket = io()
    socket.on('connect', () => {
      //Send server info
      socket.emit("join",serverInfos);
    })
    socket.on('boardValue', (board : IBoard) =>{
      setBoard(board);
      console.log(board);
    })
  }*/

  function onChangeHandler(e: { target: { value: SetStateAction<string> } }) {
    socket.emit('board-change', e.target.value)
  }

  return (
    <GameContext.Provider value={[board,setBoard]}>
      <DndProvider backend={HTML5Backend}>
        <div className={`${team === "Blacks" ? "reversed" : ""} ${styles.gameDiv}`}>
          {board && <Board key={createRandomKey()} board={board} />}
          {board && <OutZone key={createRandomKey()}/>}
        </div>
      </DndProvider>
    </GameContext.Provider>
  )
}
