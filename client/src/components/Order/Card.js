/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react'
import './Card.css'

function Card() {

    // const item = order.item;
    // const enchantment = order.enchantment != null ? order.enchantment : '';
    // const orgin = order.origin != null ? order.orgin : '';
    const item = 'crossbow';
    const enchantment = 'fiery';
    const orgin = 'of the Elves';
    
    function orginWrap(){
        switch(orgin){
            case 'of the Elves': return 'elves';
            case 'of the Dwavers': return 'dwavers';
            case 'of the Orcs': return 'orcs';
            case 'of the Dragons': return 'dragons';
           default: return '';
        }
      
    }
    return (
        
        <div>
            <div className='card'>
                <div className='textCard t1'> {enchantment}</div>
                <div className='textCard t2' >{item}</div>
                <div className='textCard t3'>{orgin}</div>
                <div className={'imgCard ' + item}></div>
                <div className={'imgEnchantmentsCard ' + enchantment}></div>
                <div className={'imgOriginCard ' + orginWrap()}></div>
            </div>
        </div>
    )
}

export default Card