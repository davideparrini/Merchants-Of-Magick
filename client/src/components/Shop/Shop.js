import React, { useEffect, useRef, useState } from 'react'
import './Shop.scss'
import ItemShop from './ItemShop'

function Shop({shop}) {

    const[openShop,setOpenShop] = useState(false);
    //Ref al area dello shop, Close on out-click
    const shopRef = useRef();
    

    //Shop useEffect
    useEffect(()=>{
        let handlerShop = (e)=>{
            if(!shopRef.current.contains(e.target)){
                setOpenShop(false);
            }   
        };
        document.addEventListener("mousedown", handlerShop);

        return() =>{
            document.removeEventListener("mousedown", handlerShop);
          }
    });


    return (
        <div className='shop'> 
            <button  className= 'btn-shop' onClick={()=>setOpenShop(!openShop)} ref={shopRef}/>
            <div className={`boxContainerTitleShop_shop ${openShop? 'activeShop' : 'inactiveShop'}`} ref={shopRef}>
                <div className='titleShop'>Shop</div>
                <div className='dropdown-shop'>
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