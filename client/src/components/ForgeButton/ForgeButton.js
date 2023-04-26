import React, { useState } from 'react'
import './ForgeButton.scss'

function ForgeButton({checkSkillCard, setShowCard ,card, addItemShop}) {



    return (
        <button className={`btn-crafting ' + ${checkSkillCard(card) ? "forge-cursor" : "cross-cursor" }`}
             onClick={()=>{
                if(checkSkillCard(card)){ 
                    setShowCard(false);
                    addItemShop(card);
                } 
            }}
        ></button>
    )
}

export default ForgeButton