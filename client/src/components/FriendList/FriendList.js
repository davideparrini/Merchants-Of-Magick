import React from 'react'
import Friend from './Friend'
import './Friend.scss'

function FriendList({friendList}) {
    return (
        <div className='FriendList'>
            <div className='title-friend-list'>Friends</div>
            <div className='friends-container'>
                {
                    friendList.map((f,i)=>(
                        <Friend friend={f} key={i}/>
                    ))
                }
            </div>
        </div>
    )
}

export default FriendList