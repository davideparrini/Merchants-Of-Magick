
import './ForgeButton.scss'

function ForgeButton({checkSkillCard, showCard,setShowCard ,card,addItemShop, setCurrentGold,setNPotion}) {


    return (
        <button className={`btn-crafting ' + ${checkSkillCard(card) && showCard ? "forge-cursor" : "cross-cursor" }`}
            onClick={()=>{    
                if(checkSkillCard(card) && showCard ){
                    setShowCard(false);
                    addItemShop(card);
                    setCurrentGold((n)=>(n + card.gold));
                    // setNPotion((n)=>(n+1));
                }           
            }}
        />
    )
}

export default ForgeButton