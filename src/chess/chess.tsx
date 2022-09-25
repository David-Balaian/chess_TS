import { Paper, Button } from '@mui/material'
import React from 'react'
import styles from './chess.module.css'
import { useHandlers } from './useHandlers'
import { useInitializeBoard } from './useInitializeBoard'
import { useBoardHistory } from './useBoardHistory'
import figuresImg from './images'
export default function Chess() {

    const [board, setBoard] = useInitializeBoard()

    const [boardHistory, setBoardHistory] = useBoardHistory()

    const {handleBoxClick, checkmate, chooseFigure, handleChooseFigure} = useHandlers(board, setBoard, boardHistory, setBoardHistory)

    const figures = (figureColor: 'white' | 'black') => ([
        {figureImg: figuresImg[`${figureColor}Rook`], figureName: 'Rook', figureColor},
        {figureImg: figuresImg[`${figureColor}Horse`], figureName: 'Horse', figureColor},
        {figureImg: figuresImg[`${figureColor}Bishop`], figureName: 'Bishop', figureColor},
        {figureImg: figuresImg[`${figureColor}Queen`], figureName: 'Queen', figureColor}
    ])
    const style = chooseFigure && chooseFigure.color === 'white' ? { top: 0 } : { bottom: 0 };
  return (
    <div className={styles.main}>
            {checkmate && `${checkmate} wins`}
        <Paper classes={{root: styles.board}} >
            {Array.isArray(board) && board.map((row: any, i: number)=>{
                return row.map((square: any, j: number)=>(
                    <Button key={`${i}_${j}`} onClick={()=>(handleBoxClick(square, i, j, board))} classes={{root: styles.square}}>
                        <div className={styles.square} style={{backgroundColor: square.color}}> 
                        {/* <span style={{position: 'absolute', bottom: '-5px',}} >{`${i}_${j}`}</span> */}
                        <img width={'90%'} src={square.figureImg} />
                        {chooseFigure && chooseFigure.i === i && chooseFigure.j === j && 
                            <Paper classes={{root: styles.figures}} sx={{...style, zIndex: 100}} >
                                {figures(chooseFigure.color).map((square: any)=>{
                                    
                                    return <div key={`${i}_${j}_${square.figureName}`} onClick={(e)=>{e.preventDefault(); e.stopPropagation(); handleChooseFigure(square, i, j, board)}} className={styles.squareWithoutBorder}>
                                        <div className={styles.square} style={{backgroundColor: square.color}}> 
                                        
                                        <img width={'90%'} src={square.figureImg} />
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
