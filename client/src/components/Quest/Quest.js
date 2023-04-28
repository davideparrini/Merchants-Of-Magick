import React, { useEffect } from 'react'
import './Quest.scss'

function Quest({quest,progress, setgoldAttuale}) {
    
    useEffect(()=>{
        if(progress === quest.request){
            setgoldAttuale((n)=>(n + quest.gold));
        }
    },[progress]);

    return (
        <div className='containerQuest'>
            {/* <div className= "titleQuest" >Quest</div> */}
            <div className= 'progressBarEmpty'>
                <div className= 'progressBarFill' style={{width : `${progress*(100/quest.request)}%`}}/>
            </div>
            <div className= 'questText'>{`You need ${quest.attribute} for complete the quest: ${progress}/${quest.request}`}</div>
            <div className={`goldQuest ${progress < quest.request ? 'no-doneQuest':'doneQuest'}`}>{quest.gold}</div>
            
        </div>
    )
}

export default Quest