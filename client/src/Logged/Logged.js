import React, { useEffect } from 'react'
import './Logged.scss'
import { authConfig,auth } from '../Config/authConfig';
import { onAuthStateChanged } from 'firebase/auth';

const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const LOBBY_STATE = 'LOBBY';
const GAME_STATE = 'GAME';

function Logged({setUserState}) {


    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setUserState(LOGGED_STATE);
            }
            else{
                setUserState(LOGIN_STATE);
            }
        })
    },[setUserState]);

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
                        if(window.confirm('Are you sure to Log Out?')){
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