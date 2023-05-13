import React, { useState } from 'react'
import './ForgeButton.scss'

function ForgeButton({checkSkillCard, showCard,setShowCard ,card, addItemShop, setgoldAttuale}) {


    return (
        <button className={`btn-crafting ' + ${checkSkillCard(card) && showCard ? "forge-cursor" : "cross-cursor" }`}
            onClick={()=>{               
                setShowCard(false);
                addItemShop(card);
                setgoldAttuale((n)=>(n + card.gold));
            }}
        />
    )
}

export default ForgeButton