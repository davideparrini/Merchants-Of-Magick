import React, { useContext } from 'react'
import { AppContext } from '../../App';
import './BackBtn.css'

function BackBtn({pageToBack, actionToDo, message, alert}) {

    const {navigate} = useContext(AppContext);

    return (
        <div className='back-btn' 
            onClick={()=>{
                if(alert){
                    if(window.confirm(message)){
                        navigate(pageToBack);
                        actionToDo();           
                    }
                }
                else{
                    navigate(pageToBack);
                    actionToDo();     
                }
               
            }}><label className='back-label'>Back</label>
        </div>
    )
}

export default BackBtn