import React, { useContext, useEffect, useRef, useState} from 'react'
import './Logged.scss'
import { userAuth} from '../Config/auth';
import FriendList from '../components/FriendList/FriendList';
import { connectionHandlerClient } from '../Config/connectionHandler';
import { AppContext } from '../App';


function Logged({setGameUpdated,setLobbyUpdated}) {


    const { username, setLeaderLobby, setGameStart, lobby, setLobby,setGameInitState, setGameOnNewTurn, navigate, EMPTYLOBBY, LOGGED_PAGE} = useContext(AppContext);

    
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
        connectionHandlerClient.registerToInvite(setLobby);
    },[username])

    useEffect(()=>{
        if(lobby.id  !== -1){
            navigate(`${LOGGED_PAGE}/${lobby.id}`);
        }
    },[lobby])

    return (
        <div className='Logged'>
            <div className='opacity-logged'>
                <div className='bg-img'/>
                <div className='container-logged'>
                    <div className='title-logged'/>
                    <div className='container-btn-logged'>
                        <button className={`logged-btn ${connectionHandlerClient.checkConnection()  ? '' : 'inactive-btn'}`}
                            onClick={()=>{
                                connectionHandlerClient.createLobby(username,(lobby)=>{
                                    setLobby(lobby);
                                    connectionHandlerClient.updateLobby(lobby,setLobby,username,setLeaderLobby,setLobbyUpdated, setGameStart, setGameInitState, setGameUpdated , setGameOnNewTurn);
                                })
                                setLeaderLobby(true);
                        }}>Create New Lobby</button>
                        <button className={`logged-btn ${connectionHandlerClient.checkConnection()  ? '' : 'inactive-btn'}`}
                            onClick={()=>setOpenSubmitLobbyId(true)}>Join A Lobby</button>
                    </div>
                </div>
                <div className={`submit-lobby-id ${openSubmitLobbyId ? 'open-submit-lobby-id' : 'closed-submit-lobby-id'}`} ref={submitLobbyIdRef}>
                    <input className='field-submit-lobby-id' placeholder={'ID LOBBY, try ask your friend!'} value={idLobbyJoin} onChange={ e => setIdLobbyJoin(e.target.value)}/>
                    <button className='btn-submit-lobby-id' onClick={()=>{
                        
                        connectionHandlerClient.joinLobby(idLobbyJoin,username,(res,lobby)=>{
                            switch(res){
                                case 'OK': 
                                    setLeaderLobby(false);
                                    break;
                                case 'FULL':
                                    alert("Lobby full!")
                                    break;
                                case 'ERROR':
                                    alert("Error, wrong id!")
                                    break;
                                default: break;
                            }
                            setLobby(lobby);
                            connectionHandlerClient.updateLobby(lobby,setLobby,username,setLeaderLobby,setLobbyUpdated , setGameStart, setGameInitState, setGameUpdated,setGameOnNewTurn);
                        });
                        
                        
                        
                    }}>Join !</button>
                </div>
                <div className='log-out' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to Log Out?')){
                            setLobby(EMPTYLOBBY);
                            setLeaderLobby(false);
                            setGameInitState(-1);
                            setGameOnNewTurn(-1);
                            userAuth.logout();
                        }
                    }}>
                    <label className='log-out-label'>LogOut</label>
                </div>
               
            </div>
            <div className='username-log'>
                <div className='user-logged'>{username}</div>
                <div className={`connected-label ${connectionHandlerClient.checkConnection()  ? 'online-label' : 'offline-label'}`}>{connectionHandlerClient.checkConnection()  ? 'Online' : 'Offline'}</div>
            </div>
        </div>
    )
}

export default Logged