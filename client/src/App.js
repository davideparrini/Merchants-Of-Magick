import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { auth } from './Config/auth';
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
import Winner from './Winner/Winner';





const LOGIN_PAGE = '/';
const SET_USERNAME =  '/setusername';
const SIGN_UP_PAGE = '/signup';
const LOGGED_PAGE = '/lobby';
const GAME_PAGE = '/game';
const WINNER_PAGE = '/winner';



export const AppContext = React.createContext();

function App() {

    const[userAuthenticated,setUserAuthenticated] = useState(false);
    const[userID, setUserID] = useState(-1);
    const[statusOnline, setStatusOnline] = useState(true);
    const[username,setUsername] = useState('');
    const[lobby, setLobby] = useState(-1);
   
    const[lobbyUpdated,setLobbyUpdated] = useState(false);

    const[gameStart, setGameStart] = useState(false);
    const[gameInitState, setGameInitState] = useState(-1);
    const[gameUpdated,setGameUpdated] = useState(false);
    const[gameOnNewTurn, setGameOnNewTurn] = useState(-1);
    const[gameEnd,setGameEnd] = useState(false);
    const[gameEndState,setGameEndState] = useState(-1);

    const[singlePlayerGame, setSinglePlayerGame] = useState(false);
    
    const navigate = useNavigate();
    
    
    const gameInit = useCallback(()=>{

        const indexCardsCurrentPlayer = gameInitState.players.findIndex((p)=> p.username === username);
        const thisPlayer = gameInitState.players[indexCardsCurrentPlayer];
        const newBoardPlayer = [];

        let i = indexCardsCurrentPlayer + 1;
        while(i < gameInitState.players.length){
            newBoardPlayer.push(gameInitState.players[i]);
            i++;
        }
        let j = 0;
        while(j < indexCardsCurrentPlayer){
            newBoardPlayer.push(gameInitState.players[j]);
            j++;
        }

        const init = {
            adventurer: thisPlayer.adventurer,
            cards: thisPlayer.cards,
            quest1: gameInitState.quests.quest1,
            quest2: gameInitState.quests.quest2,
            dices: gameInitState.dices,
            players : newBoardPlayer,
            config : gameInitState.config
        }
        return init;
    },[gameInitState,username])




    const logOut = useCallback(()=>{
        connectionHandlerClient.leaveLobby(username,(c)=>console("Out of the lobby: " + c));
        setUsername('');
        setUserAuthenticated(false);
        setUserID(-1);
        setLobby(-1);
        setLobbyUpdated(false);
        setSinglePlayerGame(false);
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


    const refreshGame = useCallback(()=>{
        setLobby(-1);
        setLobbyUpdated(false);
        setGameStart(false);
        setGameInitState(-1);
        setGameOnNewTurn(-1);
        setGameEndState(-1);
        setGameUpdated(false);
        setGameEnd(false);
        setSinglePlayerGame(false);
        connectionHandlerClient.leaveLobby(username);
    },[username,navigate])



    const valueContext = useMemo(()=>({
        userAuthenticated, 
        setUserAuthenticated, 
        userID,
        username, 
        setUsername, 
        lobby, 
        setLobby, 
        statusOnline,
        gameInitState,
        setGameInitState,
        gameOnNewTurn,
        setGameOnNewTurn,
        gameEndState,
        setGameEndState,
        gameEnd,
        setGameEnd,
        navigate,
        singlePlayerGame,
        setSinglePlayerGame,
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

        refreshGame
    
    }),[userAuthenticated, userID, singlePlayerGame,statusOnline, username, lobby, gameInitState, gameOnNewTurn, gameEndState, navigate, gameStart, gameUpdated, gameInit, refreshGame]);





    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            if(user){
                setUserAuthenticated(true);
                setUserID(user.uid);
                dbFirestore.hasUsername(user.uid).then(hasUsername =>{
                    if(!hasUsername){
                        navigate(SET_USERNAME);
                    }
                    else{
                        dbFirestore.getUsername(user.uid).then(u => setUsername(u));
                    } 
                })
                connectionHandlerClient.connect(setStatusOnline); 
            }
            else {
                logOut();   
            }
        })
        return ()=>{         
            unsub(); 
           
        }
    },[]);

    //Use effect per aggiornare lo status Online quando si ha una riconessione
    useEffect(()=>{
        setStatusOnline(connectionHandlerClient.socket.connected);
    },[connectionHandlerClient.socket.connected])


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