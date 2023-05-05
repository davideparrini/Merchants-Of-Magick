import React, { useEffect, useState } from 'react'
import './Exit.scss'

const LOGGED_STATE = 'LOGGED';


function Exit({setPage}) {

    const[exitWindowOpen, setExitWindowOpen] = useState(false);
    const[remainingTime,setRemainingTime] = useState(0);

    useEffect(() => {
        if(remainingTime > 0){
            const intervalId = setInterval(() => {
                setRemainingTime((t)=> t-1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
        else{
            setRemainingTime(0);

        }
    },[remainingTime]);

    return (
        <>            
            <div className='exit-btn' onClick={()=>{setExitWindowOpen(true); setRemainingTime(5)}}>
                <label className='exit-label'>Exit</label>
            </div>
            <div className={exitWindowOpen ? 'black-bg': 'no-showed-window'}>
                <div className='exit-window'>Are you sure to leave the game?
                    <div className='btn-exit-container'>
                        <button className={remainingTime > 0 ? 'btn-exit wait-leave-btn' :'btn-exit leave-btn' } onClick={()=>setPage(LOGGED_STATE)} >{remainingTime > 0 ? remainingTime : 'Leave'}</button>
                        <button className='btn-exit cancel-btn' onClick={()=>setExitWindowOpen(false)}>No</button>
                    </div>      
                </div>
            </div>
        </>
    )
}

export default Exit