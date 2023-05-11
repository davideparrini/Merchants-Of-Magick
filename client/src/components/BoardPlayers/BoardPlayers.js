import React, { useCallback, useContext, useEffect, useState } from 'react'
import './BoardPlayers.scss'
import Card from '../Card/Card';
import { AppContext } from '../../App';

function BoardPlayers({boardListPlayers,boardChanged, setBoardChanged}) {

    const[index,setIndex] = useState(0);
    const[playerShowed,setPlayerShowed] = useState(boardListPlayers[0]);
    const {gameUpdated} = useContext(AppContext);

   
    useEffect(()=>{
        if(boardChanged){
            setIndex(0);
            setPlayerShowed(boardListPlayers[0]);
            setBoardChanged(false);
        }
    },[boardChanged, gameUpdated]);

    const onClickShiftRight = useCallback(()=>{
        if(index === (boardListPlayers.length-1) ){
            setPlayerShowed(boardListPlayers[0]);
            setIndex(0);
        }
        else{
            setPlayerShowed(boardListPlayers[index+1]);
            setIndex((i)=>(i+1));
        }
    },[index, boardListPlayers])

    const onClickShiftLeft = useCallback(()=>{
        if(index === 0){
            setPlayerShowed(boardListPlayers[boardListPlayers.length-1]);
            setIndex(boardListPlayers.length-1);
        }
        else{
            setPlayerShowed(boardListPlayers[index-1]);
            setIndex((i)=>(i-1));
        }
    },[index, boardListPlayers])
    
    return (
        <div className='board-players'>
            <div className='nav-bar'>
                <div className='arrow shift-left' onClick={onClickShiftLeft}/>
                <div className='name-player'>{playerShowed.username + " (" + (index+1)+"/"+ boardListPlayers.length +")"}</div>
                <div className='arrow shift-right' onClick={onClickShiftRight}/>
            </div>
             <button className='find-next-card' onClick={()=>{setIndex(0); setPlayerShowed(boardListPlayers[0])}}>NC</button>
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