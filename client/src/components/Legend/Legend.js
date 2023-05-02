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
        <div className='Legend'>
            <button className='legend-btn' onClick={()=>setOpenLegend(!openLegend)}>L</button>
            <div className={`boxContainerLegend ${openLegend? 'activeLegend' : 'inactiveLegend'}`} ref={legendRef}>
                <div className='titleLegenda'>Legend</div>
                <div className='legendaAttribute'>
                    <div className='rowLegendaAttribute'>
                        <p className='attributeLegenda'>Steel➔</p>
                        <img src={steelImg}  alt='STEEL' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d6img}  alt='D6' className='imgLegenda diceLegenda1'></img>
                    </div>
                    <div className='rowLegendaAttribute'>
                        <p className='attributeLegenda'>Wood➔</p>
                        <img src={woodImg}  alt='WOOD'  className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d6img}  alt='D6' className='imgLegenda diceLegenda1'></img>
                        <img src={d8img} alt='D8'  className='imgLegenda diceLegenda2'></img>
                    </div>
                    <div className='rowLegendaAttribute'>
                        <p className='attributeLegenda'>Leather➔</p>
                        <img src={leatherImg}  alt='LEATHER' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d6img}  alt='D6' className='imgLegenda diceLegenda1'></img>
                        <img src={d8img}  alt='D8'  className='imgLegenda diceLegenda2'></img>
                        <img src={d10img}  alt='D10'  className='imgLegenda diceLegenda3'></img>
                    </div>
                    <div className='rowLegendaAttribute'>
                        <p className='attributeLegenda'>Elemental➔</p>
                        <img src={elementalImg}  alt='ELEMENTAL' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d8img}  alt='8'  className='imgLegenda diceLegenda1'></img>
                        <img src={d10img} alt='D10' className='imgLegenda diceLegenda2'></img>
                        <img src={d12img}  alt='D12' className='imgLegenda diceLegenda3'></img>
                    </div>
                    <div className='rowLegendaAttribute'>
                        <p className='attributeLegenda'>Arcane➔</p>
                        <img src={arcaneImg} alt='ARCANE' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d10img} alt='D10' className='imgLegenda diceLegenda2'></img>
                        <img src={d12img} alt='D12' className='imgLegenda diceLegenda3'></img>
                    </div> 
                    <div className='rowLegendaAttribute'>
                        <p className='attributeLegenda'>Wild➔</p>
                        <img src={wildImg} alt='WILD' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d12img} alt='D12' className='imgLegenda diceLegenda3'></img>
                    </div> 
                </div>
                <div className='rowLegendaItem'>
                    <p className='typeItemLegenda'>Accessories:</p>
                    <p className='itemLegenda'>-Backpack</p>
                    <p className='itemLegenda'>-Scroll</p>
                    <p className='itemLegenda'>-Ring</p>
                    <p className='itemLegenda'>-Grimoire</p>
                </div>
                <div className='rowLegendaItem'>
                    <p className='typeItemLegenda'>Weapons:</p>
                    <p className='itemLegenda'>-Staff</p>
                    <p className='itemLegenda'>-Sword</p>
                    <p className='itemLegenda'>-Crossbow</p>
                    <p className='itemLegenda'>-Warhammer</p>
                </div>
                <div className='rowLegendaItem'>
                    <p className='typeItemLegenda'>Armor:</p>
                    <p className='itemLegenda'>-Bracers</p>
                    <p className='itemLegenda'>-Helmet</p>
                    <p className='itemLegenda'>-Greaves</p>
                    <p className='itemLegenda'>-Plate Armor</p>
                </div>
            </div>
        </div>
    )
}

export default Legend