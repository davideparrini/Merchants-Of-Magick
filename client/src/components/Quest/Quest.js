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
        <div className={`container-quest ${progress === quest.request ? 'quest-done' : ''}`}>
            {/* <div className= "titleQuest" >Quest</div> */}
            <div className= 'progress-bar-empty'>
                <div className= 'progress-bar-fill' style={{width : `${progress*(100/quest.request)}%`}}/>
            </div>
            <div className= 'quest-text'>{`You need ${quest.attribute} for complete the quest: ${progress}/${quest.request}`}</div>
            <div className='gold-container-quest'>
                <Gold active={progress === quest.request} size={TYPE_GOLD_MEDIUM} value={goldReward}/>
            </div>
            
        </div>
    )
}

export default Quest