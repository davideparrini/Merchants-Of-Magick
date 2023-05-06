import React, { useState, useEffect } from 'react'
import { authConfig } from '../Config/authConfig';
import './LoginForm_SignUp.scss'


const SIGN_UP_STATE = 'SIGNUPFORM';
const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';

function SignUp({setPage,userAuthState}) {

    const[email,setEmail] =useState('');
    const[password,setPassword] = useState('');

    useEffect(()=>{
        if(userAuthState){
            setPage(LOGGED_STATE);
        }
        else{
            setPage(SIGN_UP_STATE);
        }
    },[userAuthState])

    return (
        <div className='LoginSignUpForm'>
            <div className='title-login-sign-up-form'>Sign Up</div>
            <div className='login-sign-up-form-wrap'>
                <div className='login-sign-up-form-container'>
                    <div className='label-field-container'>
                        <label className='label-login-sign-up-form'>Email</label>
                        <input className='field-login-sign-up-form' value={email} type='text' onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className='label-field-container'>
                        <label className='label-login-sign-up-form'>New password</label>
                        <input className='field-login-sign-up-form' value={password} type='password' onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <div className='btn-log-sig-up-container'>
                        <button className='btn-form btn-sign-up' onClick={()=>{
                                authConfig.signUp(email,password).then(setPage(LOGGED_STATE))
                            }}>Sign Up</button>
                    </div>
                </div>

                <div className='divider'>
                    <div className='bar'/>
                    <div className='divider-or'>OR</div>
                </div>

                <div className='log-with-form-container'>
                    <form className='log-with-form facebook'>Sign Up with Facebook</form>
                    <form className='log-with-form google' 
                        onClick={authConfig.googleLogin} >Sign Up with Google</form>
                    <form className='log-with-form github'>Sign Up with GitHub</form>
                </div>
            </div>
            <div className='back-btn' 
                onClick={()=>{setPage(LOGIN_STATE)}}><label className='back-label'>Back</label>
            </div>
           
        </div>
    )
}

export default SignUp