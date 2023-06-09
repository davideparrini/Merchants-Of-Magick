import React, { useCallback, useEffect, useState } from 'react'
import './Order.scss'
import Gold from '../Gold/Gold';

const TYPE_GOLD_MEDIUM = 'MEDIUM';

const TYPE_ENCHANTMENT = ['fiery','shocking','everlasting','divine'];

function OrdersContainer({order, setAdventurerQuestDone, skillsGained,setNPotion,setFreeUpgrade,setCurrentGold}) {

    const [nOrderDone,setNOrderDone] = useState(0);
    const [orderDone1,setOrderDone1] = useState(false);
    const [orderDone2,setOrderDone2] = useState(false);
    const [orderDone3,setOrderDone3] = useState(false);
    const [countRewardToGet, setCountRewardToGet] = useState(0);

    const checkOrderRequest = useCallback((request)=>{
        return skillsGained.includes(request) && skillsGained.includes(order.typeOrder);
    },[skillsGained, order.typeOrder]);

    
    const originRightName = useCallback(()=>{
        switch(order.typeOrder){
            case 'of the elves': return 'elves';
            case 'of the dwarves': return 'dwarves';
            case 'of the orcs': return 'orcs';
            case 'of the dragons': return 'dragons';
           default: return order.typeOrder;
        }
    },[order.typeOrder]);


    useEffect(()=>{
        if(checkOrderRequest(order.order1) && !orderDone1) {
            setNOrderDone((n)=>(n+1));
            setCountRewardToGet((n)=>(n+1));
            setOrderDone1(true);
        }
        if(checkOrderRequest(order.order2) && !orderDone2) {
            setNOrderDone((n)=>(n+1));
            setCountRewardToGet((n)=>(n+1));
            setOrderDone2(true);
        }
        if(checkOrderRequest(order.order3) && !orderDone3) {
            setNOrderDone((n)=>(n+1));
            setCountRewardToGet((n)=>(n+1));
            setOrderDone3(true);
        }
    },[skillsGained]);
    

    useEffect(()=>{
        switch(nOrderDone){
            case 1: setNPotion((n)=>(n+5));
                    setCountRewardToGet((n)=>(n-1));
                break;
            case 2: 
                    if(countRewardToGet === 2){
                        setNPotion((n)=>(n+5));
                        setCountRewardToGet((n)=>(n-1));
                    }  
                    setFreeUpgrade((n)=>(n+1));
                    setCountRewardToGet((n)=>(n-1));
                break;
            case 3: 
                    if(countRewardToGet === 3){
                        setNPotion((n)=>(n+5));
                        setFreeUpgrade((n)=>(n+1));
                        setCountRewardToGet((n)=>(n-2));
                    }
                    else if(countRewardToGet === 2){
                        setFreeUpgrade((n)=>(n+1));
                        setCountRewardToGet((n)=>(n-1));
                    }
                    setFreeUpgrade((n)=>(n+1));
                    setCountRewardToGet((n)=>(n-1));
                    setCurrentGold((n)=>(n + order.gold));
                    setAdventurerQuestDone(true);
                break;
            default: break;
        }

    },[nOrderDone]);

     
    return (
        <div className={`order-card ${orderDone1 && orderDone2 && orderDone3 ? 'order-done' : ''}`}>
            <div className='order-title'>{order.adventurer}</div>
            <div className ={`order-img ${originRightName()}`}/>
            <div className='order-gold' >
                <Gold value={order.gold} size={TYPE_GOLD_MEDIUM} active={orderDone1 && orderDone2 && orderDone3}/>
            </div>
            <div className={`request-order ${orderDone1 ? 'req-done' : ''}`}>
                <div className={orderDone1 ? 'bar-order' : ''}/>
                {TYPE_ENCHANTMENT.includes(order.typeOrder) ? order.typeOrder +' '+ order.order1 : order.order1 + ' ' + order.typeOrder}
            </div>
            <div className={`request-order ${orderDone2 ? 'req-done' : ''}`}>
                <div className={orderDone2 ? 'bar-order' : ''}/>
                {TYPE_ENCHANTMENT.includes(order.typeOrder) ? order.typeOrder +' '+ order.order2 : order.order2 + ' ' + order.typeOrder}   
            </div>
            <div className={`request-order ${orderDone3 ? 'req-done' : ''}`}>
                <div className={orderDone3 ? 'bar-order' : ''}/>
                {TYPE_ENCHANTMENT.includes(order.typeOrder) ? order.typeOrder +' '+ order.order3 : order.order3 + ' ' + order.typeOrder}
            </div>
            <div className={`reward-orders ${nOrderDone > 0 ? 'req-done' : ''}`}>-1st Order Completed: Gain 5 potions</div>
            <div className={`reward-orders ${nOrderDone > 1 ? 'req-done' : ''}`}>-2st Order Completed: Mark any circle</div>
            <div className={`reward-orders ${nOrderDone > 2 ? 'req-done' : ''}`}>-3st Order Completed: Mark any circle and get order gold</div>
        </div>
        
    )
}

export default OrdersContainer