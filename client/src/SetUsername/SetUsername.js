import React, { useContext, useState } from 'react'
import './SetUsername.scss'
import { dbFirestore} from '../Config/firestoreDB';
import { AppContext } from '../App';
import FullScreenBtn from '../components/FullScreenBtn/FullScreenBtn';
import LogOut from '../components/LogOut/LogOut';


function SetUsername() {

    const {userID, setUsername,navigate, LOGGED_PAGE} = useContext(AppContext);
    
    const[nickname,setNickname] = useState('');
    const[validUsername, setValidUsername] = useState(null);

    return (
        <div className='box-set-user-name'>
            <label className='label-set-username'>Username</label>
            <input className={`field-set-username ${validUsername === null ? '' : (validUsername ? 'valid-username' : 'invalid-username')}`} value={nickname} maxLength={15} type='text' 
                    onChange={e =>{
                        dbFirestore.checkUsername(e.target.value).then(b =>{
                            if(b && e.target.value.length >= 4){
                                setValidUsername(true);
                            }
                            else{
                                setValidUsername(false);
                            }
                        })
                        setNickname(e.target.value);
                    }}/>
            <div className={`ico-field-set-username ${validUsername === null ? '' : ( validUsername ? 'ico-valid-username' : 'ico-invalid-username')}`}/>
            <button className={`btn-submit-username ${validUsername ? '' : 'btn-invalid-username'}`} 
                onClick={()=>{
                    if(validUsername){
                        dbFirestore.setUsername(userID, nickname);
                        setUsername(nickname);
                        setNickname('');
                        setValidUsername(null);
                        navigate(LOGGED_PAGE);
                    }
                }}
            >Submit</button>
            <LogOut/>
            <FullScreenBtn/>
        </div>
    )
}

export default SetUsername