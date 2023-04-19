
import './Game.css';

import CreateLobby from './components/LobbyComponents/CreateLobby';
import Skill from './components/Skill/Skill';
import Dice from './components/Dice/Dice';
import CardOrder from './components/Order/CardOrder';
import ButtonTurnDone from './components/ButtonTurn/ButtonTurn';

import titleCraftingSkills from './images/craftingSkillTitle.png'
import titleMagicResearch from './images/magicResearchTitle.png'

import d6img from './images/d6.png'
import d8img from './images/d8.png'
import d10img from './images/d10.png'
import d12img from './images/d12.png'

import steelImg from './components/Skill/iconsAttribute/steel.png'
import woodImg from './components/Skill/iconsAttribute/wood7.png'
import leatherImg from './components/Skill/iconsAttribute/leather.png'
import elementalImg from './components/Skill/iconsAttribute/elemental.png'
import arcaneImg from './components/Skill/iconsAttribute/arcane.png'
import wildImg from './components/Skill/iconsAttribute/wild.png'

import backpack from './components/Skill/skillsJson/backpack.json'
import scroll from './components/Skill/skillsJson/scroll.json'
import ring from './components/Skill/skillsJson/ring.json'
import grimore from './components/Skill/skillsJson/grimore.json'
import staff from './components/Skill/skillsJson/staff.json'
import sword from './components/Skill/skillsJson/sword.json'
import crossbow from './components/Skill/skillsJson/crossbow.json'
import warhammer from './components/Skill/skillsJson/warhammer.json'
import bracers from './components/Skill/skillsJson/bracers.json'
import helmet from './components/Skill/skillsJson/helmet.json'
import greaves from './components/Skill/skillsJson/greaves.json'
import plateArmor from './components/Skill/skillsJson/plateArmor.json'
import fiery from './components/Skill/skillsJson/fiery.json'
import shocking from './components/Skill/skillsJson/shocking.json'
import everlasting from './components/Skill/skillsJson/everlasting.json'
import divine from './components/Skill/skillsJson/divine.json'
import elves from './components/Skill/skillsJson/elves.json'
import dwarves from './components/Skill/skillsJson/dwarves.json'
import orcs from './components/Skill/skillsJson/orcs.json'
import dragons from './components/Skill/skillsJson/dragons.json'
import glamorPotionSupplier from './components/Skill/skillsJson/glamorPotionSupplier.json'
import renownedAccessories from './components/Skill/skillsJson/renownedAcc.json'
import weaponPrestige from './components/Skill/skillsJson/weaponPrestige.json'
import eliteArmor from './components/Skill/skillsJson/eliteArmor.json'

import { useState } from 'react';





