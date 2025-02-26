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
import Home from './Home/Home';
import { apiLobby } from './api/lobby-api';





const LOGIN_PAGE = '/login';
const SET_USERNAME =  '/setusername';
const SIGN_UP_PAGE = '/signup';
const LOGGED_PAGE = '/lobby';
const GAME_PAGE = '/game';
const WINNER_PAGE = '/winner';



export const AppContext = React.createContext();

function App() {

    const[fullScreen,setFullScreen] = useState(false);

    const[userAuthenticated,setUserAuthenticated] = useState(false);
    const[userID, setUserID] = useState(-1);
    const[statusOnline, setStatusOnline] = useState(false);
    const[username,setUsername] = useState('');
    const[recordSinglePlayer, setRecordSinglePlayer] = useState(-1);
    const[openToastNotification,setOpenToastNotification] = useState(false);
    const[infoInviterLobby, setInfoInviterLobby] = useState(-1);

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


    const refreshGame = useCallback(()=>{
        if(lobby !== -1 && lobby.id != null){
            apiLobby.leaveLobby(lobby.id, username);
        }
        setLobby(-1);
        setLobbyUpdated(false);
        setGameStart(false);
        setGameInitState(-1);
        setGameOnNewTurn(-1);
        setInfoInviterLobby(-1);
        setGameEndState(-1);
        setGameUpdated(false); 
        setGameEnd(false);
        setSinglePlayerGame(false);
        },[lobby, username])


    const logOut = useCallback(()=>{
        refreshGame();
        setUsername('');
        setUserAuthenticated(false);
        setUserID(-1);
        navigate('/');
        console.log("logged out");
        connectionHandlerClient.disconnect();
    },[refreshGame])

    const checkPersonalScore = useCallback((score)=>{
        if(score > recordSinglePlayer){
            dbFirestore.updateRecord(userID,score);
            setRecordSinglePlayer(score);
        }
            
    },[recordSinglePlayer, userID])
    


    const valueContext = useMemo(()=>({
        fullScreen,
        setStatusOnline,
        setFullScreen,
        userAuthenticated, 
        setUserAuthenticated, 
        userID,
        username, 
        setUsername, 
        checkPersonalScore,
        recordSinglePlayer,
        setRecordSinglePlayer,
        lobby, 
        setLobby, 
        statusOnline,
        openToastNotification,
        setOpenToastNotification,
        infoInviterLobby, 
        setInfoInviterLobby,
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
    
    }),[fullScreen, userAuthenticated, userID, username, checkPersonalScore, recordSinglePlayer, lobby, statusOnline, openToastNotification, infoInviterLobby, gameInitState, gameOnNewTurn, gameEndState, gameEnd, navigate, singlePlayerGame, gameStart, gameUpdated, gameInit, refreshGame]);





    useEffect(()=>{
        //Controllo lo stato di autenticazione dell'utente, e mi registro ai cambiamenti di tale stato
        const unsub = onAuthStateChanged(auth, (user)=>{
            if(user){
                //Utente autenticato
                setUserAuthenticated(true);
                setUserID(user.uid);
                //Faccio un check dell'username
                //hasUsername true -> Ottengo l'username da firestore
                //false -> L'utente non ha ancora registrato un username (unico), lo forzo a settare un username se vuole procedere 
                dbFirestore.hasUsername(user.uid).then(hasUsername =>{
                    if(!hasUsername){
                        navigate(SET_USERNAME);
                    }
                    else{ 
                        dbFirestore.getUserData(user.uid).then((res) =>{
                            setUsername(res.username);
                            setRecordSinglePlayer(res.record === undefined ? 0 : res.record)
                        } );
                    } 
                })
                //Connetto l'utente al server
                connectionHandlerClient.connect(
                    setStatusOnline,
                    setInfoInviterLobby, 
                    setOpenToastNotification,
                    setLobby,
                    setLobbyUpdated, 
                    setGameStart, 
                    setGameInitState, 
                    setGameUpdated, 
                    setGameOnNewTurn,
                    setGameEndState,
                    setGameEnd
                ); 
            }
            else {
                //utente non autenticato
                logOut();   
            }
        })
        return ()=>{         
            unsub(); 
            connectionHandlerClient.disconnect();
        }
    },[]);



    return (    
        <div className='App'>
            <AppContext.Provider value={valueContext}>
                <Routes>
                    <Route path={'/'} element={<Home/>}/>
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