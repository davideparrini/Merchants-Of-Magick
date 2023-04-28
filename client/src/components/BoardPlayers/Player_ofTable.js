import React from 'react'
import Card from '../Card/Card'

    function Player_ofTable({name,listCard, isYourNext}) {
        return (
            <div>
                
                <div className='containerCard_playerTable'><Card></Card></div>
                <div className='containerCard_playerTable'><Card></Card></div>
                <div className='containerCard_playerTable'><Card></Card></div>
            </div>
        )
    }

export default Player_ofTable