import React, { useEffect, useRef, useState } from 'react'
import './ButtonTurn.scss'
function ButtonTurnDone({finishTurn,isTurnDone, nDiceLeft_toUse, gameRestart}) {
    
    //Ref al area dello finishTurnBtn, Close on out-click
    let finishTurnRef = useRef();

    //bool openFinishTurn
    const [openFinishTurnAlert,setOpenFinishTurnAlert] = useState(false);

    const [turnDone, setTurnDone] = useState(false);



    //Close on clickout useEffect
    useEffect(()=>{
        let handlerFinishTurn = (e)=>{
            if(!finishTurnRef.current.contains(e.target)){
                setOpenFinishTurnAlert(false);
            }   
        };
        document.addEventListener("mousedown", handlerFinishTurn);

        return() =>{
            document.removeEventListener("mousedown", handlerFinishTurn);
          }
    });

    useEffect(()=>{
        if(gameRestart){
            setTurnDone(false);
        }
    },[gameRestart]);

    useEffect(()=>{
        if(isTurnDone){
            setTurnDone(true);
        }
    },[isTurnDone]);

    return (
        <>
            <button className={`btn-turn ${turnDone ? 'turn-done' : ''}`} 
                onClick={()=>{ 
                if(nDiceLeft_toUse > 0){
                    setOpenFinishTurnAlert(true);
                }else{
                    setTurnDone(true);
                    finishTurn(turnDone);
                }
                
            }
            }>{!turnDone ? "Finish Turn" : "Waiting for others players..." }</button>
            <div className={`container-finish-turn-alert ${openFinishTurnAlert? 'active-finish-turn-alert' : 'inactive-finish-turn-alert'}`} ref={finishTurnRef}>
                <div className='message-finish-turn-alert'>Are you sure to finish your turn? <br/>You have more dice to play!</div>
                <div className='container-btn-finish-turn-alert'>
                    <button className='btn-finish-turn-alert yes-btn' onClick={()=>{
                        setTurnDone(true);
                        finishTurn(turnDone);
                        setOpenFinishTurnAlert(false);
                    }}>Yes</button>
                    <button className='btn-finish-turn-alert no-btn'onClick={()=>{
                        setOpenFinishTurnAlert(false);
                    }}>No</button>
                </div>
                
            </div>
        </>
        )
}

    export default ButtonTurnDone