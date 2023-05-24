import React, { useEffect, useRef, useState } from 'react'
import './Legend.scss'

import steelImg from '../Skill/iconsAttribute/steel.png'
import woodImg from '../Skill/iconsAttribute/wood7.png'
import leatherImg from '../Skill/iconsAttribute/leather.png'
import elementalImg from '../Skill/iconsAttribute/elemental.png'
import arcaneImg from '../Skill/iconsAttribute/arcane.png'
import wildImg from '../Skill/iconsAttribute/wild.png'
import d6img from '../ContainerDice/d6.png'
import d8img from '../ContainerDice/d8.png'
import d10img from '../ContainerDice/d10.png'
import d12img from '../ContainerDice/d12.png'

function Legend() {

    //Ref al area della legenda, Close on out-click
    let legendRef = useRef();

    //bool openLegend
    const [openLegend,setOpenLegend] = useState(false);


    //Legend useEffect, Close on out-click
    useEffect(()=>{
        let handlerLegend = (e)=>{
  
            if(!legendRef.current.contains(e.target)){
                setOpenLegend(false);
            }   
        };
        document.addEventListener("mousedown", handlerLegend);

        return() =>{
            document.removeEventListener("mousedown", handlerLegend);
          }
    });


    return (
        <div className='Legend' ref={legendRef}>
            <button className='legend-btn' onClick={()=>setOpenLegend(!openLegend)} >L</button>
            <div className={`box-container-legend ${openLegend? 'active-legend' : 'inactive-legend'}`}>
                <div className='title-legend'>Legend</div>
                <div className='legend-attributes'>
                    <div className='row-legend-attribute'>
                        <p className='attribute-legend'>Steel➔</p>
                        <img src={steelImg}  alt='STEEL' className='img-legend img-attribute-legend'></img>
                        <img src={d6img}  alt='D6' className='img-legend dice1-legenda'></img>
                    </div>
                    <div className='row-legend-attribute'>
                        <p className='attribute-legend'>Wood➔</p>
                        <img src={woodImg}  alt='WOOD'  className='img-legend img-attribute-legend'></img>
                        <img src={d6img}  alt='D6' className='img-legend dice1-legenda'></img>
                        <img src={d8img} alt='D8'  className='img-legend dice2-legenda'></img>
                    </div>
                    <div className='row-legend-attribute'>
                        <p className='attribute-legend'>Leather➔</p>
                        <img src={leatherImg}  alt='LEATHER' className='img-legend img-attribute-legend'></img>
                        <img src={d6img}  alt='D6' className='img-legend dice1-legenda'></img>
                        <img src={d8img}  alt='D8'  className='img-legend dice2-legenda'></img>
                        <img src={d10img}  alt='D10'  className='img-legend dice3-legenda'></img>
                    </div>
                    <div className='row-legend-attribute'>
                        <p className='attribute-legend'>Elemental➔</p>
                        <img src={elementalImg}  alt='ELEMENTAL' className='img-legend img-attribute-legend'></img>
                        <img src={d8img}  alt='8'  className='img-legend dice1-legenda'></img>
                        <img src={d10img} alt='D10' className='img-legend dice2-legenda'></img>
                        <img src={d12img}  alt='D12' className='img-legend dice3-legenda'></img>
                    </div>
                    <div className='row-legend-attribute'>
                        <p className='attribute-legend'>Arcane➔</p>
                        <img src={arcaneImg} alt='ARCANE' className='img-legend img-attribute-legend'></img>
                        <img src={d10img} alt='D10' className='img-legend dice2-legenda'></img>
                        <img src={d12img} alt='D12' className='img-legend dice3-legenda'></img>
                    </div> 
                    <div className='row-legend-attribute'>
                        <p className='attribute-legend'>Wild➔</p>
                        <img src={wildImg} alt='WILD' className='img-legend img-attribute-legend'></img>
                        <img src={d12img} alt='D12' className='img-legend dice3-legenda'></img>
                    </div> 
                </div>
                <div className='row-legend-item'>
                    <p className='type-item-legend'>Accessories:</p>
                    <p className='item-legend'>-Backpack</p>
                    <p className='item-legend'>-Scroll</p>
                    <p className='item-legend'>-Ring</p>
                    <p className='item-legend'>-Grimoire</p>
                </div>
                <div className='row-legend-item'>
                    <p className='type-item-legend'>Weapons:</p>
                    <p className='item-legend'>-Staff</p>
                    <p className='item-legend'>-Sword</p>
                    <p className='item-legend'>-Crossbow</p>
                    <p className='item-legend'>-Warhammer</p>
                </div>
                <div className='row-legend-item'>
                    <p className='type-item-legend'>Armor:</p>
                    <p className='item-legend'>-Bracers</p>
                    <p className='item-legend'>-Helmet</p>
                    <p className='item-legend'>-Greaves</p>
                    <p className='item-legend'>-Plate Armor</p>
                </div>
            </div>
        </div>
    )
}

export default Legend