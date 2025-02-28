
// src/hooks/useGameTurn.js
import { useState } from 'react';

export function useGameTurn(initialTurn, totalTurns) {
    const [turn, setTurn] = useState(initialTurn);
    const [turnDone, setTurnDone] = useState(false);
    
    const nextTurn = () => {
        if (turn < totalTurns) {
            setTurn(turn + 1);
            setTurnDone(false);
        }
    };

    return { turn, turnDone, setTurnDone, nextTurn };
}