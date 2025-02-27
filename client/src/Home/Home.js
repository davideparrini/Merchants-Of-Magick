import React, { useContext} from 'react'
import { AppContext } from '../App';
import './Home.scss'
import FullScreenBtn from '../components/FullScreenBtn/FullScreenBtn';
import { connectionHandlerClient } from '../Config/connectionHandler';
function Home() {

    
    const{navigate, SIGN_UP_PAGE, LOGIN_PAGE,
        setStatusOnline,
        setInfoInviterLobby, 
        setOpenToastNotification,
        setLobby,
        setLobbyUpdated, 
        setGameStart, 
        setGameInitState, 
        setGameUpdated, 
        setGameOnNewTurn,
        setGameEndState,
        setGameEnd
    } = useContext(AppContext);



    return (
        <div className='Home'>
            <div className='bg-black-home'/>
            <div className='wrapper-home'>
                <div className='img-home'/>
                <div className='wrapper-right-home'>
                    <div className='wrapper-title'>
                        <div className='title-home'></div>
                        <div className='credit-home'></div>
                    </div>
                    
                    <div className='btn-log-sig-up-container'>
                        <button className='btn-home btn-log-in' onClick={()=>{ 
                            navigate(LOGIN_PAGE);
                             connectionHandlerClient.connect( 
                                                setStatusOnline,
                                                setInfoInviterLobby, 
                                                setOpenToastNotification,
                                                setLobby,
                                                setLobbyUpdated, 
                                                setGameStart, 
                                                setGameInitState, 
                                                setGameUpdated, 
                                                setGameOnNewTurn,
                                                setGameEndState,
                                                setGameEnd
                                            ); 

                        }}>Log In</button>
                        <button className='btn-home btn-sign-up' onClick={()=>{navigate(SIGN_UP_PAGE)}}>Sign Up</button>
                    </div>
                </div>
            </div>
            <div className='crafted-by'/>
            <FullScreenBtn/>
        </div>
        
    )
}

export default Home