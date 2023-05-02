import React, { useEffect } from 'react'
import './Lobby.scss'
import { authConfig } from '../Config/authConfig';

const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const GAME_STATE = 'GAME';


function Lobby({setUserState}) {

    

    return (
        <div className='Lobby'>
                <div className='opacityLobby'>
                <div className='containerLobby'>
                    <div className='containerPlayersLobby'/>
                    <div className='containerBtnLobby'>
                        <button className='startGameBtn'
                            onClick={()=>{
                                setUserState(GAME_STATE);
                            }}
                        >Start Game</button>
                    </div>
                </div>
                <div className='logOut' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to Log Out?')){
                            authConfig.logout();
                            setUserState(LOGIN_STATE);  
                        }
                    }}>
                    <label className='logOutLabel'>LogOut</label>
                </div>
                <div className='backBtn' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to leave the lobby?')){
                            setUserState(LOGGED_STATE);
                        }
                    }}><label className='backLabel'>Back</label>
                </div>
               
            </div>
        </div>
        
    )
}

export default Lobby