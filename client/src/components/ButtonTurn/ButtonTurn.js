import React, { useState } from 'react'
import './ButtonTurn.scss'
function ButtonTurnDone({finishTurn}) {


    const [turnDone, setTurnDone] = useState(false);


    return (
        <div className={`btnTurn ${turnDone ? 'turnDone' : 'turnNotDone'}`} 
        onClick={()=>{ 
            setTurnDone(true);
            finishTurn();
        }
        }>{!turnDone ? "Finish Turn" : "Waiting for others players..." }</div>
    )
}

    export default ButtonTurnDone