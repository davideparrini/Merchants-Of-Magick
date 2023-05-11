import React, { useEffect, useState } from 'react'
import './Timer.css'

function Timer({countdown,finishTurn, turnDone}) {

    const [remainingTime, setRemainingTime] = useState(countdown);
    const [clockWork,setClockWork] = useState(true);


    useEffect(() => {
        if(!turnDone){
            if(remainingTime > 0 ){
                const intervalId = setInterval(() => {
                    setRemainingTime((t)=> t-1);
                }, 1000);
                return () => clearInterval(intervalId);
            }
            else{
                
                if(!turnDone) finishTurn(turnDone);
            }
        }else{
            setRemainingTime(0);
            setClockWork(false);
        }
        
    },[remainingTime,clockWork,turnDone,finishTurn]);


    return (
        <div className={`timer ${clockWork ? 'working' : 'no-working'}`}>{remainingTime}</div>
    )
}

export default Timer