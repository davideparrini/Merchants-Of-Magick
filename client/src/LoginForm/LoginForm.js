import React, { useState } from 'react'
import './LoginForm.scss'

function LoginForm() {
    const[username,setUsername] =useState('');
    const[password,setPassword] = useState('');

    return (
        <div className='LoginForm'>
            <div className='titleLogForm'>Log In</div>
            <div className='loginWrap'>
                <div className='loginContainer'>
                    <div className='label_field_Container'>
                        <label className='labelLogForm'>Username</label>
                        <input className='fieldLogForm' value={username} type='text' onInput={e => setUsername(e.target.value)}/>
                    </div>
                    <div className='label_field_Container'>
                        <label className='labelLogForm'>Password</label>
                        <input className='fieldLogForm' value={password} type='password' onInput={e => setPassword(e.target.value)}></input>
                    </div>
                    <div className='btnLog_SigContainer'>
                        <button className='btnForm btnLogIn'>Log In</button>
                        <button className='btnForm btnSigUp'>Sign Up</button>
                    </div>
                    
                </div>

                <div className='loginDivider'>
                    <div className='bar'/>
                    <div className='loginOr'>OR</div>
                </div>

                <div className='logWithFormContainer'>
                    <form className='logWithForm facebook'>Log In with Facebook</form>
                    <form className='logWithForm google'>Log In with Google</form>
                    <form className='logWithForm github'>Log In with GitHub</form>
                </div>
            </div>
            
        </div>
    )
}

export default LoginForm
