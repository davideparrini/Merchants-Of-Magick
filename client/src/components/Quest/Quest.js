import React, { useEffect } from 'react'
import './Quest.scss'
import Gold from '../Gold/Gold';


const TYPE_GOLD_MEDIUM = 'MEDIUM';

function Quest({questAttribute, questRequest, progress, goldReward , setgoldAttuale}) {
    
    useEffect(()=>{
        if(progress === questRequest){
            setgoldAttuale((n)=>(n + goldReward));
        }
    },[progress,goldReward]);

    return (
        <div className={`container-quest ${progress === questRequest ? 'quest-done' : ''}`}>
            {/* <div className= "titleQuest" >Quest</div> */}
            <div className= 'progress-bar-empty'>
                <div className= 'progress-bar-fill' style={{width : `${progress*(100/questRequest)}%`}}/>
            </div>
            <div className= 'quest-text'>{`You need ${questAttribute} for complete the quest: ${progress}/${questRequest}`}</div>
            <div className='gold-container-quest'>
                <Gold active={progress === questRequest} size={TYPE_GOLD_MEDIUM} value={goldReward}/>
            </div>
            
        </div>
    )
}

export default Quest