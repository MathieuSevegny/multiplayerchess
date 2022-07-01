import { Button, ButtonGroup, TextField } from "@mui/material";
import { useState } from "react";
import styles from "../styles/HomePage.module.css";
import { TEXTS } from "../text/text";
import { ITeam } from "../types/iTeam";

export default function HomePage() {
    const [team,setTeam] = useState<ITeam>("Whites");
    const [gameID,setGameID] = useState<string>("");

    return (
        <div className={styles.mainMenu}>
            <div className={styles.mainMenuElement}>
                <h1>{TEXTS.HomePage.Title}</h1>
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
                <Button variant="contained">{TEXTS.HomePage.Actions.Create}</Button>
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
                <Button className={styles.input} variant="contained">{TEXTS.HomePage.Actions.Join}</Button>
                </div>
            </div>
        </div>
    )
}