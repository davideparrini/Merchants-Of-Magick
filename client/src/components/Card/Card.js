import React from 'react'
import './Card.scss'
import Gold from '../Gold/Gold';

const TYPE_GOLD_SMALL = 'SMALL';
const TYPE_GOLD_MEDIUM = 'MEDIUM';
const TYPE_GOLD_BIG = 'BIG';

function Card({order, isShowed, smallSize}) {
    
    const item = order.item;
    const enchantment = order.enchantment != null ? order.enchantment : '';
    const origin = order.origin != null ? order.origin : '';
    const gold = order.gold;


    function itemWrap(){
        switch(item){
            case 'plate armor': return 'plateArmor';
            default: return item;
        }
      
    }

    function orginWrap(){
        switch(origin){
            case 'of the elves': return 'elves';
            case 'of the dwarves': return 'dwarves';
            case 'of the orcs': return 'orcs';
            case 'of the dragons': return 'dragons';
           default: return '';
        }
    }


    return (
        
        <div className={`card ${smallSize ? "cardSmall": ""} ${isShowed ? "showed" : "no-showed"}`}>
        <div className={`textCard ${smallSize ? "textCardSmall": ''}  t1 ${isShowed ? "" : "no-visible"}`}> {enchantment}</div>
        <div className={`textCard ${smallSize ? 'textCardSmall': ''}  t2 ${isShowed ? "" : "no-visible"}`} >{item}</div>
        <div className={`textCard ${smallSize ? 'textCardSmall': ''}  t3 ${isShowed ? "" : "no-visible"}`}>{origin}</div>
        <div className={`goldContainerCard ${isShowed ? "" : "no-visible"}`}>
            <Gold size={smallSize ?TYPE_GOLD_SMALL : TYPE_GOLD_BIG} active={true} value={gold}/>
        </div>
        <div className={`imgCard ${smallSize ? 'imgCardSmall': ''}  ${itemWrap()}  ${isShowed ? "" : "no-visible"}`}></div>
        <div className={`imgEnchantmentsCard ${smallSize ? 'imgEnchantmentsCardSmall': ''}  ${enchantment}  ${isShowed ? "" : "no-visible"}`}></div>
        <div className={`imgOriginCard ${smallSize ? 'imgOriginCardSmall': ''} ${orginWrap()}  ${isShowed ? "" : "no-visible"}`}></div>
    </div>
    )
}

export default Card