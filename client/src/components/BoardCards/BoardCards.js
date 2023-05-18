import React, { useCallback, useEffect, useState } from 'react'
import './BoardCards.scss'

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";


// import required modules
import { EffectCards } from "swiper";
import Card from "../Card/Card";

// const card1={
//     item: 'scroll',
//     gold: 5,
//     enchantment: 'fiery',
//     origin:'of the dragons',
//     inProgress: true
// }

// const card2={
//     item: 'ring',
//     gold: 5,
//     enchantment: 'everlasting',
//     origin:'of the dragons',
//     inProgress: true
// }
// const card3={
//     item: 'sword',
//     gold: 5,
//     enchantment: 'shocking',
//     origin:'of the dragons',
//     inProgress: true
// }
// const boardCards = [card1,card2,card3];

function BoardCards({boardCards, gameRestart}) {

    
    return (
        <div className='board-cards'>
        <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="my-swiper"
        >
            {   boardCards.length > 0 &&
                boardCards.map((c,i)=>(
                    <SwiperSlide className="swiper-slide" key={i}>
                        <div className='container-next-card-BC'>
                            <div className={`${i === 0 ? 'next-card-bc visible' : 'next-card-bc no-visible'}`}>NEXT CARD</div>
                            <Card isShowed={c.inProgress} card={c} smallSize={true}/>
                        </div>
                    </SwiperSlide>
                ))
                
            }
        </Swiper>
        <div className={boardCards.length > 0 ? '' : 'bg-board-cards'}/>
    </div>
    )
}

export default BoardCards