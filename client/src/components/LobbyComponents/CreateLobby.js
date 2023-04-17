import React, { useRef} from 'react'
import './lobbyComponents.css'
import title from './Title.png'

function CreateLobby() {
    const createRoomRef = useRef(null);
    const joinRoomRef = useRef(null );

    function createRoom(){
        const nickname = createRoomRef.current.value;
        console.log(nickname);
    }
    function joinRoom(){
        const idRoom = joinRoomRef.current.value;
        console.log(idRoom);
    }
    return (
    <div>
        <img src={title} className='title'></img>
        <div className='container'> 
        <input 
            className='inputBox nicknameInput' 
            ref={createRoomRef}
            placeholder='Nickname'
            maxLength={12}
        ></input>
        <button className='buttonLobby createRoombtn' onClick={createRoom}>Create Room!</button>
        <input 
            className='inputBox idRoomInput' 
            ref={joinRoomRef}
            placeholder='Ask to your friend idRoom!'
            maxLength={12}
        ></input>
        <button className='buttonLobby joinRoombtn' onClick={joinRoom}>Join Room!</button>

        </div>
        
    </div>
    )
}

export default CreateLobby