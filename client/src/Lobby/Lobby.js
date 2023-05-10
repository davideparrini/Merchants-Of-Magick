import React, { useContext, useEffect, useState } from 'react'
import './Lobby.scss'
import { userAuth } from '../Config/auth';
import { connectionHandlerClient } from '../Config/connectionHandler';
import { AppContext } from '../App';


function Lobby({setGameUpdated}) {

    const { username, leaderLobby, lobby, setLobby, setLeaderLobby, gameInitState, setGameInitState, navigate, gameInit ,EMPTYLOBBY, LOGIN_PAGE, LOGGED_PAGE, GAME_PAGE} = useContext(AppContext);

    const[playerToAdd,setPlayerToAdd] = useState('');
    const[idCopied,setIdCopied] = useState(false);
    const[gameStart, setGameStart] = useState(false);
    const[countdownGameStart,setCountdownGameStart] = useState(5);

    // const [remainingTime, setRemainingTime] = useState(1000);
    // useEffect(() => {
    //     if(remainingTime > 0 ){
    //         const intervalId = setInterval(() => {
    //             setRemainingTime((t)=> t-1);
    //             console.log(gameInitState);
    //         }, 3000);
    //         return () => clearInterval(intervalId);
    //     }

    // },[remainingTime]);




    useEffect(()=>{
        if(lobby.id === -1){
            navigate(LOGGED_PAGE);
        }
    },[])

    useEffect(()=>{
        if(gameStart && gameInitState !== -1){
            const gI = gameInit();
            setGameInitState(gI);
            navigate(GAME_PAGE)
        }
    },[gameStart,gameInitState])

    // useEffect(()=>{
    //     if(gameStart){
    //         if(countdownGameStart > 0){
    //             const intervalId = setInterval(() => {
    //                 setCountdownGameStart((t)=> t-1);
    //             }, 1000);
    //             return () => clearInterval(intervalId);
    //         }
    //         else{
    //             navigate(GAME_PAGE);
    //             setCountdownGameStart(5);
    //         }
    //     }
        
    // },[gameStart, countdownGameStart])

    const handleCopy = ()=>{
        navigator.clipboard.writeText(lobby.id);
    }

    return (
        <div className='Lobby'>

            {/* <div className='friend-list-container'>
                <FriendList friendList={["s","a","a"]}/>
            </div> */}
            <div className='opacity-lobby'>
                <div className='container-lobby'>
                    <div className='container-id-lobby'>
                        
                        <label className='label-id-lobby'>ID Lobby :</label>
                        <div className='container-id-btn-id'>
                        <div className='label-id'>{lobby.id}</div>
                            <div className={`btn-copy-id ${idCopied ? 'copied-id' : '' }`} onClick={()=>{setIdCopied(true); handleCopy(); console.log(lobby.players)}}>
                                <div className={idCopied ? '' : 'img-copy'}/>
                                {idCopied ? 'Copied!' :'Copy ID'}
                            </div>
                        </div>     
                    </div>
                    <div className='container-players-lobby'>
                        <div className='box-player' id='b0'/>
                        <div className='box-player' id='b1'/>
                        <div className='box-player' id='b2'/>
                        <div className='box-player' id='b3'/>
                        <div className='box-player' id='b4'/>
                        <div className='box-player' id='b5'/>
                        <div className='box-player' id='b6'/>
                        <div className='box-player' id='b7'/>
                        { 
                            lobby.players.map((playerName,i)=>{
                                return(<div className='player-container-lobby' id={"p"+i} key={i}>
                                    <div className={lobby.leaderLobby === playerName ? 'leader-lobby' : 'no-leader-lobby'}/>{playerName}
                                    </div>)
                            })
                        }        
                    </div>
                    <div className='container-add-player'>
                        <input className='field-add-player' value={playerToAdd} maxLength={15} type='text' onChange={e => setPlayerToAdd(e.target.value)}/>
                        <button className='btn-add-player' onClick={()=>{
                            connectionHandlerClient.invitePlayer(lobby.id,playerToAdd,(res)=>{
                                console.log(res)
                            })
                        }}>Add Player</button>
                    </div>
                    <div className='container-btn-lobby'>
                        <button className= {`start-game-btn ${ leaderLobby  ? '' : 'inactive-btn'}`}
                            onClick={()=>{
                                if(true){
                                    if(!gameStart){
                                        connectionHandlerClient.gameStartRequest(lobby.id, setGameInitState,setGameUpdated, (res)=>{
                                            switch(res){
                                                case 'OK': 
                                                    setGameStart(true);
                                                    break;
                                                case 'ERROR':
                                                    alert("Error, something went wrong starting game!")
                                                    break;
                                                default: break;
                                            }
                                        })
                                    }
                                }
                                   
                            }}
                        >{gameStart ? countdownGameStart :'Start Game'}</button>
                    </div>
                </div>
                <div className='log-out' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to Log Out?')){
                            setLobby(EMPTYLOBBY);
                            setLeaderLobby(false);
                            setGameInitState(-1);
                            setCountdownGameStart(5);
                            userAuth.logout();
                            navigate(LOGIN_PAGE);  
                        }
                    }}>
                    <label className='log-out-label'>LogOut</label>
                </div>
                <div className='back-btn' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to leave the lobby?')){
                            setLobby(EMPTYLOBBY);
                            setLeaderLobby(false);
                            setCountdownGameStart(5);
                            setGameInitState(-1);
                            connectionHandlerClient.leaveLobby(username,(cb)=>console.log(cb));              
                            navigate(LOGGED_PAGE);
                        }
                    }}><label className='back-label'>Back</label>
                </div>
            </div>  
            <div className='username-log'>
                <div className='user-logged'>{username}</div>
                <div className={`connected-label ${connectionHandlerClient.checkConnection()  ? 'online-label' : 'offline-label'}`}>{connectionHandlerClient.checkConnection()  ? 'Online' : 'Offline'}</div>
            </div>
        </div>
        
    )
}

export default Lobby