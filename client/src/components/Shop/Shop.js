import React from 'react'
import './Shop.scss'
import ItemShop from './ItemShop'

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
                            <ItemShop item={item} key={i}/>
                        ))}
                    </div>
                    
                </div>
            </div>
            
        </div>
    )
}

export default Shop