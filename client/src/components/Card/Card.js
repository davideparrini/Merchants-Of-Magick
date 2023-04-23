import React, { useState } from 'react'
import './Card.scss'

function Card({order, isShowed}) {

    const item = order.item;
    const enchantment = order.enchantment != null ? order.enchantment : '';
    const orgin = order.origin != null ? order.origin : '';
    const gold = order.gold;

   

    function orginWrap(){
        switch(orgin){
            case 'of the Elves': return 'elves';
            case 'of the Dwarves': return 'dwarves';
            case 'of the Orcs': return 'orcs';
            case 'of the Dragons': return 'dragons';
           default: return '';
        }
      
    }
    return (
        
        <div>
            <div className='card'>
                <div className={`${isShowed ? "showed" : "no-showed"}`}></div>
                <div className='textCard t1'> {enchantment}</div>
                <div className='textCard t2' >{item}</div>
                <div className='textCard t3'>{orgin}</div>
                <div className='goldItem'>{gold}</div>
                <div className={'imgCard ' + item}></div>
                <div className={'imgEnchantmentsCard ' + enchantment}></div>
                <div className={'imgOriginCard ' + orginWrap()}></div>
            </div>
        </div>
    )
}

export default Card