import React from 'react'
import './Gold.scss'

const TYPE_GOLD_X_SMALL = 'XSMALL';
const TYPE_GOLD_SMALL = 'SMALL';
const TYPE_GOLD_MEDIUM = 'MEDIUM';
const TYPE_GOLD_BIG = 'BIG';
const TYPE_GOLD_X_BIG = 'XBIG';

function chooseGoldSize(goldSize){
    switch(goldSize){
        case TYPE_GOLD_X_SMALL: return 'x-small-size-gold';
        case TYPE_GOLD_SMALL: return 'small-size-gold';
        case TYPE_GOLD_MEDIUM: return 'medium-size-gold';
        case TYPE_GOLD_BIG: return 'big-size-gold';
        case TYPE_GOLD_X_BIG: return 'x-big-size-gold';
        default: return;
    }
}

function Gold({size,active,value}) {
    return (
        <div className={`gold ${chooseGoldSize(size)} ${active ? '' : 'gold-no-active'}`}>{value}</div>
    )
}

export default Gold