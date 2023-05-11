import React, { useCallback } from 'react'
import './Card.scss'
import Gold from '../Gold/Gold';

const TYPE_GOLD_SMALL = 'SMALL';

const TYPE_GOLD_BIG = 'BIG';

function Card({card, isShowed, smallSize}) {
    

    const itemRightName = useCallback(()=>{
        switch(card.item){
            case 'plate armor': return 'plateArmor';
            default: return card.item;
        }
      
    },[card.item]);

    const originRightName = useCallback(()=>{
        switch(card.origin){
            case 'of the elves': return 'elves';
            case 'of the dwarves': return 'dwarves';
            case 'of the orcs': return 'orcs';
            case 'of the dragons': return 'dragons';
           default: return '';
        }
    },[card.origin]);


    return (
        
        <div className={`card ${smallSize ? "card-small": ""} ${isShowed ? "showed" : "no-showed"}`}>
        <div className={`text-card ${smallSize ? "text-card-small": ''}  t1 ${isShowed ? "" : "no-visible"}`}> {card.enchantment}</div>
        <div className={`text-card ${smallSize ? 'text-card-small': ''}  t2 ${isShowed ? "" : "no-visible"}`} >{card.item}</div>
        <div className={`text-card ${smallSize ? 'text-card-small': ''}  t3 ${isShowed ? "" : "no-visible"}`}>{card.origin}</div>
        <div className={`goldContainerCard ${isShowed ? "" : "no-visible"}`}>
            <Gold size={smallSize ?TYPE_GOLD_SMALL : TYPE_GOLD_BIG} active={true} value={card.gold}/>
        </div>
        <div className={`img-card ${smallSize ? 'img-card-small': ''}  ${itemRightName()}  ${isShowed ? "" : "no-visible"}`}></div>
        <div className={`img-enchantment-card ${smallSize ? 'img-enchantment-card-small': ''}  ${card.enchantment}  ${isShowed ? "" : "no-visible"}`}></div>
        <div className={`img-origin-card ${smallSize ? 'img-origin-card-small': ''} ${originRightName()}  ${isShowed ? "" : "no-visible"}`}></div>
    </div>
    )
}

export default Card