import { useState, useEffect, useCallback, useRef } from 'react'
import { Board, BoardSquare, squareColor } from '../utils/interfaces'
import palette from '../utils/palette'
import { getInitialSquareColor } from './helpers'

export const useInitializeBoard = () => {
    const [board, setBoard] = useState<Board>(new Array(8).fill(new Array(8).fill({})))
    // const [isInit, setIsInit] = useState(false)
    // const boardRef = useRef<Board>(new Array(8).fill(new Array(8).fill({})))
    // const board = boardRef.current
    // const setBoard = (value: Board) => {boardRef.current = value; setIsInit(!isInit)};
    
    const getInitialPositions = useCallback((chessBoard: Board): Board => {
        const initBoard = chessBoard.map((row, i) => {
            return row.map((cell, j) => {
                return getInitialFigureByPosition(i, j)
            })
        });
        return initBoard
    }, [])

    const getInitialFigureByPosition = useCallback((i: number, j: number): BoardSquare => {
        let square: any = {}
        let figureColor = i < 3 ? 'black' : 'white'
        if(i === 1) square = {figureImg: 'Pawn_Black.png', figureName: 'Pawn', figureColor: 'black'}
        if(i === 6) square = {figureImg: 'Pawn_White.png', figureName: 'Pawn', figureColor: 'white'}
        if(i === 0 || i === 7){
            if(j === 0 || j === 7) square = {figureImg: `Rook_${figureColor}.png`, figureName: 'Rook', figureColor}
            if(j === 1 || j === 6) square = {figureImg: `Horse_${figureColor}.png`, figureName: 'Horse', figureColor}
            if(j === 2 || j === 5) square = {figureImg: `Bishop_${figureColor}.png`, figureName: 'Bishop', figureColor}
            if(j === 3) square = {figureImg: `King_${figureColor}.png`, figureName: 'King', figureColor}
            if(j === 4) square = {figureImg: `Queen_${figureColor}.png`, figureName: 'Queen', figureColor}
        }
        square.color = getInitialSquareColor(i, j)
        square.isFirstMove = true
        return square
    }, [])

  

    useEffect(()=>{
        const initBoard = getInitialPositions(board)
        setBoard(initBoard)
    }, [])

    return [board, setBoard] as const
}