
import './App.css';
import CreateLobby from './components/LobbyComponents/CreateLobby';
import './components/LobbyComponents/lobbyComponents.css'
import Skill from './components/Skill/Skill';
import Dice from './components/Dice/Dice';
import CardOrder from './components/Order/CardOrder';
import titleCraftingSkills from './images/craftingSkillTitle.png'
import titleMagicResearch from './images/magicResearchTitle.png'
import ButtonTurnDone from './components/ButtonTurn/ButtonTurn';
import d6img from './images/d6.png'
import d8img from './images/d8.png'
import d10img from './images/d10.png'
import d12img from './images/d12.png'

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





function App() {
    const d6 = 3;
    const d8 = 6;
    const d10 = 9;
    const d12 = 11;

    const [nPotion,setnPotion] = useState(11);


    function incrDice(dice){
        if(nPotion >=0){
            
        }
    }

    function decDice(){
        if(nPotion >=0){

        }
    }

    return (
        <div className="App">   
            
            <div className='extraDices'>Dices</div>
            <div className='diceLabel'>DicesNum</div>

            <img src={d6img} className='diceImg d6img'></img>
            <div className='diceRolled d6'>{d6}</div>
            <button className='incBtn d6' onClick={incrDice}></button>
            <button className='decBtn d6' onClick={decDice}></button>

            <img src={d8img} className='diceImg d8img'></img>
            <div className='diceRolled d8'>{d8}</div>
            <button className='incBtn d8'onClick={incrDice}></button>
            <button className='decBtn d8' onClick={decDice}></button>

            <img src={d10img} className='diceImg d10img'></img>
            <div className='diceRolled d10'>{d10}</div>
            <button className='incBtn d10' onClick={incrDice}></button>
            <button className='decBtn d10' onClick={decDice}></button>

            <img src={d12img} className='diceImg d12img'></img>
            <div className='diceRolled d12'>{d12}</div>
            <button className='incBtn d12' onClick={incrDice}></button>
            <button className='decBtn d12' onClick={decDice}></button>

            <div className='potionLabel'>nPotions</div>
            <ButtonTurnDone></ButtonTurnDone>
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
                <img src={titleCraftingSkills} className='titleCraftingSkills'></img>
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
                <img src={titleMagicResearch}  className='titleMagicResearch'></img>
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
          </div>
    );
}

export default App;
