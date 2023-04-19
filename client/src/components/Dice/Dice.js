import React from 'react'

function Dice({typeDice}) {
    
    return (
    <div className={typeDice}><img src={'./'+typeDice+'.png' }></img> </div>
    )
}

export default Dice