
import './ForgeButton.scss'

function ForgeButton({checkSkillCard, showCard,setShowCard ,card, setCard, addItemShop, setCurrentGold}) {


    return (
        <button className={`btn-crafting ' + ${checkSkillCard(card) && showCard ? "forge-cursor" : "cross-cursor" }`}
            onClick={()=>{    
                if(checkSkillCard(card) && showCard ){
                    setShowCard(false);
                    addItemShop(card);
                    setCurrentGold((n)=>(n + card.gold));
                }           
            }}
        />
    )
}

export default ForgeButton