import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Lobby.scss';
import { AppContext } from '../../App';
import FullScreenBtn from '../components/FullScreenBtn/FullScreenBtn';
import LogOut from '../components/LogOut/LogOut';
import BackBtn from '../components/BackBtn/BackBtn';
import useEffectOnPage from '../../hooks/useEffectOnPage';
import { lobbyService } from '../../BE/service/lobby-service';
import { gameService } from '../../BE/service/game-service';
import { repositoryLobby } from '../../BE/repository/lobby-repository';



function Lobby() {

    const { 
        userID,
        lobbyUpdated,
        setLobbyUpdated,
        username, 
        statusOnline, 
        lobby, 
        setLobby,
        gameStart,  
        gameInitState,
        setGameInitState,
        setGameStartState,
        navigate, 
        gameInit, 
        refreshGame,  
        LOGGED_PAGE, 
        LOBBY_PAGE,
        GAME_PAGE
    } = useContext(AppContext);

    const[playerToAdd,setPlayerToAdd] = useState('');
    const[idCopied,setIdCopied] = useState(false);
    const[isLoading,setIsLoading] = useState(false);
    
    
    const[countdownGameStart,setCountdownGameStart] = useState(5);

    
    const[configNTurn, setConfigNTurn] = useState(10);
    const[configNPotion, setConfigNPotion] = useState(3);
    const[configReportTime, setConfigReportTime] = useState(10);
    const[configCountdown, setConfigCountdown] = useState(300);
    const[configDicePerTurn, setConfigDicePerTurn] = useState(2);
    const[sendJoin, setSendJoin] = useState(false);
    

    const { id: lobbyIDParam } = useParams();

    useEffect(()=>{
        if(lobbyUpdated){
            setLobbyUpdated(false);
        }
    },[lobbyUpdated]);

   

    useEffectOnPage( LOBBY_PAGE ,() => {
        if(lobby === -1){
            navigate(LOGGED_PAGE);
        }
        
    }, [lobby]);
    


    useEffectOnPage( LOBBY_PAGE ,()=>{
        if(gameStart){
            if(countdownGameStart > 0){
                const intervalId = setInterval(() => {
                    setCountdownGameStart((t)=> t-1);
                }, 1000);
                return () => clearInterval(intervalId);
                
            }
            else{ 
                const gI = gameInit(gameInitState, username);
                setGameStartState(gI);
                
                navigate(`${GAME_PAGE}/${lobby.id}`)
                setCountdownGameStart(5);
            }
        }
        
    },[gameStart, countdownGameStart,gameInitState])

    const handleCopy = useCallback(()=>{
        navigator.clipboard.writeText(lobbyIDParam);
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
                        <div className='label-id'>{lobbyIDParam}</div>
                            <div className={`btn-copy-id ${idCopied ? 'copied-id' : '' }`} onClick={()=>{setIdCopied(true); handleCopy(); }}>
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
                        {  lobby !== -1 && 
                            lobby.players.map((player,i)=>{
                                return(<div className='player-container-lobby' id={"p"+i} key={i}>
                                    <div className={lobby.leader === player ? 'leader-lobby' : 'no-leader-lobby'}/>{player}
                                    </div>)
                            })
                        }        
                    </div>
                    <div className='container-add-player'>
                        <input className='field-add-player' value={playerToAdd} maxLength={15} type='text' onChange={e => setPlayerToAdd(e.target.value)}/>
                        <button className='btn-add-player inactive-btn' onClick={async ()=>{
                            try {
                                const res =  await lobbyService.invitePlayer(lobbyIDParam, playerToAdd, username);
                                if(!res){
                                    alert("Il player invitato non è online");
                                }
                            } catch (error) {
                                alert(error);
                                console.error(error);
                            }
            
                            setPlayerToAdd('');
                        }}>Add Player</button>
                    </div>
                    <div className='container-btn-lobby'>
                        <button className= {`start-game-btn ${ lobby.leader === username && lobby.players.length > 1  ? '' : 'inactive-btn'}`}
                            disabled={gameStart || isLoading}
                            onClick={async ()=>{
                                if(!gameStart){
                                    setIsLoading(true);
                                    const config ={
                                        nTurn : configNTurn,
                                        nPotion : configNPotion,
                                        reportTime : configReportTime,
                                        countdown : configCountdown,
                                        dicePerTurn : configDicePerTurn
                                    }
                                    
                                    await gameService.startGame(lobby.id,config);
                                    setIsLoading(false);
                                }
                                   
                            }}
                        >{gameStart ? countdownGameStart :'Start Game'}</button>
                    </div>
                    {   
                        lobby.leader === username &&
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
                                        <option value={300} selected>300 s</option>
                                        <option value={400}>400 s</option>
                                        <option value={500}>500 s</option>
                                    </select>
                                </div>
                                <div className ='config-box'>
                                    <label className = 'label-config'>Number of turns</label>
                                    <select name='nTurn' className= 'select-config' onChange={(e)=>{
                                        setConfigNTurn(e.target.value)
                                    }}>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={8}>8</option>
                                        <option value={10} selected>10</option>
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
                                        <option value={3} selected>3</option>
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
                                        <option value={10} selected>10 s</option>
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
                                        <option value={2} selected>2</option>
                                        <option value={3}>3</option>
                                    </select>
                                </div>
                            </div>
                        )
                    }
                    
                </div>
                
            </div>  
            <div className='left-wrapper-logged'>
                <div className='username-logged'>
                    <div className='user-logged'>{username}</div>
                    <div className='connection-wrapper'>
                        <div className={`connected-label ${statusOnline  ? 'online-label' : 'offline-label'}`}>{statusOnline  ? 'Online' : 'Offline'}</div>
                    </div>
                </div>
            </div>
            <BackBtn pageToBack={LOGGED_PAGE} actionToDo={()=>{
                refreshGame();
                repositoryLobby.leaveLobby(lobby.id, username);
                }} message={'Are you sure to leave the lobby?'} alert={true}/>
            <LogOut/>
            <FullScreenBtn/>
        </div>
        
    )
}

export default Lobby