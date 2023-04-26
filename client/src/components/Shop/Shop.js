import React,{useState} from 'react'
import './Shop.scss'

function Shop({shop, openShop,setOpenShop}) {

    //lista items dentro lo shop

    return (
        <div className='shop'> 
            <button  className= 'btn-shop' onClick={()=>setOpenShop(!openShop)}/>
            <div className={`boxContainerTitleShop_shop ${openShop? 'activeShop' : 'inactiveShop'}`}>
                <div className='titleShop'>Shop</div>
                <div className={`dropdown-shop`}>
                    <div className='itemContainer'>
                        {shop.map((item,i) => (
                            <div key={i} className='itemShop'>
                                {`${item.enchantment =! '' ? item.enchantment + ' ': ''}${item.item + " " + item.origin}`}
                                <div className='goldShop'>{item.gold}</div>
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>
            
        </div>
    )
}

export default Shop