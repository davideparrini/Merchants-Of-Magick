import React, { useState } from 'react'
import './SetUsername.scss'
import { dbFirestore} from '../Config/firestoreDB';

function SetUsername({openSetUsername,setOpenSetUsername,user, setNickname}) {

    const[username,setUsername] = useState('');
    const[validUsername, setValidUsername] = useState(false);

    return (
        <div className={`box-set-user-name ${openSetUsername ? '': 'no-active-set-username'}`}>
            <label className='label-set-username'>Username</label>
            <input className={`field-set-username ${validUsername ? 'valid-username' : 'invalid-username'}`} value={username} maxLength={15} type='text' 
                    onChange={e =>{

                        dbFirestore.checkUsername(e.target.value).then(b =>{
                            if(b && e.target.value.length >= 4){
                                setValidUsername(true);
                            }
                            else{
                                setValidUsername(false);
                            }
                        })
                        setUsername(e.target.value);
                    }}/>
            <div className={`ico-field-set-username ${validUsername ? 'ico-valid-username' : 'ico-invalid-username'}`}/>
            <button className={`btn-submit-username ${validUsername ? '' : 'btn-invalid-username'}`} 
                onClick={()=>{
                    if(validUsername){
                        dbFirestore.setUsername(user,username);
                        setNickname(username);
                        setOpenSetUsername(false);
                        setUsername('');
                        setValidUsername(false);
                    }
                }}>Submit</button>
        </div>
    )
}

export default SetUsername