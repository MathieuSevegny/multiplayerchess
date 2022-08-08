import { Button, ButtonGroup, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/HomePage.module.css";
import { TEXTS } from "../text/text";
import { ITeam } from "../types/iTeam";
import Client from "../utils/chess/client";
import Image from "next/image";
import { socket } from "./game";

export default function HomePage() {
    const router = useRouter()
    const [team,setTeam] = useState<ITeam>("Whites");
    const [gameID,setGameID] = useState<string>("");
    const [showEE,setShowEE] = useState<boolean>(false);
    
    useEffect(()=>{
        if (socket){
            socket.disconnect();
        }
    })
    
    async function createServer(team:ITeam){
        Client.CreateServer(team,router);
    }
    async function joinServer(id:string){
        Client.JoinServer(id,router);
    }

    return (
        <div className={styles.mainMenu}>
            {showEE && <Image alt="babycapybara" width={500} height={300} src={"/babycapybara.jpg"}/>}
            <div className={styles.mainMenuElementH + " " + styles.title}>
                <h1 className={TEXTS.HomePage.Title.BeforeC.at(-1) === " " ? styles.titleRightSpacing : ""}>
                    {TEXTS.HomePage.Title.BeforeC}
                </h1>
                <h1 style={{cursor:"pointer"}} onClick={()=> setShowEE(!showEE)}>c</h1>
                <h1 className={TEXTS.HomePage.Title.AfterC.at(0) === " " ? styles.titleLeftSpacing : ""}>
                    {TEXTS.HomePage.Title.AfterC}
                </h1>
            </div>
            <hr/>
            <div className={styles.mainMenuElementV}>
                <h1>{TEXTS.HomePage.Create}</h1>
                <h2>{TEXTS.HomePage.ChooseTeam}</h2>
                <div className={styles.mainMenuElementH}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button onClick={() => setTeam("Whites")} disabled={team === "Whites"}>{TEXTS.Colors.Whites}</Button>
                    <Button onClick={() => setTeam("Blacks")} disabled={team === "Blacks"}>{TEXTS.Colors.Blacks}</Button>
                </ButtonGroup>
                </div>
                <br/>
                <Button variant="contained" onClick={()=>createServer(team)}>{TEXTS.HomePage.Actions.Create}</Button>
            </div>
            <hr/>
            <div className={styles.mainMenuElementV}>
                <h1>{TEXTS.HomePage.Join}</h1>
                <div className={styles.mainMenuElementH}>
                <TextField
                    InputProps={{
                    className: styles.input
                    }}
                    value={gameID}
                    onChange={(e) => setGameID(e.target.value)}
                    label={TEXTS.HomePage.GameID}
                    variant="outlined"
                />
                <Button className={styles.input} onClick={()=>joinServer(gameID)} variant="contained">{TEXTS.HomePage.Actions.Join}</Button>
                </div>
            </div>
        </div>
    )
}