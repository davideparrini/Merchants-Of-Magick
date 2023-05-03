import React, { useState } from 'react'
import './BoardPlayers.scss'
import Card from '../Card/Card';

function BoardPlayers({listPlayers}) {

    const[index,setIndex] = useState(0);
    const[playerShowed,setPlayerShowed] = useState(listPlayers[0]);
    
    

    function onClickShiftRight(){
        if(index === (listPlayers.length-1) ){
            setPlayerShowed(listPlayers[0]);
            setIndex(0);
        }
        else{
            setPlayerShowed(listPlayers[index+1]);
            setIndex((i)=>(i+1));
        }
    }

    function onClickShiftLeft(){
        if(index === 0){
            setPlayerShowed(listPlayers[listPlayers.length-1]);
            setIndex(listPlayers.length-1);
        }
        else{
            setPlayerShowed(listPlayers[index-1]);
            setIndex((i)=>(i-1));
        }
    }
    
    return (
        <div className='board-players'>
            <div className='nav-bar'>
                <div className='arrow shift-left' onClick={onClickShiftLeft}/>
                <div className='name-player'>{playerShowed.name + " (" + (index+1)+"/"+ listPlayers.length +")"}</div>
                <div className='arrow shift-right' onClick={onClickShiftRight}/>
            </div>
             <button className='find-next-card' onClick={()=>{setIndex(0); setPlayerShowed(listPlayers[0])}}>NC</button>
            <div className='container-cards-BP'>
                <div className='container-card1-BP'>
                    <div className={`${index === 0 ? 'next-card visible' : 'next-card no-visible'}`}>NEXT CARD</div>
                    <Card isShowed={playerShowed.card1.inProgress} order={playerShowed.card1} smallSize={true}/>
                </div>
                <Card isShowed={playerShowed.card2.inProgress} order={playerShowed.card2} smallSize={true}/>
                <Card isShowed={playerShowed.card3.inProgress} order={playerShowed.card3} smallSize={true}/>
            </div>
            
        </div>
    )
}

export default BoardPlayers