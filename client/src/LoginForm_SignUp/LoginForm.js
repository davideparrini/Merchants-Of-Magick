import React, { useCallback, useEffect, useState } from 'react'
import './LoginForm_SignUp.scss'
import { authConfig } from '../Config/authConfig';


const SIGN_UP_STATE = 'SIGNUPFORM';
const LOGIN_STATE = 'LOGINFORM';


function LoginForm({setUserState}) {

    const[email,setEmail] =useState('');
    const[password,setPassword] = useState('');


    const requestLogin = useCallback((email, password) => authConfig.login(email,password),[]);

    useEffect(()=>{
        const unsub = authConfig.onAuthStateChanged(setUserState,LOGIN_STATE);
        return ()=>{
            unsub();
        }
    },[]);

    
    return (
        <div className='Login_SignUpForm'>
            <div className='titleLogin_SignUpForm'>Log In</div>
            <div className='login_SignUpFormWrap'>
                <div className='login_SignUpFormContainer'>
                    <div className='label_field_Container'>
                        <label className='labelLogin_SignUpForm'>Email</label>
                        <input className='fieldLogin_SignUpForm' value={email} type='text' onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className='label_field_Container'>
                        <label className='labelLogin_SignUpForm'>Password</label>
                        <input className='fieldLogin_SignUpForm' value={password} type='password' onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <div className='btnLog_SigContainer'>
                        <button className='btnForm btnLogIn'
                            onClick={()=>{requestLogin(email,password)}}
                        >Log In</button>
                        <button className='btnForm btnSigUp' onClick={()=>{setUserState(SIGN_UP_STATE)}}>Sign Up</button>
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
