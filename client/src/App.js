import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Route, Routes, useMatch, useNavigate } from 'react-router-dom'

import {auth} from './Config/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { dbFirestore} from './Config/firestoreDB';
import { connectionHandlerClient } from './Config/connectionHandler';

import './App.scss'

import LoginForm from './LoginForm_SignUp/LoginForm';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';
import Logged from './Logged/Logged'
import SignUp from './LoginForm_SignUp/SignUp';
import SetUsername from './SetUsername/SetUsername';
import ReportBoard from './components/ReportPlayer/ReportPlayer';
import Winner from './Winner/Winner';




const LOGIN_PAGE = '/';
const SET_USERNAME =  '/setusername';
const SIGN_UP_PAGE = '/signup';
const LOGGED_PAGE = '/lobby';
const GAME_PAGE = '/game';
const WINNER_PAGE = '/winner';



export const AppContext = React.createContext();

function App() {

    const[userAuthStateConnected,setUserAuthStateConnected] = useState(false);
    const[userID, setUserID] = useState(-1);
    const[username,setUsername] = useState('');
    const[lobby, setLobby] = useState(-1);
    const[leaderLobby,setLeaderLobby] = useState(null);
    const[lobbyUpdated,setLobbyUpdated] = useState(false);

    const[gameStart, setGameStart] = useState(false);
    const[gameInitState, setGameInitState] = useState(-1);
    const[gameUpdated,setGameUpdated] = useState(false);
    const[gameOnNewTurn, setGameOnNewTurn] = useState(-1);
    const[gameEnd,setGameEnd] = useState(false);
    const[gameEndState,setGameEndState] = useState(-1);

    
    
    const navigate = useNavigate();
    
    
    const gameInit = useCallback(()=>{

        const indexThisPlayer = gameInitState.players.findIndex((p)=> p.username === username);
        const thisPlayer = gameInitState.players[indexThisPlayer];
        const newPlayersArray = [...gameInitState.players];
        newPlayersArray.splice(indexThisPlayer,1);
        const init = {
            adventurer: thisPlayer.adventurer,
            cards: thisPlayer.cards,
            quest1: gameInitState.quests.quest1,
            quest2: gameInitState.quests.quest2,
            dices: gameInitState.dices,
            players : newPlayersArray,
            config : gameInitState.config
        }
        return init;
    },[gameInitState,username])


    const gameUpdate = useCallback(()=>{

        const indexThisPlayer = gameOnNewTurn.cards.findIndex((p)=> p.username === username);
        const thisPlayerCards = gameOnNewTurn.cards[indexThisPlayer];
        const newCardsArray = [...gameOnNewTurn.cards];
        newCardsArray.splice(indexThisPlayer,1);
        const updateState = {
            quest1: gameOnNewTurn.quest1,
            quest2: gameOnNewTurn.quest2,
            dices: gameOnNewTurn.dices,
            cards: {
                card1: thisPlayerCards.card1,
                card2: thisPlayerCards.card2,
                card3: thisPlayerCards.card3
            }, 
            report: gameOnNewTurn.report
        }
        return updateState;
    },[gameOnNewTurn,username])


    const logOut = useCallback(()=>{
        connectionHandlerClient.leaveLobby(username,(c)=>console("Out of the lobby: " + c));
        setUsername('');
        setUserAuthStateConnected(false);
        setUserID(-1);
        setLobby(-1);
        setLeaderLobby(null);
        setLobbyUpdated(false);
        setGameStart(false);
        setGameInitState(-1);
        setGameOnNewTurn(-1);
        setGameEndState(-1);
        setGameUpdated(false);
        setGameEnd(false);
        navigate(LOGIN_PAGE);
        console.log("logged out");
        connectionHandlerClient.disconnect();
    },[username,navigate])


    const leaveLobby = useCallback(()=>{
        setLobby(-1);
        setLeaderLobby(null);
        setLobbyUpdated(false);
        setGameStart(false);
        setGameInitState(-1);
        setGameOnNewTurn(-1);
        setGameEndState(-1);
        setGameUpdated(false);
        setGameEnd(false);
        connectionHandlerClient.leaveLobby(username);
    },[username,navigate])



    const valueContext = useMemo(()=>({
        userAuthStateConnected, 
        setUserAuthStateConnected, 
        userID,
        username, 
        setUsername, 
        lobby, 
        setLobby, 
        leaderLobby, 
        setLeaderLobby, 
        gameInitState,
        setGameInitState,
        gameOnNewTurn,
        setGameOnNewTurn,
        gameEndState,
        setGameEndState,
        gameEnd,
        setGameEnd,
        navigate,  
        LOGIN_PAGE, 
        SIGN_UP_PAGE, 
        LOGGED_PAGE, 
        SET_USERNAME,
        GAME_PAGE,
        WINNER_PAGE,
        gameStart,
        setGameStart, 
        gameUpdated,
        setGameUpdated,
        gameInit,
        gameUpdate,
        leaveLobby
    
    }),[userAuthStateConnected, userID, username, lobby, leaderLobby, gameInitState, gameOnNewTurn, gameEndState, navigate, gameStart, gameUpdated, gameInit, gameUpdate, leaveLobby]);





    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            if(user){
                setUserAuthStateConnected(true);
                setUserID(user.uid);
                dbFirestore.hasUsername(user.uid).then(hasUsername =>{
                    if(!hasUsername){
                        navigate(SET_USERNAME);
                    }
                    else{
                        dbFirestore.getUsername(user.uid).then(u => setUsername(u));
                    } 
                })
                connectionHandlerClient.connect(); 
            }
            else {
                logOut();   
            }
        })
        return ()=>{         
            unsub(); 
           
        }
    },[]);


    
    return (
        <div className='App'>
            <AppContext.Provider value={valueContext}>
                <Routes>
                    <Route path={LOGIN_PAGE} element={<LoginForm/>}/>
                    <Route path={SET_USERNAME} element={<SetUsername />}/>
                    <Route path={SIGN_UP_PAGE} element={<SignUp/>}/>
                    <Route path={LOGGED_PAGE} element={<Logged setLobbyUpdated={setLobbyUpdated} />}/>
                    <Route path={LOGGED_PAGE +'/:id'} element={<Lobby lobbyUpdated={lobbyUpdated} setLobbyUpdated={setLobbyUpdated}/>}/>
                    <Route path={GAME_PAGE +'/:id'} element={<Game />}/>
                    <Route path={WINNER_PAGE +'/:id'} element={<Winner/>} />
                </Routes>
                
            </AppContext.Provider>
            
        </div>
    )
}

export default App