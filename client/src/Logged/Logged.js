import React, { useEffect} from 'react'
import './Logged.scss'
import { authConfig, auth} from '../Config/authConfig';
import { dbFirestore} from '../Config/firestoreDB';


const LOBBY_STATE = 'LOBBY';



function Logged({setPage,username}) {

    
    return (
        <div className='Logged'>
            <div className='opacity-logged'>
                <div className='bg-img'></div>
                <div className='container-logged'>
                    <div className='title-logged'/>
                    <div className='container-btn-logged'>
                        <button className='logged-btn'
                            onClick={()=>{
                                setPage(LOBBY_STATE);
                        }}>Create New Lobby</button>
                        <button className='logged-btn'
                            onClick={()=>{
                                setPage(LOBBY_STATE);
                        }}>Join A Lobby</button>
                    </div>
                </div>
                <div className='log-out' 
                    onClick={()=>{
                        if(window.confirm('Are you sure to Log Out?')){
                            authConfig.logout();
                        }
                    }}>
                    <label className='log-out-label'>LogOut</label>
                </div>
               
            </div>
            <div className='username-log'>
                <label>Logged as:</label>
                <div className='user-logged'>{username}</div>
            </div>
        </div>
    )
}

export default Logged