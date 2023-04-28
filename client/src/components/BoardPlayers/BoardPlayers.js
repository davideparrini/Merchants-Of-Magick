import React from 'react'
import Player_ofTable from './Player_ofTable'

function BoardPlayers() {
    return (
        <div>
            <div className='navBar'>
                <div className='namePlayer'></div>
                <button className='shiftRight'></button>
                <button className='shiftLeft'></button>
                <button className='findCard'></button>
            </div>
            <Player_ofTable></Player_ofTable>
        </div>
    )
}

export default BoardPlayers