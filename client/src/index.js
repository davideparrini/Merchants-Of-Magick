import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Game from './Game/Game';
import data from './data_test.json'
import Lobby from './Lobby/Lobby';
import LoginForm from './LoginForm/LoginForm';


const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
    <React.StrictMode>
        {/* <Game data={data}/>  */}
        {/* <Lobby></Lobby> */}
        <LoginForm></LoginForm>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
