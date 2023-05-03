import React from 'react'
import './Gold.scss'

const TYPE_GOLD_X_SMALL = 'XSMALL';
const TYPE_GOLD_SMALL = 'SMALL';
const TYPE_GOLD_MEDIUM = 'MEDIUM';
const TYPE_GOLD_BIG = 'BIG';

function chooseGoldSize(goldSize){
    switch(goldSize){
        case TYPE_GOLD_SMALL: return 'smallSizeGold';
        case TYPE_GOLD_MEDIUM: return 'mediumSizeGold';
        case TYPE_GOLD_BIG: return 'bigSizeGold';
        case TYPE_GOLD_X_SMALL: return 'x_smallSizeGold';
        default: return;
    }
}

function Gold({size,active,value}) {
    return (
        <div className={`gold ${chooseGoldSize(size)} ${active ? '' : 'goldNoActive'}`}>{value}</div>
    )
}

export default Gold