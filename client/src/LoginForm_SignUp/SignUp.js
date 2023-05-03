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
        <div className='Login_SignUpForm'>
            <div className='titleLogin_SignUpForm'>Sign Up</div>
            <div className='login_SignUpFormWrap'>
                <div className='login_SignUpFormContainer'>
                    <div className='label_field_Container'>
                        <label className='labelLogin_SignUpForm'>Email</label>
                        <input className='fieldLogin_SignUpForm' value={email} type='text' onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className='label_field_Container'>
                        <label className='labelLogin_SignUpForm'>New password</label>
                        <input className='fieldLogin_SignUpForm' value={password} type='password' onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <div className='btnLog_SigContainer'>
                        <button className='btnForm btnSigUp' onClick={()=>{
                                authConfig.signUp(email,password).then(setPage(LOGGED_STATE))
                            }}>Sign Up</button>
                    </div>
                </div>

                <div className='loginDivider'>
                    <div className='bar'/>
                    <div className='loginOr'>OR</div>
                </div>

                <div className='logWithFormContainer'>
                    <form className='logWithForm facebook'>Sign Up with Facebook</form>
                    <form className='logWithForm google' 
                        onClick={authConfig.googleLogin} >Sign Up with Google</form>
                    <form className='logWithForm github'>Sign Up with GitHub</form>
                </div>
            </div>
            <div className='backBtn' 
                onClick={()=>{setPage(LOGIN_STATE)}}><label className='backLabel'>Back</label>
            </div>
           
        </div>
    )
}

export default SignUp