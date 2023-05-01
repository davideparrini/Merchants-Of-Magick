import React, { useEffect } from 'react'
import './Quest.scss'

function Quest({quest,progress, goldReward , setgoldAttuale}) {
    
    useEffect(()=>{
        if(progress === quest.request){
            setgoldAttuale((n)=>(n + goldReward));
        }
    },[progress]);

    return (
        <div className='containerQuest'>
            {/* <div className= "titleQuest" >Quest</div> */}
            <div className= 'progressBarEmpty'>
                <div className= 'progressBarFill' style={{width : `${progress*(100/quest.request)}%`}}/>
            </div>
            <div className= 'questText'>{`You need ${quest.attribute} for complete the quest: ${progress}/${quest.request}`}</div>
            <div className={`goldQuest ${progress < quest.request ? 'no-doneQuest':'doneQuest'}`}>{goldReward}</div>
            
        </div>
    )
}

export default Quest