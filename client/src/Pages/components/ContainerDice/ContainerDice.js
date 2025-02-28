import React, { useCallback } from 'react'
import d6img from './d6.png'
import d8img from './d8.png'
import d10img from './d10.png'
import d12img from './d12.png'
import './ContainerDice.scss'
import { DICE } from '../../../Config/constants'


function ContainerDice({typeTouchedDiceRef, valueTouchedDiceRef, nPotion, setnPotion, dice, onClickImgHandler, nActions}) {

    
    const chooseImg = useCallback(()=>{
        switch(dice.type){
			case DICE.d6: return d6img;
			case DICE.d8: return d8img;
			case DICE.d10: return d10img;
			case DICE.d12: return d12img;
            default: return;
		}
	},[dice])

	const incDice = useCallback(()=>{
        if(nPotion >0 && dice.value < 12 && nActions > 0 && !dice.isUsed){
            setnPotion(nPotion+((dice.value+1) > dice.startValue ? -1 : 1));
            dice.setValue(prev => 1+prev);
            if(dice.type === typeTouchedDiceRef.current){
                valueTouchedDiceRef.current++;
            }
        }
        else{
            if(nPotion ===0 && dice.value < 12 && nActions > 0 && !dice.isUsed && (dice.value < dice.startValue)){
                setnPotion(nPotion+1);
                dice.setValue(prev => 1+prev);
                if(dice.type === typeTouchedDiceRef.current){
                    valueTouchedDiceRef.current++;
                }
            }
        }      
	},[nPotion, dice, nActions])
    
    const decDice = useCallback(()=>{
        if(nPotion >0 && dice.value > 1 && nActions > 0 && !dice.isUsed){
            setnPotion(nPotion+((dice.value-1) < dice.startValue ? -1 : 1));
            dice.setValue(prev => prev-1);
            if(dice.type === typeTouchedDiceRef.current){
                valueTouchedDiceRef.current--;
            }
        }
        else{
            if(nPotion ===0 && dice.value > 1 && nActions > 0 && !dice.isUsed && (dice.value > dice.startValue) ){
                setnPotion(prev => prev+1);
                dice.setValue(prev => prev-1);
                if(dice.type === typeTouchedDiceRef.current){
                    valueTouchedDiceRef.current--;
                }
            }
        }
	},[nPotion, dice, nActions]);

    return (
        <div className={`dice-contenitor`}>
            <img src={chooseImg()} alt={dice.type} className={`dice-img ${dice.isUsed ? 'no-active' : ''} ${dice.isTouched && !dice.isUsed ? 'touched-dice' : ''}`} onClick={nActions > 0 ? onClickImgHandler : ()=>{return;}} ></img>
            <div className='dice-rolled'>{dice.value}</div>
            <button className='inc-btn' onClick={incDice}></button>
            <button className='dec-btn' onClick={decDice}></button>
        </div>
    )
}

export default ContainerDice