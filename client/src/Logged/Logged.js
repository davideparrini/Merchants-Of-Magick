import React, { useEffect} from 'react'
import './Logged.scss'
import { authConfig, auth} from '../Config/authConfig';



const LOBBY_STATE = 'LOBBY';


function Logged({setPage}) {


    return (
        <div className='Logged'>
            <div className='opacityLogged'>
                <div className='bgImg'></div>
                <div className='containerLogged'>
                    <div className='titleLogged'/>
                    <div className='containerBtnLogged'>
                        <button className='loggedBtn'
                            onClick={()=>{
                                setPage(LOBBY_STATE);
                        }}>Create New Lobby</button>
                        <button className='loggedBtn'
                            onClick={()=>{
                                setPage(LOBBY_STATE);
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
            <div className='usernameLog'>Logged as:{auth.currentUser.displayName}</div>
        </div>
    )
}

export default Logged