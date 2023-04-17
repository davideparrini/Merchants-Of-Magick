import React, { useState } from 'react'
import './ButtonTurn'
function ButtonTurnDone() {

  const [text,setText] = useState("Finish turn")

  function handleClick(){
    setText("Turn Done")
  }
  
  return (
    <div className={text==="Finish turn" ? "button-turn not-done" : "button-turn done"} onClick={handleClick}><span>{text}</span></div>
  )
}

export default ButtonTurnDone