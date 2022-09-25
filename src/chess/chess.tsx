import { Paper, Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import styles from './chess.module.css'
import { useHandlers } from './useHandlers'
import { useInitializeBoard } from './useInitializeBoard'
import { Board, BoardSquare } from "../utils/interfaces"
import { useBoardHistory } from './useBoardHistory'

export default function Chess() {

    const [board, setBoard] = useInitializeBoard()

    const [boardHistory, setBoardHistory] = useBoardHistory()

    const {handleBoxClick, checkmate, chooseFigure, handleChooseFigure} = useHandlers(board, setBoard, boardHistory, setBoardHistory)

    const figures = (figureColor: 'white' | 'black') => ([
        {figureImg: `Rook_${figureColor}.png`, figureName: 'Rook', figureColor},
        {figureImg: `Horse_${figureColor}.png`, figureName: 'Horse', figureColor},
        {figureImg: `Bishop_${figureColor}.png`, figureName: 'Bishop', figureColor},
        {figureImg: `Queen_${figureColor}.png`, figureName: 'Queen', figureColor}
    ])
    const style = chooseFigure && chooseFigure.color === 'white' ? { top: 0 } : { bottom: 0 };
  return (
    <div className={styles.main}>
            {checkmate && `${checkmate} wins`}
        <Paper classes={{root: styles.board}} >
            {Array.isArray(board) && board.map((row: any, i: number)=>{
                return row.map((square: any, j: number)=>(
                    <Button key={`${i}_${j}`} onClick={()=>(handleBoxClick(square, i, j, board))} classes={{root: styles.square}}>
                        <div className={styles.square} style={{backgroundColor: square.color, backgroundImage: `url("/chessPieces/${square.figureImg}")`}}> 
                        {chooseFigure && chooseFigure.i === i && chooseFigure.j === j && 
                            <Paper classes={{root: styles.figures}} sx={{...style, zIndex: 100}} >
                                {figures(chooseFigure.color).map((square: any)=>{
                                    
                                    return <div key={`${i}_${j}_${square.figureName}`} onClick={(e)=>{e.preventDefault(); e.stopPropagation(); handleChooseFigure(square, i, j, board)}} className={styles.squareWithoutBorder}>
                                        <div className={styles.square} style={{backgroundColor: square.color, backgroundImage: `url("/chessPieces/${square.figureImg}")`, }}> 
                                        </div>
                                    </div>
                                })}
                            </Paper>
                        }
                        </div>
                    </Button>
                ))
            })}
        </Paper>
    </div>
  )
}
