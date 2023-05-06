import React, { useEffect, useState } from 'react'
import {auth} from './Config/authConfig';
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


const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const LOBBY_STATE = 'LOBBY';
const GAME_STATE = 'GAME';
const SIGN_UP_STATE = 'SIGNUPFORM';

function App() {

    const[page,setPage] = useState(LOGIN_STATE);
    const[userAuthState,setUserAuthState] = useState(null);
    const[username,setUsername] = useState('');
    const[openSetUsername,setOpenSetUsername] = useState(false);
    
    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            if(user){
                console.log(user.displayName);
                setUserAuthState(user);
                dbFirestore.hasUsername(user).then(b =>{
                    if(!b){
                        setOpenSetUsername(true);
                    }
                    else{
                        dbFirestore.getUsername(user).then(u => setUsername(u));
                    } 
                })
            }
            else {
                console.log("logged out");
                setUsername('');
                setUserAuthState(null);
                setPage(LOGIN_STATE);
            }
        })
        return ()=>{
            unsub();
        }
    },[]);

    function switchState(){
        switch (page) {
            case LOGIN_STATE:
                return <LoginForm userAuthState={userAuthState} setPage={setPage}/>;
            case SIGN_UP_STATE:
                return <SignUp userAuthState={userAuthState} setPage={setPage}/>; 
            case LOGGED_STATE:
                return <Logged userAuthState={userAuthState} setPage={setPage} username={username}/>;
            case LOBBY_STATE:
                return <Lobby setPage={setPage} username={username}/>;
            case GAME_STATE:
                return <Game data={data} setPage={setPage}/>;
            default:
                break;
        }
    }


    return (
        <div className='App'>
            <div className = {`container-set-username ${openSetUsername ? '' : 'no-active-set-username'}`}>
                <SetUsername openSetUsername={openSetUsername} setOpenSetUsername={setOpenSetUsername} user={userAuthState} setNickname={setUsername}/>
            </div>
            {switchState()}
        </div>
    )
}

export default App