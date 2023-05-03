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
        
        <div className={`card ${smallSize ? "card-small": ""} ${isShowed ? "showed" : "no-showed"}`}>
        <div className={`text-card ${smallSize ? "text-card-small": ''}  t1 ${isShowed ? "" : "no-visible"}`}> {enchantment}</div>
        <div className={`text-card ${smallSize ? 'text-card-small': ''}  t2 ${isShowed ? "" : "no-visible"}`} >{item}</div>
        <div className={`text-card ${smallSize ? 'text-card-small': ''}  t3 ${isShowed ? "" : "no-visible"}`}>{origin}</div>
        <div className={`goldContainerCard ${isShowed ? "" : "no-visible"}`}>
            <Gold size={smallSize ?TYPE_GOLD_SMALL : TYPE_GOLD_BIG} active={true} value={gold}/>
        </div>
        <div className={`img-card ${smallSize ? 'img-card-small': ''}  ${itemWrap()}  ${isShowed ? "" : "no-visible"}`}></div>
        <div className={`img-enchantment-card ${smallSize ? 'img-enchantment-card-small': ''}  ${enchantment}  ${isShowed ? "" : "no-visible"}`}></div>
        <div className={`img-origin-card ${smallSize ? 'img-origin-card-small': ''} ${orginWrap()}  ${isShowed ? "" : "no-visible"}`}></div>
    </div>
    )
}

export default Card