import React, { useState } from 'react'
import './LoginForm.scss'
import { authConfig } from '../Config/authConfig';




const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const LOBBY_STATE = 'LOBBY';
const GAME_STATE = 'GAME';

function LoginForm({setUserState}) {

    const[email,setEmail] =useState('');
    const[password,setPassword] = useState('');

    return (
        <div className='LoginForm'>
            <div className='titleLogForm'>Log In</div>
            <div className='loginWrap'>
                <div className='loginContainer'>
                    <div className='label_field_Container'>
                        <label className='labelLogForm'>Email</label>
                        <input className='fieldLogForm' value={email} type='text' onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className='label_field_Container'>
                        <label className='labelLogForm'>Password</label>
                        <input className='fieldLogForm' value={password} type='password' onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <div className='btnLog_SigContainer'>
                        <button className='btnForm btnLogIn'
                            onClick={()=>{
                                authConfig.login(email,password)
                                .then(()=> setUserState(LOGGED_STATE))
                                // .catch((err)=>{
                                //     if(err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'){
                                //         alert("email/password not correct!")
                                //     }
                                // })
                            }}
                        >Log In</button>
                        <button className='btnForm btnSigUp'>Sign Up</button>
                    </div>
                    
                </div>

                <div className='loginDivider'>
                    <div className='bar'/>
                    <div className='loginOr'>OR</div>
                </div>

                <div className='logWithFormContainer'>
                    <form className='logWithForm facebook'>Log In with Facebook</form>
                    <form className='logWithForm google' 
                        onClick={authConfig.googleLogin} >Log In with Google</form>
                    <form className='logWithForm github'>Log In with GitHub</form>
                </div>
            </div>
            
        </div>
    )
}

export default LoginForm
