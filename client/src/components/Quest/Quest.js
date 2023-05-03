import React, { useEffect } from 'react'
import './Quest.scss'
import Gold from '../Gold/Gold';


const TYPE_GOLD_MEDIUM = 'MEDIUM';

function Quest({quest,progress, goldReward , setgoldAttuale}) {
    
    useEffect(()=>{
        if(progress === quest.request){
            setgoldAttuale((n)=>(n + goldReward));
        }
    },[progress]);

    return (
        <div className={`containerQuest ${progress === quest.request ? 'questDone' : ''}`}>
            {/* <div className= "titleQuest" >Quest</div> */}
            <div className= 'progressBarEmpty'>
                <div className= 'progressBarFill' style={{width : `${progress*(100/quest.request)}%`}}/>
            </div>
            <div className= 'questText'>{`You need ${quest.attribute} for complete the quest: ${progress}/${quest.request}`}</div>
            <div className='goldContainerQuest'>
                <Gold active={progress === quest.request} size={TYPE_GOLD_MEDIUM} value={goldReward}/>
            </div>
            
        </div>
    )
}

export default Quest