import React, { useCallback, useEffect, useState } from 'react'
import './BoardCards.scss'
import Card from '../Card/Card';

const card1={
    item: 'scroll',
    gold: 5,
    enchantment: 'fiery',
    origin:'of the dragons',
    inProgress: true
}

const card2={
    item: 'ring',
    gold: 5,
    enchantment: 'everlasting',
    origin:'of the dragons',
    inProgress: true
}
const card3={
    item: 'sword',
    gold: 5,
    enchantment: 'shocking',
    origin:'of the dragons',
    inProgress: true
}
const boardCards = [card1,card2,card3];

function BoardCards({ gameRestart}) {

    const[index,setIndex] = useState(0);
    const[cardShowed,setCardShowed] = useState(boardCards[0]);
    

   
    useEffect(()=>{
        if(gameRestart){
            setIndex(0);
            setCardShowed(boardCards[0]);
        }
    },[gameRestart, boardCards]);

    const onClickShiftRight = useCallback(()=>{
        if(index === (boardCards.length-1) ){
            setCardShowed(boardCards[0]);
            setIndex(0);
        }
        else{
            setCardShowed(boardCards[index+1]);
            setIndex((i)=>(i+1));
        }
    },[index, boardCards])

    const onClickShiftLeft = useCallback(()=>{
        if(index === 0){
            setCardShowed(boardCards[boardCards.length-1]);
            setIndex(boardCards.length-1);
        }
        else{
            setCardShowed(boardCards[index-1]);
            setIndex((i)=>(i-1));
        }
    },[index, boardCards])
    
    return (
        <div className='board-cards'>
            <div className='index-cards-bc'>{"(" + (index+1)+"/"+ boardCards.length +")"}</div>
            <button className='find-next-card-bc' onClick={()=>{setIndex(0); setCardShowed(boardCards[0])}}>NC</button>
            <div className='arrow-bc shift-left' onClick={onClickShiftLeft}/>
            <div className='container-next-card-BC'>
                <div className={`${index === 0 ? 'next-card-bc visible' : 'next-card-bc no-visible'}`}>NEXT CARD</div>
                <Card isShowed={cardShowed.inProgress} card={cardShowed} smallSize={true}/>
            </div>
            <div className='arrow-bc shift-right' onClick={onClickShiftRight}/>
            
            
        </div>
    )
}

export default BoardCards