import React, { useState } from 'react'
import './ForgeButton.scss'

function ForgeButton({checkSkillCard, setShowCard ,card, addItemShop}) {

    const [active, setActive] = useState(true)

    return (
        <button className={`btn-crafting ' + ${checkSkillCard(card) ? "forge-cursor" : "cross-cursor" }`}
             onClick={()=>{
                if(checkSkillCard(card) && active){ 
                    setShowCard(false);
                    addItemShop(card);
                    setActive(false);
                } 
            }}
        />
    )
}

export default ForgeButton