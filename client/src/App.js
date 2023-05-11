import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Route,Routes, useNavigate } from 'react-router-dom'

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




const LOGIN_PAGE = '/';
const SET_USERNAME =  '/setusername';
const SIGN_UP_PAGE = '/signup';
const LOGGED_PAGE = '/lobby';
const GAME_PAGE = '/game';
const EMPTYLOBBY = {
    id : -1,
    players : [],
    leaderLobby : ''
}


export const AppContext = React.createContext();

function App() {

    const[userAuthState,setUserAuthState] = useState(null);
    const[username,setUsername] = useState('');
    const[lobby, setLobby] = useState(EMPTYLOBBY);
    const[leaderLobby,setLeaderLobby] = useState(null);
    const[lobbyUpdated,setLobbyUpdated] = useState(false);

    const[gameStart, setGameStart] = useState(false);
    const[gameInitState, setGameInitState] = useState(-1);
    const[gameOnNewTurn, setGameOnNewTurn] = useState(-1);

    const[gameUpdated,setGameUpdated] = useState(false);

    const navigate = useNavigate();
    
    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            if(user){
                setUserAuthState(user);
                dbFirestore.hasUsername(user).then(b =>{
                    if(!b){
                        navigate(SET_USERNAME);
                    }
                    else{
                        dbFirestore.getUsername(user).then(u => setUsername(u));
                    } 
                })
                connectionHandlerClient.connect();
                
            }
            else {
                console.log("logged out");
                setUsername('');
                setUserAuthState(null);
                setLobby(EMPTYLOBBY);
                setLeaderLobby(false);
                setGameStart(false);
                setGameInitState(-1);
                setGameOnNewTurn(-1);
                setGameUpdated(false);
                navigate(LOGIN_PAGE);
                connectionHandlerClient.disconnect();
            }
        })
        return ()=>{
            unsub();
        }
    },[]);

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
            players : newPlayersArray
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

    const valueContext = useMemo(()=>({
        userAuthState, 
        setUserAuthState, 
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
        navigate, 
        EMPTYLOBBY, 
        LOGIN_PAGE, 
        SIGN_UP_PAGE, 
        LOGGED_PAGE, 
        SET_USERNAME,
        GAME_PAGE,
        gameInit,
        gameUpdate,
        gameStart,
        setGameStart, 
        gameUpdated,
        setGameUpdated
    
    }),[userAuthState, username, lobby, leaderLobby, gameInitState, gameOnNewTurn, navigate, gameInit, gameUpdate, gameStart,gameUpdated]);

    return (
        <div className='App'>
            <AppContext.Provider value={valueContext}>
                <Routes>
                    <Route path={LOGIN_PAGE} element={<LoginForm/>}/>
                    <Route path={SET_USERNAME} element={<SetUsername />}/>
                    <Route path={SIGN_UP_PAGE} element={<SignUp/>}/>
                    <Route path={LOGGED_PAGE} element={<Logged setLobbyUpdated={setLobbyUpdated} />}/>
                    <Route path={LOGGED_PAGE+'/:id'} element={<Lobby lobbyUpdated={lobbyUpdated} setLobbyUpdated={setLobbyUpdated}/>}/>
                    <Route path={GAME_PAGE} element={<Game />}/>
                </Routes>
            </AppContext.Provider>
        </div>
    )
}

export default App