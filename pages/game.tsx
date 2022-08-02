import { DefaultEventsMap } from '@socket.io/component-emitter'
import { useRouter } from 'next/router'
import { createContext, SetStateAction, useCallback, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Socket } from 'socket.io-client'
import Board from '../components/board/board'
import OutZone from '../components/outzone/outzone'
import IBoard from '../types/iBoard'
import { ITeam } from '../types/iTeam'
import { IJoinServerInfos } from '../types/ws/queries'
import { StartPosition } from '../utils/chess/startPositions'
import styles from "../styles/game.module.css"
import { createRandomKey } from '../utils/utils'
import { TEXTS } from '../text/text'
import { Button, ButtonGroup } from '@mui/material'
import { IMoveType } from '../types/iMoveType'

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export type GameContextType = [IBoard | null,(board:IBoard | null, moveType:IMoveType)=>void]
export type TurnContextType = [ITeam | null,(newTurn:ITeam | null)=>void]

export const GameContext = createContext<GameContextType>([null,() => console.error("too soon")]);
export const TurnContext = createContext<TurnContextType>([null,() => console.error("too soon")]);
export const TeamContext = createContext<ITeam | null>(null);

export default function Game() {
  const router = useRouter()

  const [board, setBoard] = useState<IBoard | null>(StartPosition);
  const [serverInfos, setServerInfos] = useState<IJoinServerInfos | null>(null);
  const [team,setTeam] = useState<ITeam | null>("Blacks");
  const [turn,setTurn] = useState<ITeam>("Whites");
  
  useEffect(() => {
    const queries = router.query as any;
    if (queries.t === "b"){
      setTeam("Blacks")
    }
    else if (queries.t === "w"){
      setTeam("Whites")
    }
    else{
      return;
    }

    router.replace("/game", '',{ shallow: true });
  },[router, router.query])
  
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

  function onChangeBoard(newBoard:IBoard | null, moveType:IMoveType) {
    let audio = new Audio(`/sounds/${moveType}.mp3`)
    audio.play();
    setBoard(newBoard)
  }
  function onChangeTurn(newTurn:ITeam | null) {
    let audio = new Audio(`/sounds/TurnChanged.mp3`)
    audio.play();
    setTurn(newTurn)
  }

  return (
    <TeamContext.Provider value={team}>
      <TurnContext.Provider value={[turn,onChangeTurn]}>
        <GameContext.Provider value={[board,onChangeBoard]}>
          <DndProvider backend={HTML5Backend}>
            <div className={`${team === "Blacks" ? "reversed" : ""} ${styles.gameDiv}`}>
              {board && <Board key={createRandomKey()} board={board} />}
              <div className={styles.rightDiv}>
                <div className={styles.turnDiv}>
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                      <Button className={styles.turnButton} onClick={() => onChangeTurn("Whites")} disabled={turn === "Whites"}>{TEXTS.Colors.Whites}</Button>
                      <Button className={styles.turnButton} onClick={() => onChangeTurn("Blacks")} disabled={turn === "Blacks"}>{TEXTS.Colors.Blacks}</Button>
                  </ButtonGroup>
                  {turn !== team && <h2>{turn === "Whites" ? TEXTS.Game.Turn.Whites : TEXTS.Game.Turn.Blacks}</h2>}
                  {turn === team && <h2>{TEXTS.Game.Turn.Your}</h2>}
                </div>
                <br/>
                {board && <OutZone key={createRandomKey()}/>}
              </div>
            </div>
          </DndProvider>
        </GameContext.Provider>
      </TurnContext.Provider>
    </TeamContext.Provider>
  )
}
