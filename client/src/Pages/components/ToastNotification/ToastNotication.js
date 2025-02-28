import React from 'react'
import './ToastNotification.scss'

function ToastNotication({question,positiveRespose,negativeRespose,handlerPositiveRespose,handlerNegativeRespose,openState,setOpenState}) {

  return (
    <>  
        { openState && (
            <div className='container-toast'>
                <div className='question-toast'>{question}</div>
                <div className='container-btn-toast'>
                <button className='btn-toast positive-btn' onClick={()=>{
                    handlerPositiveRespose();
                    setOpenState(false);
                }}>{positiveRespose}</button>
                <button className='btn-toast negative-btn'onClick={()=>{
                    handlerNegativeRespose();
                    setOpenState(false);
                }}>{negativeRespose}</button>
                </div>
            </div>
        )}
       
    </>
  )
}

export default ToastNotication