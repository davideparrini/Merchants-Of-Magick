import React, { useContext} from 'react'
import { AppContext } from '../App';
import './Home.scss'
import FullScreenBtn from '../components/FullScreenBtn/FullScreenBtn';
function Home() {

    
    const{navigate, SIGN_UP_PAGE, LOGIN_PAGE} = useContext(AppContext);



    return (
        <div className='Home'>
            <div className='img-home'></div>
            <div className='btn-log-sig-up-container'>
                <button className='btn-form btn-log-in' onClick={()=>{ navigate(LOGIN_PAGE)}}>Log In</button>
                <button className='btn-form btn-sign-up' onClick={()=>{navigate(SIGN_UP_PAGE)}}>Sign Up</button>
            </div>
            
            <FullScreenBtn/>
        </div>
    )
}

export default Home