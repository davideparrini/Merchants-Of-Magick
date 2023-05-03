import React from 'react'
import './Lobby.scss'
import { authConfig,auth } from '../Config/authConfig';
import Gold from '../components/Gold/Gold';

const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const GAME_STATE = 'GAME';


function Lobby({setPage}) {

    

    return (
        <div className='Lobby'>
            <div className='opacityLobby'>
                <div className='containerLobby'>
                    <div className='containerPlayersLobby'>
                        
                        </div>
                    <div className='containerBtnLobby'>
                        <button className='startGameBtn'
                            onClick={()=>{
                                setPage(GAME_STATE);
                            }}
                        >Start Game</button>
                    </div>
                </div>
                <div className='logOut' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to Log Out?')){
                            authConfig.logout();
                            setPage(LOGIN_STATE);  
                        }
                    }}>
                    <label className='logOutLabel'>LogOut</label>
                </div>
                <div className='backBtn' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to leave the lobby?')){
                            setPage(LOGGED_STATE);
                        }
                    }}><label className='backLabel'>Back</label>
                </div>
            </div>  
            <div className='usernameLog'>Logged as:{auth.currentUser.displayName}</div>
        </div>
        
    )
}

export default Lobby