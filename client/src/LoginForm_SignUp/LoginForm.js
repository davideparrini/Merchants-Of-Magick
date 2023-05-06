import React, { useCallback, useEffect, useState } from 'react'
import './LoginForm_SignUp.scss'
import { authConfig } from '../Config/authConfig';
import Logged from '../Logged/Logged';


const SIGN_UP_STATE = 'SIGNUPFORM';
const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';

function LoginForm({userAuthState, setPage}) {

    const[email,setEmail] =useState('');
    const[password,setPassword] = useState('');


    const requestLogin = useCallback((email, password) => authConfig.login(email,password),[]);

    useEffect(()=>{
        if(userAuthState){
            setPage(LOGGED_STATE);
        }
        else{
            setPage(LOGIN_STATE);
        }
    },[userAuthState])
    
    return (
        <div className='LoginSignUpForm'>
            <div className='title-login-sign-up-form'>Log In</div>
            <div className='login-sign-up-form-wrap'>
                <div className='login-sign-up-form-container'>
                    <div className='label-field-container'>
                        <label className='label-login-sign-up-form'>Email</label>
                        <input className='field-login-sign-up-form' value={email} type='text' onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className='label-field-container'>
                        <label className='label-login-sign-up-form'>Password</label>
                        <input className='field-login-sign-up-form' value={password} type='password' onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <div className='btn-log-sig-up-container'>
                        <button className='btn-form btn-log-in'
                            onClick={()=>{requestLogin(email,password)}}
                        >Log In</button>
                        <button className='btn-form btn-sign-up' onClick={()=>{setPage(SIGN_UP_STATE)}}>Sign Up</button>
                    </div>
                    
                </div>

                <div className='divider'>
                    <div className='bar'/>
                    <div className='divider-or'>OR</div>
                </div>

                <div className='log-with-form-container'>
                    <form className='log-with-form facebook'>Log In with Facebook</form>
                    <form className='log-with-form google' 
                        onClick={authConfig.googleLogin} >Log In with Google</form>
                    <form className='log-with-form github'>Log In with GitHub</form>
                </div>
            </div>
           
        </div>
    )
}

export default LoginForm
