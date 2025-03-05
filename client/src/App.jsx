import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { auth } from './BE/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { repositoryUsers} from './BE/repository/users-repository.js';
import { repositoryLobby } from './BE/repository/lobby-repository';

import './App.scss'

import LoginForm from './Pages/LoginForm_SignUp/LoginForm';
import Lobby from './Pages/Lobby/Lobby';
import Game from './Pages/Game/Game';
import Logged from './Pages/Logged/Logged'
import SignUp from './Pages/LoginForm_SignUp/SignUp';
import SetUsername from './Pages/SetUsername/SetUsername';
import Winner from './Pages/Winner/Winner';
import Home from './Pages/Home/Home';
import { gameInitMock } from './Config/constants';
import ErrorBoundary from './errorHandler/ErrorBoundary';
import { useServiceWorkerStatus } from './hooks/useServiceWorkenStatus';
// import { rtdb } from './BE/repository/rtdb.js';





const LOGIN_PAGE = '/login';
const SET_USERNAME =  '/setusername';
const SIGN_UP_PAGE = '/signup';
const LOGGED_PAGE = '/logged';
const LOBBY_PAGE = '/lobby';
const GAME_PAGE = '/game';
const WINNER_PAGE = '/winner';



export const AppContext = React.createContext();

function App() {

    const[fullScreen,setFullScreen] = useState(false);

    const[userAuthenticated,setUserAuthenticated] = useState(false);
    const[userID, setUserID] = useState(-1);
    const[statusOnline, setStatusOnline] = useState(navigator.onLine);
    const[username,setUsername] = useState('');
    const[recordSinglePlayer, setRecordSinglePlayer] = useState(-1);
    const[openToastNotification,setOpenToastNotification] = useState(false);
    const[infoInviterLobby, setInfoInviterLobby] = useState(new Map());
    
    const[lobby, setLobby] = useState(-1);
   
    const[lobbyUpdated,setLobbyUpdated] = useState(false);

    const[gameStart, setGameStart] = useState(false);
    const[gameInitState, setGameInitState] = useState(gameInitMock);
    const[gameUpdated,setGameUpdated] = useState(false);
    const[gameOnNewTurn, setGameOnNewTurn] = useState(-1);
    const[gameEnd,setGameEnd] = useState(false);
    const[gameEndState,setGameEndState] = useState(-1);

    const[singlePlayerGame, setSinglePlayerGame] = useState(false);
    
    const isSWActive = useServiceWorkerStatus();

    const navigate = useNavigate();
    
    
    const gameInit = useCallback(()=>{
        const indexCardsCurrentPlayer = gameInitState.players.findIndex((p)=> p === username);
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
            player: thisPlayer,
            quest1: gameInitState.quest1,
            quest2: gameInitState.quest2,
            dices: gameInitState.dices,
            otherPlayers : newBoardPlayer,
            config : gameInitState.config
        }
        return init;
    },[gameInitState,username])


    const refreshGame = useCallback(()=>{
        setLobby(-1);
        setLobbyUpdated(false);
        setGameStart(false);
        setGameInitState(gameInitMock);
        setGameOnNewTurn(-1);
        setInfoInviterLobby(new Map());
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
    },[refreshGame])

    const checkPersonalScore = useCallback((score)=>{
        if(score > recordSinglePlayer){
            repositoryUsers.updateRecord(userID,score);
            setRecordSinglePlayer(score);
        }
    },[recordSinglePlayer, userID])
    


    const valueContext = useMemo(()=>({
        lobbyUpdated,
        setLobbyUpdated,
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
        LOBBY_PAGE,
        SET_USERNAME,
        GAME_PAGE,
        WINNER_PAGE,
        gameStart,
        setGameStart, 
        gameUpdated,
        setGameUpdated,
        gameInit,
        refreshGame,
        isSWActive
    
    }),[lobbyUpdated, fullScreen, userAuthenticated, userID, username, checkPersonalScore, recordSinglePlayer, lobby, statusOnline, openToastNotification, infoInviterLobby, gameInitState, gameOnNewTurn, gameEndState, gameEnd, navigate, singlePlayerGame, gameStart, gameUpdated, gameInit, refreshGame, isSWActive]);





    useEffect(()=>{
        //Controllo lo stato di autenticazione dell'utente, e mi registro ai cambiamenti di tale stato
        const unsub = onAuthStateChanged(auth, (user)=>{
            if(user){
                //Utente autenticato
                setUserAuthenticated(true);
                setUserID(()=>user.uid);
                // rtdb.setOnline(user.uid,true );
                //Faccio un check dell'username
                //hasUsername true -> Ottengo l'username da firestore
                //false -> L'utente non ha ancora registrato un username (unico), lo forzo a settare un username se vuole procedere 
                repositoryUsers.hasUsername(user.uid).then(hasUsername =>{
                    if(!hasUsername){
                        navigate(SET_USERNAME);
                    }
                    else{ 
                        repositoryUsers.getUserData(user.uid).then((res) =>{
                            setUsername(()=>res.username);
                            setRecordSinglePlayer(res.record === undefined ? 0 : res.record)
                        } );
                    } 
                })
                
            }
            else {
                //utente non autenticato
                logOut();   
            }
        })
        return ()=>{         
            unsub(); 
            setUserAuthenticated(false);
        }
    },[username]);


    useEffect(()=>{
        if(username !== "" && userID !== -1 && lobby !== -1){
            // rtdb.resetInvite(userID);
            repositoryLobby.subscribeToLobby(
                lobby, 
                username, 
                setLobby,
                setLobbyUpdated, 
                setGameStart, 
                setGameInitState, 
                setGameUpdated, 
                setGameOnNewTurn, 
                setGameEndState, 
                setGameEnd
            )

            // rtdb.subscribeToInvite(
            //     userID,
            //     setInfoInviterLobby,
            //     infoInviterLobby,
            //     setOpenToastNotification
            // )
        }
       
    },[username, userID, lobby, infoInviterLobby])

    useEffect(() => {
        // const handleBeforeUnload = (event) => {
        //     event.preventDefault();
        //     event.returnValue = ''; 
        //     console.log("Tentativo di chiusura della finestra");
        // };
    
        const handleOnline = () => {
            console.log("Sei online!");
            setStatusOnline(true);
        };
    
        const handleOffline = () => {
            console.log("Sei offline!");
            setStatusOnline(false);
        };
    
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        // window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            // window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [setStatusOnline]); // Dipendenza per assicurarsi che lo stato venga aggiornato
    


    

    return (    
        <div className='App'>
            <AppContext.Provider value={valueContext}>
                <ErrorBoundary>
                    <Routes>
                        <Route path={'/'} element={<Home/>}/>
                        <Route path={LOGIN_PAGE} element={<LoginForm/>}/>
                        <Route path={SET_USERNAME} element={<SetUsername />}/>
                        <Route path={SIGN_UP_PAGE} element={<SignUp/>}/>
                        <Route path={LOGGED_PAGE} element={<Logged/>}/>
                        <Route path={LOBBY_PAGE +'/:id'} element={<Lobby/>}/>
                        <Route path={GAME_PAGE +'/:id'} element={<Game />}/>
                        <Route path={WINNER_PAGE +'/:id'} element={<Winner/>} />
                    </Routes>
                </ErrorBoundary>
            </AppContext.Provider>
        </div>
    )
}

export default App