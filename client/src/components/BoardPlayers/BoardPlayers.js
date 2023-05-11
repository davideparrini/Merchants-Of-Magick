import React, { useCallback, useState } from 'react'
import './BoardPlayers.scss'
import Card from '../Card/Card';

function BoardPlayers({players}) {

    const[index,setIndex] = useState(0);
    const[playerShowed,setPlayerShowed] = useState(players[0]);
    
    

    const onClickShiftRight = useCallback(()=>{
        if(index === (players.length-1) ){
            setPlayerShowed(players[0]);
            setIndex(0);
        }
        else{
            setPlayerShowed(players[index+1]);
            setIndex((i)=>(i+1));
        }
    },[index, players])

    const onClickShiftLeft = useCallback(()=>{
        if(index === 0){
            setPlayerShowed(players[players.length-1]);
            setIndex(players.length-1);
        }
        else{
            setPlayerShowed(players[index-1]);
            setIndex((i)=>(i-1));
        }
    },[index, players])
    
    return (
        <div className='board-players'>
            <div className='nav-bar'>
                <div className='arrow shift-left' onClick={onClickShiftLeft}/>
                <div className='name-player'>{playerShowed.username + " (" + (index+1)+"/"+ players.length +")"}</div>
                <div className='arrow shift-right' onClick={onClickShiftRight}/>
            </div>
             <button className='find-next-card' onClick={()=>{setIndex(0); setPlayerShowed(players[0])}}>NC</button>
            <div className='container-cards-BP'>
                <div className='container-card1-BP'>
                    <div className={`${index === 0 ? 'next-card visible' : 'next-card no-visible'}`}>NEXT CARD</div>
                    <Card isShowed={playerShowed.cards.card1.inProgress} card={playerShowed.cards.card1} smallSize={true}/>
                </div>
                <Card isShowed={playerShowed.cards.card2.inProgress} card={playerShowed.cards.card2} smallSize={true}/>
                <Card isShowed={playerShowed.cards.card3.inProgress} card={playerShowed.cards.card3} smallSize={true}/>
            </div>
            
        </div>
    )
}

export default BoardPlayers