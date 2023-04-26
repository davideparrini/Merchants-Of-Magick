import React,{ useState } from 'react'
import './ExtraDice.scss'

function ExtraDice({nPotion_extraDice, onClickHandlerExtraDice, definitelyExtraDiceUsed,typeExtraDice}) {
    
     
    const [usedTemporarily,setUsedTemporarily] = useState(false);
    const [isPlayble,setIsPlayble] = useState(true);

    function choose_className(){
        if(definitelyExtraDiceUsed){
            return 'no-active';
        }
        else{
            if(!isPlayble) return 'no-clickable';

            if(usedTemporarily) return 'going-no-active';
        }
        return '';
    }

    return (
        <div className={ 'e-dice ' + choose_className()} 
            onClick={()=>{
                if(!definitelyExtraDiceUsed ){
                    onClickHandlerExtraDice(nPotion_extraDice,usedTemporarily, definitelyExtraDiceUsed,setUsedTemporarily ,setIsPlayble,typeExtraDice)
                }
            }}><div className={nPotion_extraDice == 0 ? '' : 'extra-dice-potion'}>{nPotion_extraDice == 0 ? '' : nPotion_extraDice}</div>
        </div>
    )
}

export default ExtraDice