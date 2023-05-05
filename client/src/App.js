import React, { useEffect, useState } from 'react'
import { authConfig, auth} from './Config/authConfig';
import './App.scss'
import LoginForm from './LoginForm_SignUp/LoginForm';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';
import Logged from './Logged/Logged'

import data from './data_test.json'
import SignUp from './LoginForm_SignUp/SignUp';
import { onAuthStateChanged } from 'firebase/auth';



const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const LOBBY_STATE = 'LOBBY';
const GAME_STATE = 'GAME';
const SIGN_UP_STATE = 'SIGNUPFORM';

function App() {

    const[page,setPage] = useState(GAME_STATE);
    const[userAuthState,setUserAuthState] = useState(null);
    
    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            if(user){
                console.log(user.displayName);
                setUserAuthState(user)
            }
            else {
                console.log("logged out");
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
                return <Logged userAuthState={userAuthState} setPage={setPage}/>;
            case LOBBY_STATE:
                return <Lobby setPage={setPage}/>;
            case GAME_STATE:
                return <Game data={data} setPage={setPage}/>;
            default:
                break;
        }
    }


    return (
        <div className='App'>
            {switchState()}
        </div>
    )
}

export default App