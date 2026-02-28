import React from 'react'

import { userAuth } from '../../../BE/auth';
import './LogOut.css'

function LogOut() {

    return (
        <div className='log-out' 
            onClick={()=>{
                if(window.confirm('Are you sure to Log Out?')){
                    userAuth.logout();
                }
            }}>
            <label className='log-out-label'>LogOut</label>
        </div>  
    )
}

export default LogOut