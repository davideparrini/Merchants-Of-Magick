import React, { useEffect, useState } from 'react'
import './Timer.css'

function Timer({countdown}) {

    const [remainingTime, setRemainingTime] = useState(countdown);
    const [clockWork,setClockWork] = useState(true);
    
    

    useEffect(() => {
        if(remainingTime > 0){
            const intervalId = setInterval(() => {
                setRemainingTime((t)=> t-1);
            }, 1000);
            //setClockWork(()=>true);
            //DA SISTEMAREEEEEEE
        return () => clearInterval(intervalId);
        }
    },[remainingTime,clockWork]);


  return (
    <div className={`timer ${clockWork ? 'working' : 'noWorking'}`}>{remainingTime}</div>
  )
}

export default Timer