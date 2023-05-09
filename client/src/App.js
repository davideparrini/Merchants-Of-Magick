import React, { useEffect, useState } from 'react'
import { Route,Routes, useNavigate } from 'react-router-dom'

import {auth} from './Config/auth';
import './App.scss'
import LoginForm from './LoginForm_SignUp/LoginForm';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';
import Logged from './Logged/Logged'

import data from './data_test.json'
import SignUp from './LoginForm_SignUp/SignUp';
import { onAuthStateChanged } from 'firebase/auth';
import SetUsername from './SetUsername/SetUsername';
import { dbFirestore} from './Config/firestoreDB';
import { connectionHandlerClient } from './Config/connectionHandler';


const LOGIN_PAGE = '/';
const SET_USERNAME =  '/setusername';
const SIGN_UP_PAGE = '/signup';
const LOGGED_PAGE = '/logged';
const LOBBY_PAGE = '/lobby';
const GAME_PAGE = '/game';



export const AppContext = React.createContext();

function App() {

    const[userAuthState,setUserAuthState] = useState(null);
    const[username,setUsername] = useState('');

    const[lobby, setLobby] = useState(null);
    const[leaderLobby,setLeaderLobby] = useState(null);
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
                navigate(LOGIN_PAGE);
                connectionHandlerClient.disconnect();
            }
        })
        return ()=>{
            unsub();
        }
    },[]);

    return (
        <div className='App'>
            <AppContext.Provider value={{userAuthState, setUserAuthState, username , setUsername, lobby, setLobby, leaderLobby, setLeaderLobby,navigate}}>
                <Routes>
                    <Route path={LOGIN_PAGE} element={<LoginForm/>}/>
                    <Route path={SET_USERNAME} element={<SetUsername />}/>
                    <Route path={SIGN_UP_PAGE} element={<SignUp/>}/>
                    <Route path={LOGGED_PAGE} element={<Logged/>}/>
                    <Route path={LOBBY_PAGE} element={<Lobby/>}/>
                    <Route path={GAME_PAGE} element={<Game data={data}/>}/>
                </Routes>
            </AppContext.Provider>
        </div>
    )
}

export default App