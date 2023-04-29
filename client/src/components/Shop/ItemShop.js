import React from 'react'
import './Shop.scss'

function ItemShop({item}) {
    return (
        <div className='itemShop'>
            {`${item.enchantment =! '' ? item.enchantment + ' ': ''}${item.item + " " + item.origin}`}
            <div className='goldShop'>{item.gold}</div>
        </div>
    )
}

export default ItemShop