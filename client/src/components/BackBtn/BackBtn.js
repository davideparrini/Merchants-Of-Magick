import React, { useContext } from 'react'
import { AppContext } from '../../App';

function BackBtn({pageToBack, actionToDo}) {

    const {navigate} = useContext(AppContext);

    return (
        <div className='back-btn' 
            onClick={()=>{
                if(window.confirm('Are you sure to leave the lobby?')){
                    navigate(pageToBack);
                    actionToDo();           
                }
            }}><label className='back-label'>Back</label>
        </div>
    )
}

export default BackBtn