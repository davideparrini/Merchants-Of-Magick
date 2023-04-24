import React from 'react'
import { useEffect, useRef, useState } from 'react';
import d6img from './d6.png'
import d8img from './d8.png'
import d10img from './d10.png'
import d12img from './d12.png'
import './Container_dice_diceValue.scss'

function Container_dice_diceValue({typeDice,nPotion,setnPotion,startTurnDiceValue, diceValue ,setDiceValue, usedDice ,diceTouched, onClickImgHandler, nActions}) {

    //Tipi dado
    const TYPE_D6 = 'd6';
    const TYPE_D8 = 'd8';
    const TYPE_D10 = 'd10';
    const TYPE_D12 = 'd12';

    function chooseImg(){
        switch(typeDice){
			case TYPE_D6: return d6img;
			case TYPE_D8: return d8img;
			case TYPE_D10: return d10img;
			case TYPE_D12: return d12img;
		}
	}

	function incDice(){
        if(nPotion >0 && diceValue < 12 && nActions > 0){
            setnPotion(nPotion+((diceValue+1) > startTurnDiceValue ? -1 : 1));
            setDiceValue(1+diceValue);
        }
            
	}
    
    function decDice(){
        if(nPotion >0 && diceValue > 1 && nActions > 0){
            setnPotion(nPotion+((diceValue-1) < startTurnDiceValue ? -1 : 1));
            setDiceValue(diceValue-1);
        }
	}
    function emptyfun(){}

    return (
        <div className={`diceContenitor`}>
            <img src={chooseImg()} alt={typeDice} className={`diceImg ${usedDice ? 'no-active' : ''} ${diceTouched && !usedDice ? 'touched-dice' : ''}`}onClick={nActions > 0 ? onClickImgHandler : emptyfun} ></img>
            <div className='diceRolled'>{diceValue}</div>
            <button className='incBtn' onClick={incDice}></button>
            <button className='decBtn' onClick={decDice}></button>
        </div>
    )
}

export default Container_dice_diceValue