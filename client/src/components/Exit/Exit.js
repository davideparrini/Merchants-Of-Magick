import React, { useEffect, useState } from 'react'
import './Exit.scss'

const LOGGED_STATE = 'LOGGED';


function Exit({setUserState}) {

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
        <div >              
            <div className='exitBtn' onClick={()=>{setExitWindowOpen(true); setRemainingTime(5)}}>
                <label className='exitLabel'>Exit</label>
            </div>
            <div className={exitWindowOpen ? 'blackBg': 'noShowedWindow'}>
                <div className='exitWindow'>Are you sure to leave the game?
                    <div className='btnExitContainer'>
                        <button className={remainingTime > 0 ? 'btnExit waitLeaveBtn' :'btnExit leaveBtn' } onClick={()=>setUserState(LOGGED_STATE)} >{remainingTime > 0 ? remainingTime : 'Leave'}</button>
                        <button className='btnExit cancelBtn' onClick={()=>setExitWindowOpen(false)}>No</button>
                    </div>      
                </div>
            </div>
        </div>
    )
}

export default Exit