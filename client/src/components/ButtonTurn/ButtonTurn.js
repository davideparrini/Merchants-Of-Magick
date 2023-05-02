import React, { useEffect, useRef, useState } from 'react'
import './ButtonTurn.scss'
function ButtonTurnDone({finishTurn,isTurnDone, nDiceLeft_toUse}) {
    
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
                finishTurn(turnDone);
            }
            
        }
        }>{!turnDone ? "Finish Turn" : "Waiting for others players..." }</button>
        <div className={`containerFinishTurnAlert ${openFinishTurnAlert? 'activeFinishTurnAlert' : 'inactiveFinishTurnAlert'}`} ref={finishTurnRef}>
            <div className='messageFinishTurnAlert'>Are you sure to finish your turn? <br/>You have more dice to play!</div>
            <div className='containerBtnFinishTurnAlert'>
                <button className='btnFinishTurnAlert yesBtn' onClick={()=>{
                    setTurnDone(true);
                    finishTurn(turnDone);
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