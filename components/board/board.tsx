import IBoard from "../../types/iBoard";
import { GRID_SIZE } from "../../utils/chess/constants";
import { createRandomKey } from "../../utils/utils";
import Square from "../square/square";
import styles from "./board.module.css";

/**
 * Represent the chess board. 
 */
export default function Board(props:{board:IBoard}) : JSX.Element{
    let rows : JSX.Element[] = [];

    let counter = 0;
    for (let rowID = 0; rowID < GRID_SIZE; rowID++) {
        let columns = [];
        for (let columnID = 0; columnID < GRID_SIZE; columnID++) {
            const square = props.board.squares[rowID][columnID];
            columns.push(<Square rowID={rowID} columnID={columnID} key={`${createRandomKey()}+${rowID}+${columnID}`} piece={square.piece} color={counter % 2 === 0 ? "White": "Black"}/>)
            counter++;
        }
        let row = <div key={`row-${rowID}-${createRandomKey()}`} className={styles.row}>{columns}</div>
        rows.push(row);
        counter++;
    }

    return <div className={styles.board}>{rows}</div>;
}
