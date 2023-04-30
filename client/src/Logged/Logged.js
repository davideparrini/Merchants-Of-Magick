import React from 'react'
import './Logged.scss'

function Logged() {


    return (
        <div className='Logged'>
            <div className='opacityLogged'>
                <div className='bgImg'></div>
                <div className='containerLogged'>
                    <div className='titleLogged'/>
                    <div className='containerBtnLogged'>
                        <button className='loggedBtn'>Create New Lobby</button>
                        <button className='loggedBtn'>Join A Lobby</button>
                    </div>
                </div>
                <div className='logOut'>
                    <label className='logOutLabel'>LogOut</label>
                </div>
               
            </div>
        
        </div>
    )
}

export default Logged