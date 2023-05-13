import React,{ useCallback, useEffect, useState } from 'react'
import './ExtraDice.scss'

function ExtraDice({
    nPotion_extraDice, 
    nPotion, 
    setNPotion, 
    nDiceLeft_Used, 
    setNDiceLeft_toUse, 
    totalPossibleDice_toUse, 
    setTotalPossibleDice_toUse, 
    extraDiceUsedTempList, 
    setExtraDiceUsedTempList, 
    definitelyExtraDiceUsed, 
    typeExtraDice,
    gameRestart}) {
    
     
    const [usedTemporarily,setUsedTemporarily] = useState(false);
    const [isPlayble,setIsPlayble] = useState(true);

    const choose_className = useCallback(()=>{
        if(definitelyExtraDiceUsed){
            return 'no-active';
        }
        else{
            if(!isPlayble) return 'no-clickable';

            if(usedTemporarily) return 'going-no-active';
        }
        return '';
    },[definitelyExtraDiceUsed, isPlayble, usedTemporarily]);

    //useEffect di reset dopo la fine del turno
    //Nel caso in cui avevo un extra dice in sospeso, resetto l'extradice ridando le pozioni usate 
    useEffect(()=>{
        if(gameRestart){
            if(usedTemporarily){
                setUsedTemporarily(false);
                setIsPlayble(true);
                setNPotion((n)=>(n+nPotion_extraDice));
            }
        }
    },[gameRestart]);


    return (
        <div className={ 'e-dice ' + choose_className()} 
            onClick={()=>{

                 //se l extra-dice è usato definitivamente non puoi fare niente
                if(!definitelyExtraDiceUsed ){

                    //se l extra-dice non è stato usato (in modo temporaneo) (quindi è utilizzabile/"buono")
                    if(!usedTemporarily){

                        //controllo che si possano usare massimo 2 extra-dice per turno, in caso lo setto setIsPlayeble a false per far diventare gl'extra dice non usati Unclickable
                        if(extraDiceUsedTempList.length >= 2) {
                            setIsPlayble(false);
                            return;
                        }
                        // se i req delle pozioni e incremento i dice disponibili, 
                        // i dice che al massimo usero in quel turno (non sono la stessa cosa, dice disponibili vengono decrementati quando uso un dado, i totalPossibleDice_toUse no )
                        //quindi faccio una serie di incrementi e decrementi per implementare la logica del gioco e metto a true lo stato del diceUsedTemporarily
                        if(nPotion >= nPotion_extraDice){ 
                            setNPotion((n)=>(n - nPotion_extraDice));
                            setNDiceLeft_toUse((n)=>(n+1));
                            setExtraDiceUsedTempList((l)=>[...l,typeExtraDice]);
                            setTotalPossibleDice_toUse((n)=>(n+1));
                            setUsedTemporarily(true);
                        } 
                    }
                    else{
                        //questo controllo evita di avere valori negativi su DiceLeft_toUse

                        if(totalPossibleDice_toUse - nDiceLeft_Used >= 0){
                            setNPotion((n)=>(n + nPotion_extraDice));
                            setNDiceLeft_toUse((n)=>(n-1));
                            setExtraDiceUsedTempList((l)=>l.filter(function(value, index, array){
                                return value !== typeExtraDice;
                            }));
                            setTotalPossibleDice_toUse((n)=>(n-1));
                            setUsedTemporarily(false);
                            setIsPlayble(true);
                        } 
                    }
                }
            }}><div className={nPotion_extraDice === 0 ? '' : 'extra-dice-potion'}>{nPotion_extraDice === 0 ? '' : nPotion_extraDice}</div>
        </div>
    )
}

export default ExtraDice