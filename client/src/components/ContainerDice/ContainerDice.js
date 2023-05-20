import React, { useCallback } from 'react'
import d6img from './d6.webp'
import d8img from './d8.webp'
import d10img from './d10.webp'
import d12img from './d12.webp'
import './ContainerDice.scss'

//Tipi dado
const TYPE_D6 = 'd6';
const TYPE_D8 = 'd8';
const TYPE_D10 = 'd10';
const TYPE_D12 = 'd12';

function ContainerDice({typeDice,nPotion,setnPotion,startTurnDiceValue, diceValue ,setDiceValue, usedDice ,diceTouched, onClickImgHandler, nActions}) {

    
    const chooseImg = useCallback(()=>{
        switch(typeDice){
			case TYPE_D6: return d6img;
			case TYPE_D8: return d8img;
			case TYPE_D10: return d10img;
			case TYPE_D12: return d12img;
            default: return;
		}
	},[typeDice])

	const incDice = useCallback(()=>{
        if(nPotion >0 && diceValue < 12 && nActions > 0 && !usedDice){
            setnPotion(nPotion+((diceValue+1) > startTurnDiceValue ? -1 : 1));
            setDiceValue(1+diceValue);
        }
        else{
            if(nPotion ===0 && diceValue < 12 && nActions > 0 && !usedDice && (diceValue < startTurnDiceValue)){
                setnPotion(nPotion+1);
                setDiceValue(1+diceValue);
            }
        }      
	},[nPotion, diceValue, nActions, usedDice, startTurnDiceValue])
    
    const decDice = useCallback(()=>{
        if(nPotion >0 && diceValue > 1 && nActions > 0 && !usedDice){
            setnPotion(nPotion+((diceValue-1) < startTurnDiceValue ? -1 : 1));
            setDiceValue(diceValue-1);
        }
        else{
            if(nPotion ===0 && diceValue > 1 && nActions > 0 && !usedDice && (diceValue > startTurnDiceValue) ){
                setnPotion(nPotion+1);
                setDiceValue(diceValue-1);
            }
        }
	},[nPotion, diceValue, nActions, usedDice, startTurnDiceValue]);

    return (
        <div className={`dice-contenitor`}>
            <img src={chooseImg()} alt={typeDice} className={`dice-img ${usedDice ? 'no-active' : ''} ${diceTouched && !usedDice ? 'touched-dice' : ''}`}onClick={nActions > 0 ? onClickImgHandler : ()=>{return;}} ></img>
            <div className='dice-rolled'>{diceValue}</div>
            <button className='inc-btn' onClick={incDice}></button>
            <button className='dec-btn' onClick={decDice}></button>
        </div>
    )
}

export default ContainerDice