import React from 'react'
import './Card.scss'

function Card({order, isShowed, smallSize}) {
    
    const item = order.item;
    const enchantment = order.enchantment != null ? order.enchantment : '';
    const origin = order.origin != null ? order.origin : '';
    const gold = order.gold;


    function itemWrap(){
        switch(item){
            case 'plot armor': return 'plotarmor';
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
        // <div className={`card ${isShowed ? "showed" : "no-showed"}`}>
        //     <div className={`textCard t1 ${isShowed ? "" : "no-visible"}`}> {enchantment}</div>
        //     <div className={`textCard t2 ${isShowed ? "" : "no-visible"}`} >{item}</div>
        //     <div className={`textCard t3 ${isShowed ? "" : "no-visible"}`}>{orgin}</div>
        //     <div className={`goldItem ${isShowed ? "" : "no-visible"}`}>{gold}</div>
        //     <div className={`imgCard ${itemWrap()}  ${isShowed ? "" : "no-visible"}`}></div>
        //     <div className={`imgEnchantmentsCard ${enchantment}  ${isShowed ? "" : "no-visible"}`}></div>
        //     <div className={`imgOriginCard ${orginWrap()}  ${isShowed ? "" : "no-visible"}`}></div>
        // </div>
        <div className={`${smallSize ? "cardSmall": "card"} ${isShowed ? "showed" : "no-showed"}`}>
        <div className={`${smallSize ? "textCardSmall": 'textCard'}  t1 ${isShowed ? "" : "no-visible"}`}> {enchantment}</div>
        <div className={`${smallSize ? 'textCardSmall': 'textCard'}  t2 ${isShowed ? "" : "no-visible"}`} >{item}</div>
        <div className={`${smallSize ? 'textCardSmall': 'textCard'}  t3 ${isShowed ? "" : "no-visible"}`}>{origin}</div>
        <div className={`${smallSize ? 'goldItemSmall': 'goldItem'}  ${isShowed ? "" : "no-visible"}`}>{gold}</div>
        <div className={`${smallSize ? 'imgCardSmall': 'imgCard'}  ${itemWrap()}  ${isShowed ? "" : "no-visible"}`}></div>
        <div className={`${smallSize ? 'imgEnchantmentsCardSmall': 'imgEnchantmentsCard'}  ${enchantment}  ${isShowed ? "" : "no-visible"}`}></div>
        <div className={`${smallSize ? 'imgOriginCardSmall': 'imgOriginCard'} ${orginWrap()}  ${isShowed ? "" : "no-visible"}`}></div>
    </div>
    )
}

export default Card