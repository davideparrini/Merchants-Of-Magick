import React, { useState } from 'react'
import './ForgeButton.scss'

function ForgeButton({checkSkillCard, showCard,setShowCard ,card, addItemShop, setgoldAttuale}) {

    const [active, setActive] = useState(true)

    return (
        <button className={`btn-crafting ' + ${checkSkillCard(card) && showCard ? "forge-cursor" : "cross-cursor" }`}
             onClick={()=>{
                if(checkSkillCard(card) && active){ 
                    setShowCard(false);
                    addItemShop(card);
                    setActive(false);
                    setgoldAttuale((n)=>(n + card.gold));
                } 
            }}
        />
    )
}

export default ForgeButton