import React, { useContext, useEffect, useState } from 'react'
import './LoginForm_SignUp.scss'
import { userAuth } from '../Config/auth';
import { AppContext } from '../App';
import FullScreenBtn from '../components/FullScreenBtn/FullScreenBtn';
import BackBtn from '../components/BackBtn/BackBtn';



function LoginForm() {

    const {userAuthenticated, navigate, SIGN_UP_PAGE, LOGIN_PAGE, LOGGED_PAGE} = useContext(AppContext);
    
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');

    useEffect(()=>{
        if(userAuthenticated){
            navigate(LOGGED_PAGE);
        }
        else{
            navigate(LOGIN_PAGE);
        }
    },[userAuthenticated])
    
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
                            onClick={()=>{
                                userAuth.login(email,password).then((logged)=>{
                                    if(!logged){
                                        alert("Wrong email or password!");
                                    }
                                })
                            }}
                        >Log In</button>
                        <button className='btn-form btn-sign-up' onClick={()=>{navigate(SIGN_UP_PAGE)}}>Sign Up</button>
                    </div>
                    
                </div>

                <div className='divider'>
                    <div className='bar'/>
                    <div className='divider-or'>OR</div>
                </div>

                <div className='log-with-form-container'>
                    <form className='log-with-form facebook'
                        onClick={()=>userAuth.facebookLogin()}>Log In with Facebook</form>
                    <form className='log-with-form google' 
                        onClick={()=>userAuth.googleLogin()} >Log In with Google</form>
                    <form className='log-with-form github'
                        onClick={()=>userAuth.githubLogin()}>Log In with GitHub</form>
                </div>
            </div>
           <FullScreenBtn/>
           <BackBtn actionToDo={()=>{}} pageToBack={'/'} alert={false}/>
        </div>
    )
}

export default LoginForm
