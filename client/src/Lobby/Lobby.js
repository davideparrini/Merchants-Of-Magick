import React, { useCallback, useContext, useEffect, useState } from 'react'
import './Lobby.scss'
import { userAuth } from '../Config/auth';
import { connectionHandlerClient } from '../Config/connectionHandler';
import { AppContext } from '../App';
import FullScreenBtn from '../components/FullScreenBtn/FullScreenBtn';
import LogOut from '../components/LogOut/LogOut';
import BackBtn from '../components/BackBtn/BackBtn';


function Lobby({lobbyUpdated,setLobbyUpdated}) {

    const { username, statusOnline, lobby, gameStart,  gameInitState, setGameInitState, navigate, gameInit , refreshGame,  LOGGED_PAGE, GAME_PAGE} = useContext(AppContext);

    const[playerToAdd,setPlayerToAdd] = useState('');
    const[idCopied,setIdCopied] = useState(false);
    
    
    const[countdownGameStart,setCountdownGameStart] = useState(5);

    
    const[configNTurn, setConfigNTurn] = useState(10);
    const[configNPotion, setConfigNPotion] = useState(0);
    const[configReportTime, setConfigReportTime] = useState(10);
    const[configCountdown, setConfigCountdown] = useState(300);
    const[configDicePerTurn, setConfigDicePerTurn] = useState(2);


    useEffect(()=>{
        if(lobbyUpdated){
            setLobbyUpdated(false);
        }
    },[lobbyUpdated]);


    useEffect(()=>{
        if(lobby === -1 || lobby === undefined || !statusOnline){
            alert("Something went wrong or server is offile!");
            refreshGame();
            navigate(LOGGED_PAGE);
        }
    },[lobby,navigate,statusOnline]);


    useEffect(()=>{
        if(gameStart){
            if(countdownGameStart > 0){
                const intervalId = setInterval(() => {
                    setCountdownGameStart((t)=> t-1);
                }, 1000);
                return () => clearInterval(intervalId);
                
            }
            else{ 
                const gI = gameInit();
                setGameInitState(gI);
                
                navigate(`${GAME_PAGE}/${lobby.id}`)
                setCountdownGameStart(5);
            }
        }
        
    },[gameStart, countdownGameStart,gameInitState])

    const handleCopy = useCallback(()=>{
        navigator.clipboard.writeText(lobby.id);
    },[lobby.id]);

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
                            connectionHandlerClient.invitePlayer(lobby.id, username, playerToAdd,(res)=>{
                                switch(res){
                                    case 'OK': 
                                        console.log('Ok invited');
                                        break;
                                    case 'FULL':
                                        alert("Lobby full!")
                                        break;
                                    case 'in-game':
                                        alert("The player is in game")
                                        break;
                                    case 'ERROR':
                                        alert("Error, something went wrong!")
                                        break;
                                    default: break;
                                }
                            })
                        }}>Add Player</button>
                    </div>
                    <div className='container-btn-lobby'>
                        <button className= {`start-game-btn ${ lobby.leaderLobby === username && lobby.players.length > 1  ? '' : 'inactive-btn'}`}
                            onClick={()=>{
                                if(!gameStart){
                                    const config ={
                                        nTurn : configNTurn,
                                        nPotion : configNPotion,
                                        reportTime : configReportTime,
                                        countdown : configCountdown,
                                        dicePerTurn : configDicePerTurn
                                    }
                                    connectionHandlerClient.gameStartRequest(lobby.id, config,(res)=>{
                                        switch(res){
                                            case 'OK': 
                                                console.log("Game start");
                                                break;
                                            case 'ERROR':
                                                alert("Error, something went wrong starting game!");
                                                refreshGame();              
                                                navigate(LOGGED_PAGE);
                                                break;
                                            default: break;
                                        }
                                    })
                                }
                                
                                   
                            }}
                        >{gameStart ? countdownGameStart :'Start Game'}</button>
                    </div>
                    {   
                        lobby.leaderLobby === username &&
                        (
                            <div className='configs-wrapper'>
                                <div className ='config-box'>
                                    <label className = 'label-config'>Time per turn</label>
                                    <select name='countdown' className= 'select-config' onChange={(e)=>{
                                        setConfigCountdown(e.target.value)
                                    }}>
                                        <option value={30}>30 s</option>
                                        <option value={60}>60 s</option>
                                        <option value={120}>120 s</option>
                                        <option value={250}>250 s</option>
                                        <option value={300}>300 s</option>
                                        <option value={400}>400 s</option>
                                        <option value={500}>500 s</option>
                                    </select>
                                </div>
                                <div className ='config-box'>
                                    <label className = 'label-config'>Number of turns</label>
                                    <select name='nTurn' className= 'select-config' onChange={(e)=>{
                                        setConfigNTurn(e.target.value)
                                    }}>
                                        <option value={2}>4</option>
                                        <option value={2}>5</option>
                                        <option value={8}>8</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                    </select>
                                </div>
                                <div className ='config-box'>
                                    <label className = 'label-config'>Start potions</label>
                                    <select name='nPotion' className= 'select-config'onChange={(e)=>{
                                        setConfigNPotion(e.target.value)
                                    }}>
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                </div>
                                <div className ='config-box'>
                                    <label className = 'label-config'>Report Time</label>
                                    <select name='reportTime' className= 'select-config'onChange={(e)=>{
                                        setConfigReportTime(e.target.value)
                                    }}>
                                        <option value={5}>5 s</option>
                                        <option value={10}>10 s</option>
                                        <option value={15}>15 s</option>
                                        <option value={20}>20 s</option>
                                        <option value={30}>30 s</option>
                                    </select>
                                </div>
                                <div className ='config-box'>
                                    <label className = 'label-config'>Dices per turn</label>
                                    <select name='dicePerTurn' className= 'select-config'onChange={(e)=>{
                                        setConfigDicePerTurn(e.target.value)
                                    }}>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                    </select>
                                </div>
                            </div>
                        )
                    }
                    
                </div>
                
            </div>  
            <div className='username-log'>
                <div className='user-logged'>{username}</div>
                <div className={`connected-label ${statusOnline  ? 'online-label' : 'offline-label'}`}>{statusOnline ? 'Online' : 'Offline'}</div>
            </div>
            <BackBtn pageToBack={LOGGED_PAGE} actionToDo={refreshGame}/>
            <LogOut/>
            <FullScreenBtn/>
        </div>
        
    )
}

export default Lobby