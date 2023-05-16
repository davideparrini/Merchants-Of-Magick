import React, { useState, useEffect, useContext} from 'react'
import { userAuth } from '../Config/auth';
import './LoginForm_SignUp.scss'
import { AppContext } from '../App';


function SignUp() {

    const { userAuthenticated,navigate, SIGN_UP_PAGE, LOGIN_PAGE, LOGGED_PAGE} = useContext(AppContext);

    const[email,setEmail] =useState('');
    const[password,setPassword] = useState('');


    useEffect(()=>{
        if(userAuthenticated){
            navigate(LOGGED_PAGE)
        }
        else{
            navigate(SIGN_UP_PAGE)
        }
    },[userAuthenticated])

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
                            userAuth.signUp(email,password).then((signedUp)=>{
                                if(signedUp){
                                    navigate(LOGGED_PAGE)
                                }
                                else{
                                    alert("Email or password invalid! Email should be an email not an username! Password should be at least 6 characters! ")
                                }
                            })
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
                        onClick={userAuth.googleLogin} >Sign Up with Google</form>
                    <form className='log-with-form github'>Sign Up with GitHub</form>
                </div>
            </div>
            <div className='back-btn' 
                onClick={()=>{navigate(LOGIN_PAGE)}}><label className='back-label'>Back</label>
            </div>
           
        </div>
    )
}

export default SignUp