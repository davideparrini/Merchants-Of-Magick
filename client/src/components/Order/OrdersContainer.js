import React, { useEffect, useState } from 'react'
import './Order.scss'

function OrdersContainer({order, skillsGained,setNPotion,setFreeUpgrade,setgoldAttuale}) {

    const [nOrderDone,setNOrderDone] = useState(0);
    const [orderDone1,setOrderDone1] = useState(false);
    const [orderDone2,setOrderDone2] = useState(false);
    const [orderDone3,setOrderDone3] = useState(false);

    function checkOrderRequest(request){
        return skillsGained.includes(request) && skillsGained.includes(order.typeOrder);
    }

    
    useEffect(()=>{
        if(checkOrderRequest(order.req1) && !orderDone1) {
            setNOrderDone((n)=>(n+1));
            setOrderDone1(true);
        }
        if(checkOrderRequest(order.req2) && !orderDone2) {
            setNOrderDone((n)=>(n+1));
            setOrderDone2(true);
        }
        if(checkOrderRequest(order.req3) && !orderDone3) {
            setNOrderDone((n)=>(n+1));
            setOrderDone3(true);
        }
    },[skillsGained]);
    

    useEffect(()=>{
        switch(nOrderDone){
            case 1: setNPotion((n)=>(n+3));
                break;
            case 2: setFreeUpgrade((n)=>(n+1));
                break;
            case 3: setFreeUpgrade((n)=>(n+1));
                    setgoldAttuale((n)=>(n + order.gold));
                break;
            default: break;
        }

    },[nOrderDone]);

     
    return (
        <div className='orderCard'>
            <div className='orderTitle'>{order.adventurer}</div>
            <div className ={`orderImg ${order.typeOrder}`}/>
            <div className={`orderGold ${orderDone1 && orderDone2 && orderDone3 ? 'doneOrder':'no-doneOrder'}`}>{order.gold}</div>
            
            <div className={`requestOrder ${orderDone1 ? 'orderDone' : ''}`}>{order.typeOrder +' '+ order.req1}</div>
            <div className={`requestOrder ${orderDone2 ? 'orderDone' : ''}`}>{order.typeOrder +' '+ order.req2}</div>
            <div className={`requestOrder ${orderDone3 ? 'orderDone' : ''}`}>{order.typeOrder +' '+ order.req3}</div>
            <div className={`rewardOrders ${nOrderDone > 0 ? 'orderDone' : ''}`}>-1st Order Completed: Gain 3 potions</div>
            <div className={`rewardOrders ${nOrderDone > 1 ? 'orderDone' : ''}`}>-2st Order Completed: Mark any circle</div>
            <div className={`rewardOrders ${nOrderDone > 2 ? 'orderDone' : ''}`}>-3st Order Completed: Mark any circle and get order gold</div>
        </div>
        
    )
}

export default OrdersContainer