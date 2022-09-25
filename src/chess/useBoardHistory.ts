import{ useState, useEffect} from 'react'
import { Board } from '../utils/interfaces'

export const useBoardHistory = () => {
    const [boardHistory, setBoardHistory] = useState<Board[]>([])

    return [boardHistory, setBoardHistory] as const
}