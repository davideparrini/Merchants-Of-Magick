import React, { useEffect, useState } from 'react'
import './Timer.css'

function Timer({countdown,finishTurn, turnDone}) {

    const [remainingTime, setRemainingTime] = useState(countdown);
    const [clockWork,setClockWork] = useState(true);


    useEffect(() => {
        if(remainingTime > 0 && !turnDone){
            const intervalId = setInterval(() => {
                setRemainingTime((t)=> t-1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
        else{
            setRemainingTime(0);
            setClockWork(false);
            if(!turnDone) finishTurn(turnDone);
        }
    },[remainingTime,clockWork,turnDone]);


    return (
        <div className={`timer ${clockWork ? 'working' : 'no-working'}`}>{remainingTime}</div>
    )
}

export default Timer