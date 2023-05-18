import React, { useCallback, useContext, useEffect, useRef, useState} from 'react'
import './Logged.scss'
import { userAuth} from '../Config/auth';
import FriendList from '../components/FriendList/FriendList';
import { connectionHandlerClient } from '../Config/connectionHandler';
import { AppContext } from '../App';
import ToastNotication from '../components/ToastNotification/ToastNotication';
import FullScreenBtn from '../components/FullScreenBtn/FullScreenBtn';


function Logged({setLobbyUpdated}) {


    const { username, setGameStart, setStatusOnline, setSinglePlayerGame, openToastNotification, setOpenToastNotification, statusOnline ,lobby, setLobby, setGameUpdated, setGameInitState, setGameEndState, setGameEnd,gameStart,singlePlayerGame, setGameOnNewTurn, navigate, LOGGED_PAGE, refreshGame,GAME_PAGE} = useContext(AppContext);

    
    const [idLobbyJoin, setIdLobbyJoin] = useState('');
    const [openSubmitLobbyId,setOpenSubmitLobbyId] = useState(false);
    const[countdownGameStart,setCountdownGameStart] = useState(5);

    const[infoInviterLobby, setInfoInviterLobby] = useState(-1);

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
        connectionHandlerClient.registerToInvite(setInfoInviterLobby,setOpenToastNotification);
    },[username])

    useEffect(()=>{
        if(lobby !== -1){
            navigate(`${LOGGED_PAGE}/${lobby.id}`);
        }
    },[lobby])


    useEffect(()=>{
        if(singlePlayerGame){
            if(countdownGameStart > 0){
                const intervalId = setInterval(() => {
                    setCountdownGameStart((t)=> t-1);
                }, 1000);
                return () => clearInterval(intervalId);
                
            }
            else{ 
                navigate(`${GAME_PAGE}/singlePlayer`)
                setCountdownGameStart(5);
            }
        }
        
    },[singlePlayerGame,countdownGameStart])


    
    return (
        <div className='Logged'>
            <div className='opacity-logged'>
                <div className='bg-img'/>
                <div className='container-logged'>
                    <div className='title-logged'/>
                    <div className='container-btn-logged'>
                        <button className={`logged-btn ${statusOnline  ? '' : 'inactive-btn'}`}
                            onClick={()=>{
                                refreshGame();
                                connectionHandlerClient.createLobby(username,(lobby)=>{
                                    setLobby(lobby);
                                    connectionHandlerClient.updateLobby(lobby,setLobby,setLobbyUpdated, setGameStart, setGameInitState, setGameUpdated , setGameOnNewTurn, setGameEndState, setGameEnd);
                                })
                                
                        }}>Create New Lobby</button>
                        <button className={`logged-btn ${statusOnline  ? '' : 'inactive-btn'}`}
                            onClick={()=>setOpenSubmitLobbyId(true)}
                        >Join A Lobby</button>
                        <button className='logged-btn'
                        onClick={()=>{
                            if(!singlePlayerGame){
                                refreshGame();
                                const config ={
                                    config:{
                                            nTurn : 2,
                                            nPotion : 0,
                                            reportTime : 10,
                                            countdown : 300,
                                            dicePerTurn : 2
                                        }
                                }
                                window.navigator.serviceWorker.ready.then( ( registration ) => 'active' in registration && registration.active.postMessage( {type:'start-game-single-player', data: config} )
                                );
                                window.navigator.serviceWorker.onmessage = event => {
                                    const message = event.data;
                                    if(message && message.type === 'start-game-single-player'){
                                        console.log(message)
                                        setGameInitState(message.data);
                                        setSinglePlayerGame(true);
                                        console.log("Start single player game")
                                    }
                                };
                            }
                            
                        }}
                        >{singlePlayerGame ? countdownGameStart :'Single Player'}</button>
                    </div>
                </div>
                <div className={`submit-lobby-id ${openSubmitLobbyId ? 'open-submit-lobby-id' : 'closed-submit-lobby-id'}`} ref={submitLobbyIdRef}>
                    <input className='field-submit-lobby-id' placeholder={'ID LOBBY, try ask your friend!'} value={idLobbyJoin} onChange={ e => setIdLobbyJoin(e.target.value)}/>
                    <button className='btn-submit-lobby-id' onClick={()=>{
                        refreshGame();
                        connectionHandlerClient.joinLobby(idLobbyJoin,username,(res,lobby)=>{
                            switch(res){
                                case 'OK': 
                                    setLobby(lobby);
                                    connectionHandlerClient.updateLobby( lobby, setLobby, setLobbyUpdated , setGameStart, setGameInitState, setGameUpdated, setGameOnNewTurn, setGameEndState, setGameEnd);
                                    break;
                                case 'FULL':
                                    alert("Lobby full!")
                                    break;
                                case 'ERROR':
                                    alert("Error, wrong id!")
                                    break;
                                default: break;
                            }
                            
                        });
                        
                        
                        
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
                <div className='user-logged'>{username}</div>
                <div className={`connected-label ${statusOnline  ? 'online-label' : 'offline-label'}`}>{statusOnline  ? 'Online' : 'Offline'}</div>
                <div className='btn-refresh-connection' onClick={()=> connectionHandlerClient.connect(setStatusOnline)}>
                    <div className='img-fresh-connection'/>
                </div>
            </div>
            { 
                infoInviterLobby !== -1 && (
                    <ToastNotication 
                        question={`You are invited in a lobby by ${infoInviterLobby.usernameInviter}.  Would you like to join him?`}
                        positiveRespose={'Yes'}
                        negativeRespose={'No'}
                        handlerNegativeRespose={()=>{
                            setInfoInviterLobby(-1);
                        }}
                        handlerPositiveRespose={()=>{
                            refreshGame();
                            connectionHandlerClient.joinLobby(infoInviterLobby.lobbyID, username,(res,newLobby)=>{
                                switch(res){
                                    case 'OK': 
                                        setLobby(newLobby);
                                        connectionHandlerClient.updateLobby(newLobby, setLobby, setLobbyUpdated , setGameStart, setGameInitState, setGameUpdated, setGameOnNewTurn, setGameEndState, setGameEnd);
                                        setInfoInviterLobby(-1);
                                        break;
                                    case 'FULL':
                                        alert("Lobby full!")
                                        break;
                                    case 'ERROR':
                                        alert("Error, wrong id!")
                                        break;
                                    default: break;
                                }
                                 
                            })}}
                        openState={openToastNotification}
                        setOpenState={setOpenToastNotification}
                    />
                )
            }
            <FullScreenBtn/>
        </div>
    )
}

export default Logged