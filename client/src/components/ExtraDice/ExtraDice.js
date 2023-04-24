import React,{ useState } from 'react'
import './ExtraDice.scss'

function ExtraDice({nPotion_extraDice, onClickHandlerExtraDice, definitelyExtraDiceUsed}) {
    
    const [extraDiceUsedTemporaly,setExtraDiceUsedTemporaly] = useState(false);

    function choose_className(){
        if(definitelyExtraDiceUsed){
            return 'no-active';
        }
        else{
            if(extraDiceUsedTemporaly){
                return 'going-no-active';
            }
        }
        return '';
    }

    return (
        <div className={ 'e-dice ' + choose_className()} 
            onClick={()=>{
                if(!definitelyExtraDiceUsed){
                    onClickHandlerExtraDice(nPotion_extraDice,extraDiceUsedTemporaly)
                    setExtraDiceUsedTemporaly(!extraDiceUsedTemporaly);
                }
            }}><div className={nPotion_extraDice == 0 ? '' : 'extra-dice-potion'}>{nPotion_extraDice == 0 ? '' : nPotion_extraDice}</div>
        </div>
    )
}

export default ExtraDice