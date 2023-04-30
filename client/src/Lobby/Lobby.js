import React from 'react'
import './Lobby.scss'
function Lobby() {
    return (
        <div className='Lobby'>
                <div className='opacityLobby'>
                <div className='containerLobby'>
                    <div className='containerPlayersLobby'/>
                    <div className='containerBtnLobby'>
                        <button className='startGameBtn'>Start Game</button>
                    </div>
                </div>
                <div className='logOut'>
                    <label className='logOutLabel'>LogOut</label>
                </div>
                <div className='backBtn'>
                    <label className='backLabel'>Back</label>
                </div>
               
            </div>
        </div>
        
    )
}

export default Lobby