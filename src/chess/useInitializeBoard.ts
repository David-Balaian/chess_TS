import { useState, useEffect, useCallback, useRef } from 'react'
import { Board, BoardSquare, squareColor } from '../utils/interfaces'
import { getInitialSquareColor } from './helpers'
import figures from './images'

export const useInitializeBoard = () => {
    const [board, setBoard] = useState<Board>(new Array(8).fill(new Array(8).fill({})))
    
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
        let figureColor: 'white' | 'black' = i < 3 ? 'black' : 'white'
        if(i === 1) square = {figureImg: figures[`blackPawn`], figureName: 'Pawn', figureColor: 'black'}
        if(i === 6) square = {figureImg: figures[`whitePawn`], figureName: 'Pawn', figureColor: 'white'}
        if(i === 0 || i === 7){
            if(j === 0 || j === 7) square = {figureImg: figures[`${figureColor}Rook`], figureName: 'Rook', figureColor}
            if(j === 1 || j === 6) square = {figureImg: figures[`${figureColor}Horse`], figureName: 'Horse', figureColor}
            if(j === 2 || j === 5) square = {figureImg: figures[`${figureColor}Bishop`], figureName: 'Bishop', figureColor}
            if(j === 3) square = {figureImg: figures[`${figureColor}King`], figureName: 'King', figureColor}
            if(j === 4) square = {figureImg: figures[`${figureColor}Queen`], figureName: 'Queen', figureColor}
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