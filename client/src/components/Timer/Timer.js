import React, { useEffect, useState } from 'react'
import './Timer.css'

const TIMER_COUNTDOWN = 300;

function Timer({finishTurn, turnDone, gameRestart}) {

    //durata di un turno
    const [countdown,setCountdown] = useState(TIMER_COUNTDOWN);
    const [clockWork,setClockWork] = useState(true);

    useEffect(()=>{
        if(gameRestart){
            setCountdown(TIMER_COUNTDOWN);
            setClockWork(true);
        }
    },[gameRestart]);

    useEffect(() => {
        if(!gameRestart){
            if(!turnDone){
                if(countdown > 0 ){
                    const intervalId = setInterval(() => {
                        setCountdown((t)=> t-1);
                    }, 1000);
                    return () => clearInterval(intervalId);
                }
                else{
                    finishTurn()
                }
            }else{
                setCountdown(0);
                setClockWork(false);
            }
        }
        
        
    },[countdown,clockWork,turnDone,finishTurn,gameRestart]);


    return (
        <div className={`timer ${clockWork ? 'working' : 'no-working'}`}>{countdown}</div>
    )
}

export default Timer