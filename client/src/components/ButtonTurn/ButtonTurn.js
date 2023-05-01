import React, { useEffect, useState } from 'react'
import './ButtonTurn.scss'
function ButtonTurnDone({finishTurn,isTurnDone, nDiceLeft_toUse,openFinishTurnAlert,setOpenFinishTurnAlert, refFinishturn}) {


    const [turnDone, setTurnDone] = useState(false);

    useEffect(()=>{
        if(isTurnDone){
            setTurnDone(true);
        }
    },[isTurnDone]);

    return (
        <div className='ButtonTurn'>
            <button className={`btnTurn ${turnDone ? 'turnDone' : ''}`} 
        onClick={()=>{ 
            if(nDiceLeft_toUse > 0){
                setOpenFinishTurnAlert(true);
            }else{
                setTurnDone(true);
                finishTurn();
            }
            
        }
        }>{!turnDone ? "Finish Turn" : "Waiting for others players..." }</button>
        <div className={`containerFinishTurnAlert ${openFinishTurnAlert? 'activeFinishTurnAlert' : 'inactiveFinishTurnAlert'}`} ref={refFinishturn}>
            <div className='messageFinishTurnAlert'>Are you sure to finish your turn? <br/>You have more dice to play!</div>
            <div className='containerBtnFinishTurnAlert'>
                <button className='btnFinishTurnAlert yesBtn' onClick={()=>{
                    setTurnDone(true);
                    finishTurn();
                    setOpenFinishTurnAlert(false);
                }}>Yes</button>
                <button className='btnFinishTurnAlert noBtn'onClick={()=>{
                    setOpenFinishTurnAlert(false);
                }}>No</button>
            </div>
            
        </div>
        </div>
        )
}

    export default ButtonTurnDone