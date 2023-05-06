import React, { useEffect} from 'react'
import './Logged.scss'
import { userAuth} from '../Config/auth';
import FriendList from '../components/FriendList/FriendList';
import { connectionHandlerClient } from '../Config/connectionHandler';


const LOBBY_STATE = 'LOBBY';



function Logged({setPage,username,setLeaderLobby,setLobby}) {

    useEffect(()=>{
        connectionHandlerClient.sendUsername(username);
    },[username])

    return (
        <div className='Logged'>
            <div className='opacity-logged'>
                <div className='bg-img'/>
                <div className='container-logged'>
                    <div className='title-logged'/>
                    <div className='container-btn-logged'>
                        <button className='logged-btn'
                            onClick={()=>{
                                setPage(LOBBY_STATE);
                                setLeaderLobby(true);
                                connectionHandlerClient.createLobby(username,setLobby)
                        }}>Create New Lobby</button>
                        <button className='logged-btn'
                            onClick={()=>{
                                setPage(LOBBY_STATE);
                                setLeaderLobby(false);
                        }}>Join A Lobby</button>
                    </div>
                </div>
                <div className='log-out' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to Log Out?')){
                            userAuth.logout();
                        }
                    }}>
                    <label className='log-out-label'>LogOut</label>
                </div>
               
            </div>
            <div className='username-log'>
                <label>Logged as:</label>
                <div className='user-logged'>{username}</div>
            </div>
        </div>
    )
}

export default Logged