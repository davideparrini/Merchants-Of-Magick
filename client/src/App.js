import React, { useState } from 'react'
import './App.scss'
import LoginForm from './LoginForm_SignUp/LoginForm';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';
import Logged from './Logged/Logged'

import data from './data_test.json'
import SignUp from './LoginForm_SignUp/SignUp';


const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const LOBBY_STATE = 'LOBBY';
const GAME_STATE = 'GAME';
const SIGN_UP_STATE = 'SIGNUPFORM';

function App() {

    const[userState,setUserState] = useState(LOGIN_STATE);

    function switchState(){
        switch (userState) {
            case LOGIN_STATE:
                return <LoginForm setUserState={setUserState}/>;
            case SIGN_UP_STATE:
                return <SignUp setUserState={setUserState}/>; 
            case LOGGED_STATE:
                return <Logged setUserState={setUserState}/>;
            case LOBBY_STATE:
                return <Lobby setUserState={setUserState}/>;
            case GAME_STATE:
                return <Game data={data} setUserState={setUserState}/>;
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