function Game() {
    const d6es = 3;
    const d8es = 6;
    const d10es = 9;
    const d12es = 11;

    const [nPotion,setnPotion] = useState(11);
    const [d6,setD6]=useState(0);
    const [d8,setD8]=useState(0);
    const [d10,setD10]=useState(0);
    const [d12,setD12]=useState(0);

    function incrDice6(){
        if(nPotion >=0){
            setD6(1+d6);
        }
    }

    function decD6(){
        if(nPotion >=0){
            setD6(d6-1);
        }
    }

    function incrD8(){
        if(nPotion >=0){
            setD8(1+d8);
        }
    }

    function decD8(){
        if(nPotion >=0){
            setD8(d8-1);
        }
    }

    function incrD10(){
        if(nPotion >=0){
            setD10(1+d10);
        }
    }

    function decD10(){
        if(nPotion >=0){
            setD10(d10-1);
        }
    }

    function incrD12(){
        if(nPotion >=0){
            setD12(1+d12);
        }
    }

    function decD12(){
        if(nPotion >=0){
            setD6(d12-1);
        }
    }

    return (
        <div className="Game">   
            
            <div className='extraDices'>Dices</div>
            <div className='diceLabel'>DicesNum</div>

            <img src={d6img} alt='D6' className='diceImg d6img'></img>
            <div className='diceContenitor d6'>
                <div className='diceRolled'>{d6}</div>
                <button className='incBtn' onClick={incrDice6}></button>
                <button className='decBtn' onClick={decD6}></button>
            </div>
            

            <img src={d8img} alt='D8' className='diceImg d8img'></img>
            <div className='diceContenitor d8'>
                <div className='diceRolled'>{d8}</div>
                <button className='incBtn' onClick={incrD8}></button>

                <button className='decBtn' onClick={decD8}></button>
            </div>
            <img src={d10img} alt='D10' className='diceImg d10img'></img>

            <div className='diceContenitor d10'>
                <div className='diceRolled'>{d10}</div>
                <button className='incBtn' onClick={incrD10}></button>
                <button className='decBtn' onClick={decD10}></button>
            </div>

            <img src={d12img} alt='D12' className='diceImg d12img'></img>
            <div className='diceContenitor d12'><div className='diceRolled'>{d12}</div>
                <button className='incBtn' onClick={incrD12}></button>
                <button className='decBtn' onClick={decD12}></button>
            </div>
            
            <div className='potionLabel'>nPotions</div>
            <div className='btnTurn' ></div>
            <div className='btnShop'>btnShop</div>
            <div className='card1'>card1</div>
            <div className='card2'>card2</div>
            <div className='card3'>card3</div>
            <div className='playerTable'>playerTable</div>
            <div className='quest1'>quest1</div>
            <div className='quest2'>quest2</div>
            <div className='order1'>order1</div>
            <div className='order2'>order2</div>
            <div className='order3'>order3</div>
            <div className='skillsTable'>
                <img src={titleCraftingSkills} alt='CRAFTING SKILLS' className='titleCraftingSkills'></img>
                <Skill skill = {backpack}></Skill> 
                <Skill skill = {scroll}></Skill> 
                <Skill skill = {ring}></Skill> 
                <Skill skill = {grimore}></Skill>                
                <Skill skill = {staff}></Skill> 
                <Skill skill = {sword}></Skill> 
                <Skill skill = {crossbow}></Skill> 
                <Skill skill = {warhammer}></Skill> 
                <Skill skill = {bracers}></Skill> 
                <Skill skill = {helmet}></Skill> 
                <Skill skill = {greaves}></Skill> 
                <Skill skill = {plateArmor}></Skill> 
                <img src={titleMagicResearch} alt='MACIC RESEARCH SKILLS' className='titleMagicResearch'></img>
                <Skill skill = {fiery}></Skill> 
                <Skill skill = {shocking}></Skill> 
                <Skill skill = {everlasting}></Skill> 
                <Skill skill = {divine}></Skill> 
                <Skill skill = {elves}></Skill>
                <Skill skill = {dwarves}></Skill> 
                <Skill skill = {orcs}></Skill> 
                <Skill skill = {dragons}></Skill> 
                <Skill skill = {glamorPotionSupplier}></Skill> 
                <Skill skill = {renownedAccessories}></Skill> 
                <Skill skill = {weaponPrestige}></Skill> 
                <Skill skill = {eliteArmor}></Skill>  

            </div>
            <div className='titleLegenda'>Legend</div>
            <div className='legenda'>
                <div className='rowLegenda'>
                    <p className='attributeLegenda'>Steel</p>
                    <img src={steelImg} className='imgLegenda imgAttributeLegenda'></img>
                    <img src={d6img} className='imgLegenda diceLegenda1'></img>
                </div>
                <div className='rowLegenda'>
                    <p className='attributeLegenda'>Wood</p>
                    <img src={woodImg} className='imgLegenda imgAttributeLegenda'></img>
                    <img src={d6img} className='imgLegenda diceLegenda1'></img>
                    <img src={d8img} className='imgLegenda diceLegenda2'></img>
                </div>
                <div className='rowLegenda'>
                    <p className='attributeLegenda'>Leather</p>
                    <img src={leatherImg} className='imgLegenda imgAttributeLegenda'></img>
                    <img src={d6img} className='imgLegenda diceLegenda1'></img>
                    <img src={d8img} className='imgLegenda diceLegenda2'></img>
                    <img src={d10img} className='imgLegenda diceLegenda3'></img>
                </div>
                <div className='rowLegenda'>
                    <p className='attributeLegenda'>Elemental</p>
                    <img src={elementalImg} className='imgLegenda imgAttributeLegenda'></img>
                    <img src={d8img} className='imgLegenda diceLegenda1'></img>
                    <img src={d10img} className='imgLegenda diceLegenda2'></img>
                    <img src={d12img} className='imgLegenda diceLegenda3'></img>
                </div>
                <div className='rowLegenda'>
                    <p className='attributeLegenda'>Arcane</p>
                    <img src={arcaneImg} className='imgLegenda imgAttributeLegenda'></img>
                    <img src={d10img} className='imgLegenda diceLegenda2'></img>
                    <img src={d12img} className='imgLegenda diceLegenda3'></img>
                </div> 
                <div className='rowLegenda'>
                    <p className='attributeLegenda'>Wild</p>
                    <img src={wildImg} className='imgLegenda imgAttributeLegenda'></img>
                    <img src={d12img} className='imgLegenda diceLegenda3'></img>
                </div> 
            
            </div>
          </div>
    );
}

export default Game;
