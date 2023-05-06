import React, { useEffect, useRef, useState} from 'react'
import './Logged.scss'
import { userAuth} from '../Config/auth';
import FriendList from '../components/FriendList/FriendList';
import { connectionHandlerClient } from '../Config/connectionHandler';


const LOBBY_STATE = 'LOBBY';



function Logged({setPage,username,setLeaderLobby,setLobby}) {

    const [idLobbyJoin, setIdLobbyJoin] = useState('');
    const [openSubmitLobbyId,setOpenSubmitLobbyId] = useState(false);
    const submitLobbyIdRef = useRef();

    //Close submitLobbyId on out click
    useEffect(()=>{
        let handlerSubmitLobbyId = (e)=>{
            if(!submitLobbyIdRef.current.contains(e.target)){
                setOpenSubmitLobbyId(false);
            }   
        };
        document.addEventListener("mousedown", handlerSubmitLobbyId);

        return() =>{
            document.removeEventListener("mousedown", handlerSubmitLobbyId);
          }
    });

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
                        <button className={`logged-btn ${connectionHandlerClient.checkConnection()  ? '' : 'inactive-btn'}`}
                            onClick={()=>{
                                setPage(LOBBY_STATE);
                                setLeaderLobby(true);
                                connectionHandlerClient.createLobby(username,setLobby)
                        }}>Create New Lobby</button>
                        <button className={`logged-btn ${connectionHandlerClient.checkConnection()  ? '' : 'inactive-btn'}`}
                            onClick={()=>setOpenSubmitLobbyId(true)}>Join A Lobby</button>
                    </div>
                </div>
                <div className={`submit-lobby-id ${openSubmitLobbyId ? 'open-submit-lobby-id' : 'closed-submit-lobby-id'}`} ref={submitLobbyIdRef}>
                    <input className='field-submit-lobby-id' placeholder={'ID LOBBY, try ask your friend!'} value={idLobbyJoin} onChange={ e => setIdLobbyJoin(e.target.value)}/>
                    <button className='btn-submit-lobby-id' onClick={()=>{
                        let cbRes;
                        connectionHandlerClient.joinLobby(idLobbyJoin,username,(res,lobby)=>{
                            cbRes = res;
                            setLobby(lobby);
                            console.log(res +  " " + lobby  );
                        });
                        console.log(cbRes );
                        switch(cbRes){
                            case 'OK': 
                                setPage(LOBBY_STATE);
                                setLeaderLobby(false);
                                break;
                            case 'FULL':
                                break;
                            case 'ERROR':
                                break;
                            default: break;
                        }
                        
                    }}>Join !</button>
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
                <div className={`connected-label ${connectionHandlerClient.checkConnection()  ? 'online-label' : 'offline-label'}`}>{connectionHandlerClient.checkConnection()  ? 'Online' : 'Offline'}</div>
            </div>
        </div>
    )
}

export default Logged