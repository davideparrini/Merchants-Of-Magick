import React, { useCallback, useContext, useEffect, useState } from 'react'
import './LoginForm_SignUp.scss'
import { userAuth } from '../Config/auth';
import { AppContext } from '../App';


const LOGIN_PAGE = '/';
const SIGN_UP_PAGE = '/signup';
const LOGGED_PAGE = '/logged';


function LoginForm() {

    const {userAuthState, navigate} = useContext(AppContext);
    
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');


    const requestLogin = useCallback((email, password) =>{
        userAuth.login(email,password).then((b)=>{
            if(!b){
                alert("Errore email o password");
            }
        })
    },[]);

    useEffect(()=>{
        if(userAuthState){
            navigate(LOGGED_PAGE);
        }
        else{
            navigate(LOGIN_PAGE);
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
                        <button className='btn-form btn-sign-up' onClick={()=>{navigate(SIGN_UP_PAGE)}}>Sign Up</button>
                    </div>
                    
                </div>

                <div className='divider'>
                    <div className='bar'/>
                    <div className='divider-or'>OR</div>
                </div>

                <div className='log-with-form-container'>
                    <form className='log-with-form facebook'>Log In with Facebook</form>
                    <form className='log-with-form google' 
                        onClick={userAuth.googleLogin} >Log In with Google</form>
                    <form className='log-with-form github'>Log In with GitHub</form>
                </div>
            </div>
           
        </div>
    )
}

export default LoginForm
