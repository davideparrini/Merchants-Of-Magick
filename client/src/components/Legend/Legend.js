import React from 'react'
import './Legend.scss'

import steelImg from '../Skill/iconsAttribute/steel.png'
import woodImg from '../Skill/iconsAttribute/wood7.png'
import leatherImg from '../Skill/iconsAttribute/leather.png'
import elementalImg from '../Skill/iconsAttribute/elemental.png'
import arcaneImg from '../Skill/iconsAttribute/arcane.png'
import wildImg from '../Skill/iconsAttribute/wild.png'
import d6img from '../Container_Dice/d6.png'
import d8img from '../Container_Dice/d8.png'
import d10img from '../Container_Dice/d10.png'
import d12img from '../Container_Dice/d12.png'

function Legend() {
  return (
    <div>
        <div className='titleLegenda'>Legend</div>
        <div className='legenda'>
                    <div className='rowLegenda'>
                        <p className='attributeLegenda'>Steel➔</p>
                        <img src={steelImg}  alt='STEEL' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d6img}  alt='D6' className='imgLegenda diceLegenda1'></img>
                    </div>
                    <div className='rowLegenda'>
                        <p className='attributeLegenda'>Wood➔</p>
                        <img src={woodImg}  alt='WOOD'  className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d6img}  alt='D6' className='imgLegenda diceLegenda1'></img>
                        <img src={d8img} alt='D8'  className='imgLegenda diceLegenda2'></img>
                    </div>
                    <div className='rowLegenda'>
                        <p className='attributeLegenda'>Leather➔</p>
                        <img src={leatherImg}  alt='LEATHER' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d6img}  alt='D6' className='imgLegenda diceLegenda1'></img>
                        <img src={d8img}  alt='D8'  className='imgLegenda diceLegenda2'></img>
                        <img src={d10img}  alt='D10'  className='imgLegenda diceLegenda3'></img>
                    </div>
                    <div className='rowLegenda'>
                        <p className='attributeLegenda'>Elemental➔</p>
                        <img src={elementalImg}  alt='ELEMENTAL' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d8img}  alt='8'  className='imgLegenda diceLegenda1'></img>
                        <img src={d10img} alt='D10' className='imgLegenda diceLegenda2'></img>
                        <img src={d12img}  alt='D12' className='imgLegenda diceLegenda3'></img>
                    </div>
                    <div className='rowLegenda'>
                        <p className='attributeLegenda'>Arcane➔</p>
                        <img src={arcaneImg} alt='ARCANE' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d10img} alt='D10' className='imgLegenda diceLegenda2'></img>
                        <img src={d12img} alt='D12' className='imgLegenda diceLegenda3'></img>
                    </div> 
                    <div className='rowLegenda'>
                        <p className='attributeLegenda'>Wild➔</p>
                        <img src={wildImg} alt='WILD' className='imgLegenda imgAttributeLegenda'></img>
                        <img src={d12img} alt='D12' className='imgLegenda diceLegenda3'></img>
                    </div> 
                </div>
            </div>
  )
}

export default Legend