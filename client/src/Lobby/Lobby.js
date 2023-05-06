import React, { useState } from 'react'
import './Lobby.scss'
import { authConfig } from '../Config/authConfig';

const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const GAME_STATE = 'GAME';


function Lobby({setPage, username,leaderLobby}) {

    const[playerToAdd,setPlayerToAdd] = useState('');

    return (
        <div className='Lobby'>

            {/* <div className='friend-list-container'>
                <FriendList friendList={["s","a","a"]}/>
            </div> */}
            <div className='opacity-lobby'>
                <div className='container-lobby'>
                    <div className='container-players-lobby'>
                        
                    </div>
                    <div className='container-add-player'>
                        <input className='field-add-player' value={playerToAdd} maxLength={15} type='text' onChange={e => setPlayerToAdd(e.target.value)}/>
                        <button className='btn-add-player'>Add Player</button>
                    </div>
                    <div className='container-btn-lobby'>
                        <button className= {`start-game-btn ${leaderLobby ? '' : 'inactive-btn'}`}
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