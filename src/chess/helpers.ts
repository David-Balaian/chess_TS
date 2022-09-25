import { squareColor } from '../utils/interfaces';
import palette from '../utils/palette';

export const getInitialSquareColor = (i: number, j: number): squareColor => {
    if(i % 2===0){
        if(j % 2 === 0) return palette.brown
        return palette.white;
    } else {
        if(j % 2 === 0) return palette.white
        return palette.brown;
    }
}

interface StepsShape { 
    steps: {i: number, j: number, rotateI?: number, rotateJ?: number}[][], 
    attack?: {i: number, j: number}[], 
    attackWhite?: {i: number, j: number}[][], 
    attackBlack?: {i: number, j: number}[][], 
    initial?: {i: number, j: number}[], 
    blockers?: ('Pawn' | 'Rook' | 'Horse' | 'Bishop' | 'King')[] 
}

interface Moves {
    whitePawn: StepsShape,
    whiteRook: StepsShape,
    whiteHorse: StepsShape,
    whiteBishop: StepsShape,
    whiteKing: StepsShape,
    whiteQueen: StepsShape,

    blackPawn: StepsShape,
    blackRook: StepsShape,
    blackHorse: StepsShape,
    blackBishop: StepsShape,
    blackKing: StepsShape,
    blackQueen: StepsShape,
}

export let moves: Moves = {
    whitePawn: {steps: [[{i: -1, j: 0}]], attackWhite: [[{i: -1, j: -1}], [{i: -1, j: 1}]], attack: [{i: -1, j: -1}, {i: -1, j: 1}], initial: [{i: -2, j: 0}] },
    whiteRook: { 
        steps: [
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j + i})),
        ] 
    },
    whiteHorse: { 
        steps:[ 
            [ {i: -1, j: -2} ],
            [ {i: 1, j: -2} ],
            [ {i: -1, j: 2} ],
            [ {i: 1, j: 2} ],
            [ {i: -2, j: -1} ],
            [ {i: -2, j: 1} ],
            [ {i: 2, j: -1} ],
            [ {i: 2, j: 1} ]
        ]
     },
    whiteBishop: { 
        steps: [
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j - i})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j + i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j + i})),
        ] ,
    },
    whiteKing: { 
        steps: [ 
            [{i: -1, j: -1}],
            [{i: -1, j: 0}],
            [{i: -1, j: 1}],
            [{i: 0, j: -1, rotateJ: -2}],
            [{i: 0, j: 0}],
            [{i: 0, j: 1, rotateJ: 2}],
            [{i: 1, j: -1}],
            [{i: 1, j: 0}],
            [{i: 1, j: 1}],
        ] 
    },
    whiteQueen: { 
        steps: [
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j - i})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j + i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j + i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j + i})),
        ] ,
     },

    blackPawn: {steps: [[{i: 1, j: 0}]], attackBlack: [[{i: 1, j: -1}], [{i: 1, j: 1}]], attack: [{i: 1, j: -1}, {i: 1, j: 1}], initial: [{i: 2, j: 0}] },
    blackRook: { 
        steps: [
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j + i})),
        ] 
    },
    blackHorse: { 
        steps:[ 
            [ {i: -1, j: -2} ],
            [ {i: 1, j: -2} ],
            [ {i: -1, j: 2} ],
            [ {i: 1, j: 2} ],
            [ {i: -2, j: -1} ],
            [ {i: -2, j: 1} ],
            [ {i: 2, j: -1} ],
            [ {i: 2, j: 1} ],
        ],
        initial: [{i: 0, j: 3}, {i: 0, j: -2}] 
    },
    blackBishop: { 
        steps: [
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j - i})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j + i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j + i})),
        ] ,
    },
    blackKing: { 
        steps:[ 
            [{i: -1, j: -1}],
            [{i: -1, j: 0}],
            [{i: -1, j: 1}],
            [{i: 0, j: -1, rotateJ: -2}],
            [{i: 0, j: 0}],
            [{i: 0, j: 1, rotateJ: 2}],
            [{i: 1, j: -1}],
            [{i: 1, j: 0}],
            [{i: 1, j: 1}],
            [{i: 0, j: 0, rotateI: 0, rotateJ: 3}, {i: 0, j: 0, rotateI: 0, rotateJ: -2}]
        ] 
    },
    blackQueen: { 
        steps: [
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j - i})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j + i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j + i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j + i})),
        ] ,
     },
}

interface Directions {
    Pawn: StepsShape,
    Rook: StepsShape,
    Horse: StepsShape,
    Bishop: StepsShape,
    King: StepsShape,
    Queen: StepsShape,
}


export let directions: Directions = {
    Pawn: {steps: [[{i: -1, j: 0}]], attackWhite: [[{i: -1, j: -1}], [{i: -1, j: 1}]], attackBlack: [[{i: 1, j: -1}], [{i: 1, j: 1}]], initial: [{i: -2, j: 0}] },
    Rook: { 
        steps: [
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j + i})),
        ],
        blockers: ['Horse', 'Bishop', 'Pawn', 'King']
    },
    Horse: { 
        steps:[ 
            [ {i: -1, j: -2} ],
            [ {i: 1, j: -2} ],
            [ {i: -1, j: 2} ],
            [ {i: 1, j: 2} ],
            [ {i: -2, j: -1} ],
            [ {i: -2, j: 1} ],
            [ {i: 2, j: -1} ],
            [ {i: 2, j: 1} ]
        ]
     },
    Bishop: { 
        steps: [
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j - i})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j + i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j + i})),
        ] ,
        blockers: ['Horse', 'Rook', 'Pawn', 'King']
    },
    King: { 
        steps: [ 
            [{i: -1, j: -1}],
            [{i: -1, j: 0}],
            [{i: -1, j: 1}],
            [{i: 0, j: -1}],
            [{i: 0, j: 0}],
            [{i: 0, j: 1}],
            [{i: 1, j: -1}],
            [{i: 1, j: 0}],
            [{i: 1, j: 1}],
        ] 
    },
    Queen: { 
        steps: [
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j - i})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j + i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j + i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i - i, j: item.j})), 
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i + i, j: item.j})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j - i})),
            new Array(8).fill({i: 0, j: 0}).map((item, i) => ({i: item.i, j: item.j + i})),
        ] ,
        blockers: ['Horse', 'Pawn', 'King']
     },
}