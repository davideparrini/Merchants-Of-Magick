import React, { useEffect, useRef, useState } from 'react'
import './Shop.scss'
import ItemShop from './ItemShop'

const TYPE_ACCESSORIES=['backpack','scroll','ring','grimoire'];
const TYPE_ARMOR=['bracers','helmet','greaves','plate armor'];
const TYPE_WEAPONS=['staff','sword','crossbow','warhammer'];

function Shop({shop}) {

    const[openShop,setOpenShop] = useState(false);
    //Ref al area dello shop, Close on out-click
    const shopRef = useRef();

    const[accessories,setAccessories] = useState([]);
    const[weapons,setWeapons] = useState([]);
    const[armor,setArmor] = useState([]);
    
    //Shop useEffect, closo on click out
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

    //

    useEffect(()=>{
        if(shop.length > 0){
            const newItem = shop.at(shop.length-1);
            if(newItem !== undefined){
                if(TYPE_ACCESSORIES.includes(newItem.item)){
                    setAccessories((l)=>[...l,newItem]);
                }
                if(TYPE_WEAPONS.includes(newItem.item)){
                    setWeapons((l)=>[...l,newItem]);
                }
                if(TYPE_ARMOR.includes(newItem.item)){
                    setArmor((l)=>[...l,newItem]);
                }
            }
        }
        
    },[shop])

    return (
        <div className='shop'> 
            <button  className= 'btn-shop' onClick={()=>setOpenShop(!openShop)} ref={shopRef}/>
            <div className={`box-container-title-shop ${openShop? 'active-shop' : 'inactive-shop'}`} ref={shopRef}>
                <div className='title-shop'>Shop</div>
                <div className='dropdown-shop'>
                    <div className='item-container'>
                        {shop.length > 0 ? <div>
                            <div className='shop-category'>
                                <div className='title-category'>Accessories :</div>
                                {
                                accessories.length > 0 ?
                                    accessories.map((item,i) => (
                                        <ItemShop item={item} key={i}/>
                                    ))
                                : 'No accessories'
                                }
                            </div>
                            <div className='shop-category'>
                                <div className='title-category'>Weapon :</div>
                                {
                                    weapons.length > 0 ?
                                        weapons.map((item,i) => (
                                            <ItemShop item={item} key={i}/>
                                        ))
                                    : 'No weapons'
                                }
                            </div>
                            <div className='shop-category'>
                                <div className='title-category'>Armor :</div>
                                {
                                    armor.length > 0 ?
                                    armor.map((item,i) => (
                                        <ItemShop item={item} key={i}/>
                                    ))
                                    : 'No armor'
                                }
                            </div>
                        </div> 
                        : 'No item in the shop'
                    }</div>
                </div>
            </div>
            
        </div>
    )
}

export default Shop