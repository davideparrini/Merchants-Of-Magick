import React from 'react'
import './Quest.scss'

function Quest({quest,progress}) {

    return (
        <div className='containerQuest'>
            {/* <div className= "titleQuest" >Quest</div> */}
            <div className= 'progressBarEmpty'>
                <div className= 'progressBarFill' style={{width : `${progress*12.5}%`}}></div>
            </div>
            <div className= 'questText'>{`You need ${quest.attribute} for complete the quest: ${progress}/${quest.request}`}</div>
            <div className='goldQuest'>{quest.gold}</div>
            
        </div>
    )
}

export default Quest