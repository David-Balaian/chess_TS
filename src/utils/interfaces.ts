export type squareColor = string

export type BoardSquare = {
    color: squareColor,
    figureImg?: string,
    figureName?: 'Pawn' | 'Rook' | 'Horse' | 'Bishop' | 'King' | 'Queen',
    figureColor?: 'white' | 'black',
    isFirstMove?: boolean
}
export type Board = BoardSquare[][]

export type ActiveCell = { data: BoardSquare | null, i: number | null , j: number | null, steps?: object[] }
