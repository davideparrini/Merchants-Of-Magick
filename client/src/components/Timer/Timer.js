import React, { useEffect, useState } from 'react'
import './Timer.css'



function Timer({finishTurn, turnDone, gameRestart, timerCountdown}) {

    //durata di un turno
    const [countdown,setCountdown] = useState(timerCountdown);
    const [clockWork,setClockWork] = useState(true);

    useEffect(()=>{
        if(gameRestart){
            setCountdown(timerCountdown);
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