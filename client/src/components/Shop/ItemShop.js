import React from 'react'
import './Shop.scss'
import Gold from '../Gold/Gold'

const TYPE_GOLD_X_SMALL = 'XSMALL';

function ItemShop({item}) {
    return (
        <div className='itemShop'>
            {`${item.enchantment =! '' ? item.enchantment + ' ': ''}${item.item + " " + item.origin}`}
            <Gold active={true} value={item.gold} size={TYPE_GOLD_X_SMALL}/>
        </div>
    )
}

export default ItemShop