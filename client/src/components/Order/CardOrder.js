import React, { useState } from 'react'
import './Order.css'
import warhammer from './image/warhammer.png'

function CardOrder(order) {

    const item = order.item;
    const enchantment = order.enchantment;
    const orgin = order.orgin;
    
    const nameItem = enchantment + item + origin;
    

    return (
        <div className='card'>
            <div className='imgCard'></div>
            
        </div>
    )
}

export default CardOrder