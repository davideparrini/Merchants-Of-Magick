import React, { useEffect, useRef, useState } from 'react'
import './ButtonTurn.scss'
import ToastNotication from '../ToastNotification/ToastNotication';
function ButtonTurnDone({finishTurn,turnDone, nDiceLeft_toUse, gameRestart}) {
    
    //Ref al area dello finishTurnBtn, Close on out-click
    let finishTurnRef = useRef();

    //bool openFinishTurn
    const [openFinishTurnAlert,setOpenFinishTurnAlert] = useState(false);

    const [btnStateDone, setBtnStateDone] = useState(false);



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

    //useEffect di reset dopo la fine del turno
    //Riporto il botton riclickabile
    useEffect(()=>{
        if(gameRestart){
            setBtnStateDone(false);
        }
    },[gameRestart]);

    useEffect(()=>{
        if(turnDone ){
            setBtnStateDone(true);
        }
    },[turnDone]);

    return (
        <>
            <button className={`btn-turn ${btnStateDone ? 'turn-done' : ''}`} 
                onClick={()=>{ 
                if(nDiceLeft_toUse > 0){
                    setOpenFinishTurnAlert(true);
                }else{
                    setBtnStateDone(true);
                    finishTurn();
                }
                
            }
            }>{!btnStateDone ? "Finish Turn" : "Waiting for others players..." }</button>
            <div ref={finishTurnRef}>
                <ToastNotication 
                    question={ 'Are you sure to finish your turn? You have more dice to play!'}
                    positiveRespose={'Yes'}
                    negativeRespose={'No'}
                    handlerPositiveRespose={()=>{ 
                        setBtnStateDone(true);
                        finishTurn();
                    }}
                    handlerNegativeRespose={()=>{}}
                    openState={openFinishTurnAlert}
                    setOpenState={setOpenFinishTurnAlert}
                />
            </div>
        </>
        )
}

    export default ButtonTurnDone