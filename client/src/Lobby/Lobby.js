import React from 'react'
import './Lobby.scss'
import { authConfig,auth } from '../Config/authConfig';
import Gold from '../components/Gold/Gold';

const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const GAME_STATE = 'GAME';


function Lobby({setPage, username}) {

    return (
        <div className='Lobby'>
            <div className='opacity-lobby'>
                <div className='container-lobby'>
                    <div className='container-players-lobby'>
                        
                        </div>
                    <div className='container-btn-lobby'>
                        <button className='start-game-btn'
                            onClick={()=>{
                                setPage(GAME_STATE);
                            }}
                        >Start Game</button>
                    </div>
                </div>
                <div className='log-out' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to Log Out?')){
                            authConfig.logout();
                            setPage(LOGIN_STATE);  
                        }
                    }}>
                    <label className='log-out-label'>LogOut</label>
                </div>
                <div className='back-btn' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to leave the lobby?')){
                            setPage(LOGGED_STATE);
                        }
                    }}><label className='back-label'>Back</label>
                </div>
            </div>  
            <div className='username-log'>
                <label>Logged as:</label>
                <div className='user-logged'>{username}</div>
            </div>
        </div>
        
    )
}

export default Lobby