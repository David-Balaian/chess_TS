import{ useState, useEffect} from 'react'
import { usePrevious } from '../helpers/customHooks'
import { ActiveCell, Board, BoardSquare } from "../utils/interfaces"
import palette from "../utils/palette"
import { directions, getInitialSquareColor, moves } from './helpers'
import _ from 'lodash'


export const useHandlers = (board: Board, setBoard: (board: Board) => void, boardHistory: Board[], setBoardHistory: (board: Board[]) => void) => {

    const [isCheck, setIsCheck] = useState<{color: 'white' | 'black', kingCoords: {i:number, j: number}, isCheck: boolean, checkDirection: {i:number, j: number}[]}>()
    const [activeCell, setActiveCell] = useState<ActiveCell>({data: null, i: null , j: null})
    const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white')
    const [checkmate, setCheckmate] = useState<'white' | 'black'>()
    const [chooseFigure, setChooseFigure] = useState<{i: number, j: number, color: 'white' | 'black'} | undefined>(undefined)

    const prevActiveCell = usePrevious<ActiveCell>(activeCell)

    const getRivalColor = (playerColor: 'white' | 'black'): 'white' | 'black' | undefined => {
        if(!playerColor) return undefined
        return playerColor === 'white' ? 'black' : 'white'
    }

    const handleChooseFigure = (square: BoardSquare, i: number, j: number, board: Board) => {
        let boardCopy = _.cloneDeep(board)
        boardCopy[i][j] = {...boardCopy[i][j], ...square};
        setBoard(boardCopy)
        setChooseFigure(undefined)
        setBoardHistory([...boardHistory, boardCopy])
        setActiveCell({data:null, i:null, j:null})
        if(currentPlayer){
            setCurrentPlayer(currentPlayer)
            let checkObj = getIsCheck(boardCopy, currentPlayer)
            setIsCheck(checkObj)
        }
    }


    const handleBoxClick = (data: BoardSquare | null, i: number | null , j: number | null, board: Board) => {
        if(data && data.color === palette.green && (i !== activeCell.i || j !== activeCell.j)){
            if(typeof(i) === 'number' && typeof(j) === 'number'){
                const newBoard = handleMove(board, activeCell, i, j)
                if(prevActiveCell && prevActiveCell.data && prevActiveCell.data.figureName === 'Pawn' && (i === 0 || i === 7)){
                    setChooseFigure({i, j, color: currentPlayer})
                }
                if(newBoard && newBoard.length){
                    const nextPlayer = getRivalColor(currentPlayer)
                    setBoard(newBoard)
                    setBoardHistory([...boardHistory, newBoard])

                    setActiveCell({data:null, i:null, j:null})
                    if(nextPlayer){
                        setCurrentPlayer(nextPlayer)
                        let checkObj = getIsCheck(newBoard, nextPlayer)
                        setIsCheck(checkObj)
                    }
                }
            }
        }else{
            if(data && data.figureColor === currentPlayer)
            setActiveCell({data, i, j})
        }
    }

    const isCheckMate = (board: Board, checkDirection: {i:number, j:number}[], player: 'white' | 'black') => {
        let kingPos = locateKing(board, player)
        let kingMoves = getFigureMoves({data: board[kingPos.i][kingPos.j], i: kingPos.i, j: kingPos.j}, board)
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if(board[i][j].figureName){
                    let coords = getFigureMoves({data: board[i][j], i, j}, board)
                    if(coords.length){
                        const availableCoords: {i:number, j: number}[] = [];
    
                        [...checkDirection, ...coords, ...kingMoves].forEach((o, i, arr) =>  {
                            let eq = arr.find((e, ind) => {
                                if (i > ind) {
                                return _.isEqual(e, o);
                                }
                            })
                            if (eq) {
                                availableCoords.push(o)
                            } 
                        })
                        if(availableCoords.length){
                            return
                        }
                    }
                }
                
            }
        }
        setCheckmate(getRivalColor(player))
    }

    const locateKing = (board: Board, color: 'white' | 'black' | undefined): {i:number, j:number} => {
        const result = {i: -1, j: -1}
        board.forEach((row, i)=>{
            row.forEach((cell, j)=>{
                if(cell.figureName === 'King' && cell.figureColor === color){
                    result.i = i
                    result.j = j
                }
            })
        })
        return result
    }

    const getIsCheck = (board: Board, currentPlayer: 'white' | 'black', kingPos?: {i: number, j: number}) => {
        const kingCoords = kingPos || locateKing(board, currentPlayer)
        let {i, j} = kingCoords;
        let checkObj;
        Object.entries(directions).forEach(([key, value])=>{
            const {steps, blockers, attackWhite, attackBlack} = value

            const figureAttacingCoords = (attackWhite || attackBlack) ? currentPlayer === 'white' ? attackBlack : attackWhite : steps
            let found = false
            for(let k=0; k<figureAttacingCoords.length; k++){
                let checkDirection = []
                for(let h=0; h<figureAttacingCoords[k].length; h++){
                    if(!figureAttacingCoords[k][h].i && !figureAttacingCoords[k][h].j) continue;
                    let x = i + figureAttacingCoords[k][h].i
                    let y = j + figureAttacingCoords[k][h].j
                    if(key === 'Pawn'){
                        x = i - figureAttacingCoords[k][h].i
                        y = j + figureAttacingCoords[k][h].j
                    }
                    if(!board[x] || !board[x][y]) continue;
                    checkDirection.push({i: x, j: y})
                    if(key === 'Queen'){
                        const indexToCompare = figureAttacingCoords[k][h - 1] ? h - 1 : h + 1
                        if(figureAttacingCoords[k][h].i === figureAttacingCoords[k][indexToCompare].i || figureAttacingCoords[k][h].j === figureAttacingCoords[k][indexToCompare].j){
                            blockers.push('Bishop')
                        }else if(figureAttacingCoords[k][h].i !== figureAttacingCoords[k][indexToCompare].i || figureAttacingCoords[k][h].j !== figureAttacingCoords[k][indexToCompare].j){
                            blockers.push('Rook')
                        }
                    }
                    if(board[x] && board[x][y] && (board[x][y].figureColor === currentPlayer || (blockers && blockers.includes(board[x][y].figureName || '') && board[x][y].figureColor === getRivalColor(currentPlayer)))){
                        checkDirection = []
                        break;
                    }
                    if(board[x] && board[x][y] && board[x][y].figureName === key){
                        checkObj = {color: currentPlayer, kingCoords, isCheck: true, checkDirection}
                        found = true
                        break
                    }
                }  
                if(found) break;
            }
        })
            return checkObj
    }

    const handleCastle = (boardCopy: Board, activeCell: ActiveCell, i: number, j: number) => {
        if(typeof(activeCell.i) === 'number' && typeof(activeCell.j) === 'number'){
            if(j > activeCell.j){
                boardCopy[i][j-1] = { ...boardCopy[i][j-1], ...boardCopy[activeCell.i][activeCell.j + 4] , color: getInitialSquareColor(i, j-1), isFirstMove: false}
                boardCopy[activeCell.i][activeCell.j + 4]  = {color: getInitialSquareColor(activeCell.i, activeCell.j + 4)}
            }else{
                boardCopy[i][j+1] = { ...boardCopy[i][j+1], ...boardCopy[activeCell.i][activeCell.j - 3], color: getInitialSquareColor(i, j+1), isFirstMove: false}
                boardCopy[activeCell.i][activeCell.j - 3]  = {color: getInitialSquareColor(activeCell.i, activeCell.j - 3)}
            }
            boardCopy[i][j] = { ...boardCopy[i][j], ...activeCell.data, color: getInitialSquareColor(i, j), isFirstMove: false}
            boardCopy[activeCell.i][activeCell.j] = {color: getInitialSquareColor(activeCell.i, activeCell.j)}
        }
        return boardCopy
    }

    const handleTakeInitialPawn = (boardCopy: Board, activeCell: ActiveCell, i: number, j: number) => {
        if(!activeCell.data) return boardCopy
        let delta = activeCell.data.figureColor === 'white' ? 1 : -1
        boardCopy[i + delta][j] = {color: getInitialSquareColor(i + delta, j)}
        return boardCopy
    }

    const handleMove = (board: Board, activeCell: ActiveCell, i: number, j: number) => {
        let boardCopy = _.cloneDeep(board)
        if(typeof(activeCell.i) === 'number' && typeof(activeCell.j) === 'number'){
            if(activeCell.data && activeCell.data.figureName === 'King' && activeCell.data.isFirstMove && (j === activeCell.j + 2 || j === activeCell.j - 2)){
                boardCopy = handleCastle(boardCopy, activeCell, i, j)
            }
            if(
                activeCell.data &&
                activeCell.data.figureName === 'Pawn' && 
                (j === activeCell.j + 1 || j === activeCell.j - 1) &&
                (!board[i][j].figureName) &&
                board[activeCell.i][activeCell.j-1] && board[activeCell.i][activeCell.j-1].figureColor !== activeCell.data.figureColor &&
                ((board[activeCell.i][activeCell.j-1] && board[activeCell.i][activeCell.j-1].figureName === 'Pawn') || 
                (board[activeCell.i][activeCell.j+1] && board[activeCell.i][activeCell.j+1].figureName === 'Pawn'))
            ){
                boardCopy = handleTakeInitialPawn(boardCopy, activeCell, i, j)
            }

            boardCopy[i][j] = { ...boardCopy[i][j], ...activeCell.data, color: getInitialSquareColor(i, j), isFirstMove: false}
            boardCopy[activeCell.i][activeCell.j] = {color: getInitialSquareColor(activeCell.i, activeCell.j)}

            let steps = getFigureMoves(activeCell, board)
            steps.forEach((item: any)=>{
                boardCopy = highlightCell(item.i, item.j, getInitialSquareColor(item.i, item.j), boardCopy)
            })

            return boardCopy;
        }
    }


    const checkForRivalFigure = (color: string, i: number, j: number, board: Board): boolean => {
        return board[i][j].figureColor !== color
    }

    const checkForPlayerFigure = (color: string, i: number, j: number, board: Board): boolean => {
        return  board[i][j].figureColor === color
    }

    const checkForFigure = (i: number, j: number, board: Board): boolean => {
        return  !!board[i][j].figureColor
    }

    const getFigureMoves = (activeCell: ActiveCell, board: Board): {i:number, j:number}[] => {
        let coords: {i:number, j:number}[] = []
        if(!activeCell || !activeCell.data) return []
        const { figureColor, figureName } = activeCell.data 
        if(!figureColor || !figureName) return []
                const figureSteps = moves[`${figureColor}${figureName}`]
                const steps = figureSteps.steps
                let isBreaked = false;
               
                if(typeof(activeCell.i)==='number' && typeof(activeCell.j)==='number' ){
                    for(let h = 0; h<steps.length; h++){
                        for(let k=0; k<steps[h].length; k++){
                            if(!steps[h][k].i && !steps[h][k].j) continue
                            const i = activeCell.i + steps[h][k].i
                            const j = activeCell.j + steps[h][k].j
                            if((!board[i] || !board[i][j])) continue;
                            
                            if(checkForFigure(i, j, board)){
                                if(checkForRivalFigure(figureColor, i, j, board)){
                                    !figureSteps.attack && coords.push({i, j})
                                    isBreaked = true
                                    break;
                                }else if(checkForPlayerFigure(figureColor, i, j, board)) {
                                    isBreaked = true
                                    break
                                };
                                
                            }else{
                                
                                coords.push({i, j})
                            }
                        }
                    }
                    if(activeCell && activeCell.data && activeCell.data.isFirstMove && !isBreaked && figureSteps.initial){
                        for(let k=0; k<figureSteps.initial.length; k++){
                            const i = activeCell.i + figureSteps.initial[k].i
                            const j = activeCell.j + figureSteps.initial[k].j
                            if(board[i] && board[i][j] && !checkForFigure(i, j, board)){
                                coords.push({i, j})
                            } else {break};
                        }  
                    }
                    if(figureSteps.attack){
                        for(let k=0; k<figureSteps.attack.length; k++){
                            const i = activeCell.i + figureSteps.attack[k].i
                            const j = activeCell.j + figureSteps.attack[k].j
                            if(board[i] && board[i][j] && checkForFigure(i, j, board) && checkForRivalFigure(figureColor, i, j, board))
                            coords.push({i, j})
                        }  
                    }
                }

                if(
                    activeCell.i !== null && 
                    activeCell.j !== null && 
                    activeCell.data && 
                    activeCell.data.figureName === 'Pawn' && 
                    activeCell.data.figureColor && 
                    boardHistory && 
                    boardHistory[boardHistory.length - 2] 
                ){
                    let lookingPawnCoords: {i: number, j: number}[] = [{i: activeCell.i, j: activeCell.j-1}, {i: activeCell.i, j: activeCell.j+1}]
                    
                    let deltaIForPrevBoard = activeCell.data.figureColor === 'white' ? -2 : 2
                    let deltaIForPrevCoord = activeCell.data.figureColor === 'white' ? -1 : 1
                    for(let k = 0; k < lookingPawnCoords.length; k++){
                        const prevFigure = boardHistory[boardHistory.length - 2][lookingPawnCoords[k].i + deltaIForPrevBoard] && boardHistory[boardHistory.length - 2][lookingPawnCoords[k].i + deltaIForPrevBoard][lookingPawnCoords[k].j]
                        if(
                            board[lookingPawnCoords[k].i][lookingPawnCoords[k].j] &&
                            board[lookingPawnCoords[k].i][lookingPawnCoords[k].j].figureName === 'Pawn' && 
                            board[lookingPawnCoords[k].i][lookingPawnCoords[k].j].figureColor !== activeCell.data.figureColor && 
                            prevFigure &&
                            prevFigure.figureName === 'Pawn' &&
                            prevFigure.figureColor === getRivalColor(activeCell.data.figureColor)
                        ){
                            coords.push({i: activeCell.i + deltaIForPrevCoord, j: lookingPawnCoords[k].j})
                        }
                    }
                }

                if(activeCell.data && activeCell.data.figureName === 'King'){
                    const coordsUnderCheck: {i:number, j: number}[] = []
                    coords.forEach(kingPos=>{
                    if(activeCell.data && activeCell.data.figureColor){
                        let checkObj: any = getIsCheck(board, activeCell.data.figureColor, kingPos)
                        let kingCoords = checkObj && checkObj.kingCoords 
                        if(kingCoords)
                        coordsUnderCheck.push(kingCoords)
                    }
                    })
                    const kingAvailableCoords: {i:number, j: number}[] = [];

                    [...coordsUnderCheck, ...coords].forEach((o, i, arr) =>  {
                        let index = arr.findIndex((e, ind) => {
                          if (i < ind) {
                            if(_.isEqual(e, o)){
                            return _.isEqual(e, o)}
                          }
                        })
                        if (index === -1) {
                            kingAvailableCoords.push(o)
                        } else{
                            arr.splice(index, 1)
                        }
                      })

                      if(activeCell.data.isFirstMove && activeCell.data.figureColor && typeof(activeCell.i) === 'number' && typeof(activeCell.j) === 'number'){
                          let castleCoords = getCastleMoves(board, activeCell.data.figureColor, activeCell.i, activeCell.j)
                          kingAvailableCoords.push(...castleCoords)
                      }
                    return kingAvailableCoords
                }

                if(isCheck && isCheck.isCheck){
                    let { checkDirection } = isCheck;
                    let blockingCoords: {i: number, j: number}[] = [];
                    
                    [...checkDirection, ...coords].forEach((o, i, arr) =>  {
                        let eq = arr.find((e, ind) => {
                          if (i > ind) {
                            return _.isEqual(e, o);
                          }
                        })
                        if (eq) {
                            blockingCoords.push(o)
                        } 
                      })

                      return blockingCoords
                }
                if(activeCell.data.figureColor && activeCell.i && activeCell.j){
                    const check: any = getIsCheck(board, activeCell.data.figureColor, {i: activeCell.i, j: activeCell.j})
                    if(check){
                        let boardItem = board[check.checkDirection[0].i][check.checkDirection[0].j]
                        let deltaI = activeCell.i - check.checkDirection[0].i
                        let deltaJ = activeCell.j - check.checkDirection[0].j
                            let k = 1;
                            while (boardItem && `${boardItem.figureColor}${boardItem.figureName}` !== `${activeCell.data.figureColor}King`) {
                                boardItem = board[check.checkDirection[0].i + (deltaI * k)] && board[check.checkDirection[0].i+(deltaI * k)][check.checkDirection[0].j + (deltaJ * k)]
                                k++;
                                if(boardItem && boardItem.figureColor && `${boardItem.figureColor}${boardItem.figureName}` !== `${activeCell.data.figureColor}${activeCell.data.figureName}`){
                                    break;
                                }
                            }
                        if(boardItem && boardItem.figureName === 'King'){
                            const availableCoords: {i:number, j: number}[] = [];
    
                            [...check.checkDirection, ...coords].forEach((o, i, arr) =>  {
                                let eq = arr.find((e, ind) => {
                                  if (i > ind) {
                                    return _.isEqual(e, o);
                                  }
                                })
                                if (eq) {
                                    availableCoords.push(o)
                                } 
                              })
                            return availableCoords
                        }
                    }
                }
        return coords
    }

    const highlightCell = (i: number, j: number, color: string, board: Board | undefined): Board => {
        if(!board) return []
            const boardCopy = _.cloneDeep(board)
            boardCopy[i][j].color = color
            return boardCopy;
    }

    const getCastleMoves = (board: Board, kingColor: 'white' | 'black', kingI: number, kingJ: number): {i:number, j: number}[] => {
        const steps = [
            [{i: kingI, j: kingJ-1}, {i: kingI, j: kingJ-2}],
            [{i: kingI, j: kingJ+1}, {i: kingI, j: kingJ+2}, {i: kingI, j: kingJ+3}],
        ]
        const reqs: boolean[][] = [[],[]]
        for(let h = 0; h<steps.length; h++){
            for(let k=0; k<steps[h].length; k++){
                const {i, j} = steps[h][k];
                const isFigure = checkForFigure(i, j, board)
                const isCheck = getIsCheck(board, kingColor, {i, j}) 
                reqs[h].push(!isFigure && !isCheck)
            }
        }
        let result: {i:number, j: number}[] = []
        reqs.forEach((req, i)=>{
            const rook = i === 0 ? board[kingI][kingJ-3] : board[kingI][kingJ+4]
            if(req.every(item=>item) && rook.isFirstMove){
                result.push(steps[i][1])
            }
        })
        return result

    }
    

    useEffect(()=>{
        let newBoard = board;
        if(prevActiveCell && typeof(prevActiveCell.i) === 'number' && typeof(prevActiveCell.j) === 'number'){
            newBoard = highlightCell(prevActiveCell.i, prevActiveCell.j, getInitialSquareColor(prevActiveCell.i, prevActiveCell.j), newBoard)
            if(prevActiveCell.data && prevActiveCell.data.figureName){
                let steps = getFigureMoves(prevActiveCell, newBoard)
                steps.forEach((item: any)=>{
                    newBoard = highlightCell(item.i, item.j, getInitialSquareColor(item.i, item.j), newBoard)
                })
            }
        }
        
        if(typeof(activeCell.i) === 'number' && typeof(activeCell.j) === 'number' && activeCell.data && activeCell.data.figureName){
            newBoard = highlightCell(activeCell.i, activeCell.j, palette.green, newBoard)
            let steps = getFigureMoves(activeCell, newBoard)
            steps.forEach((item: any)=>{
                newBoard = highlightCell(item.i, item.j, palette.green, newBoard)
            })
            
        }
        !_.isEqual(newBoard, board) && newBoard.length && setBoard(newBoard)
            
    }, [activeCell, prevActiveCell])

    useEffect(()=>{
        if(isCheck && isCheck.isCheck){
            const boardH = highlightCell(isCheck.kingCoords.i, isCheck.kingCoords.j, palette.red, board)
            setBoard(boardH)
            isCheckMate(board, isCheck.checkDirection, currentPlayer)
        }else{
            const {i, j} = locateKing(board, getRivalColor(currentPlayer))
            if(i>-1 && j >-1){
                const boardH = highlightCell(i, j, getInitialSquareColor(i, j), board)
                setBoard(boardH)
            }
        }
    }, [isCheck])


    return { handleBoxClick, checkmate, chooseFigure, handleChooseFigure } as const
}