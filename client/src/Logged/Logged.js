import React from 'react'
import './Logged.scss'
import { authConfig } from '../Config/authConfig';

const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const LOBBY_STATE = 'LOBBY';
const GAME_STATE = 'GAME';

function Logged({setUserState}) {


    return (
        <div className='Logged'>
            <div className='opacityLogged'>
                <div className='bgImg'></div>
                <div className='containerLogged'>
                    <div className='titleLogged'/>
                    <div className='containerBtnLogged'>
                        <button className='loggedBtn'
                            onClick={()=>{
                                setUserState(LOBBY_STATE);
                        }}>Create New Lobby</button>
                        <button className='loggedBtn'
                            onClick={()=>{
                                setUserState(LOBBY_STATE);
                        }}>Join A Lobby</button>
                    </div>
                </div>
                <div className='logOut' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to LogOut?')){
                            setUserState(LOGIN_STATE);
                            authConfig.logout();
                        }
                    }}>
                    <label className='logOutLabel'>LogOut</label>
                </div>
               
            </div>
        
        </div>
    )
}

export default Logged