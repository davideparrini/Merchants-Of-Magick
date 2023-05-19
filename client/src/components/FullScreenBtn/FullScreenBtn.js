import React, { useContext} from 'react'
import './FullScreen.scss'
import { AppContext } from '../../App';

function FullScreenBtn() {

    const{fullScreen, setFullScreen} = useContext(AppContext);

    return (
        <div className={`fullscreen-btn ${fullScreen ? 'off-fullscreen' : 'on-fullscreen'}`} 
            onClick={()=>{
                let e = document.getElementById('app-fullscreen');
                if(!fullScreen){
                    e?.requestFullscreen();
                }
                else{
                    document.exitFullscreen();
                }
                setFullScreen(!fullScreen)}
            }
        />
    )
}

export default FullScreenBtn