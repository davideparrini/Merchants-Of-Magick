
import './Game.scss';
import { v4 as uuid } from 'uuid';

import CreateLobby from './components/LobbyComponents/CreateLobby';
import Skill from './components/Skill/Skill';
import Dice from './components/Dice/Dice';
import Card from './components/Order/Card';
import ButtonTurnDone from './components/ButtonTurn/ButtonTurn';

import titleCraftingSkills from './images/craftingSkillTitle.png'
import titleMagicResearch from './images/magicResearchTitle.png'
import titleDiceLeft from './images/diceLeftTitle2.png'
import titleNTurn from './images/turnNTitle.png'

import d6img from './images/d6.png'
import d8img from './images/d8.png'
import d10img from './images/d10.png'
import d12img from './images/d12.png'

import shopImg from './images/shop.png'
import potionImg from './images/potion4.png'
import steelImg from './components/Skill/iconsAttribute/steel.png'
import woodImg from './components/Skill/iconsAttribute/wood7.png'
import leatherImg from './components/Skill/iconsAttribute/leather.png'
import elementalImg from './components/Skill/iconsAttribute/elemental.png'
import arcaneImg from './components/Skill/iconsAttribute/arcane.png'
import wildImg from './components/Skill/iconsAttribute/wild.png'

import backpack from './components/Skill/skillsJson/backpack.json'
import scroll from './components/Skill/skillsJson/scroll.json'
import ring from './components/Skill/skillsJson/ring.json'
import grimoire from './components/Skill/skillsJson/grimoire.json'
import staff from './components/Skill/skillsJson/staff.json'
import sword from './components/Skill/skillsJson/sword.json'
import crossbow from './components/Skill/skillsJson/crossbow.json'
import warhammer from './components/Skill/skillsJson/warhammer.json'
import bracers from './components/Skill/skillsJson/bracers.json'
import helmet from './components/Skill/skillsJson/helmet.json'
import greaves from './components/Skill/skillsJson/greaves.json'
import plotarmor from './components/Skill/skillsJson/plotarmor.json'
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

import { useEffect, useRef, useState } from 'react';
import Timer from './components/Timer/Timer';


function Game() {
    
    const mapDice_Skills = new Map();

    const [openShop,setOpenShop] = useState(false);
    const [shop,setShop] = useState([]);

    const [clockWork,setClockWork] = useState(false);
    const [nPotion,setnPotion] = useState(11);

    const [d6,setD6]=useState(5);
    const [d8,setD8]=useState(1);
    const [d10,setD10]=useState(8);
    const [d12,setD12]=useState(11);

    const [d6Start,setD6Start]=useState(d6);
    const [d8Start,setD8Start]=useState(d8);
    const [d10Start,setD10Start]=useState(d10);
    const [d12Start,setD12Start]=useState(d12);

    const [nActions,setnActions] = useState(2);
    const [nTurn,setNTurn] = useState(1);

    const [eDice1,seteDice1] = useState(false);
    const [eDice2,seteDice2] = useState(false);
    const [eDice3,seteDice3] = useState(false);
    const [eDice4,seteDice4] = useState(false);
    const [eDice5,seteDice5] = useState(false);
    const [eDice6,seteDice6] = useState(false);

    // const [card1,setCard1] = useState(null);
    // const [card2,setCard2] = useState(null);
    // const [card3,setCard3] = useState(null);
    const card1 ={item:'crossbow',gold: 5,enchantment: 'divine' , origin:'of the Dragons'};
    const card2 ={item:'plotarmor',gold: 3,enchantment: 'everlasting' , origin:'of the Elves'};
    const card3 ={item:'warhammer',gold: 7,enchantment: 'divine' , origin: 'of the Dwarves'};

    const nPotion_extraDice4 = 2;
    const nPotion_extraDice5 = 3;
    const nPotion_extraDice6 = 4;
    const time = 120;


    let shopRef = useRef();

    const addItemShop = (card) => {
        const item = {
          id: uuid(),
          card,
        }
        setShop((s) => [...s, item])
      }
    
    function updateStartValueTurnDice(){
        setD6Start(d6);
        setD8Start(d8);
        setD10Start(d10);
        setD12Start(d12);
    }

    
    function incrDice6(){
        if(nPotion >0 && d6 < 9){
            setnPotion(nPotion+((d6+1) > d6Start ? -1 : 1));
            setD6(1+d6);
        }
    }

    function decD6(){
        if(nPotion >0 && d6 > 1){
            setnPotion(nPotion+((d6-1) < d6Start ? -1 : 1));
            setD6(d6-1);
        }
    }

    function incrD8(){
        if(nPotion >0 && d8 < 9){
            setnPotion(nPotion+((d8+1) > d8Start ? -1 : 1));
            setD8(1+d8);
        }
    }

    function decD8(){
        if(nPotion >0 && d8 > 1){
            setnPotion(nPotion+((d8-1) < d8Start ? -1 : 1));
            setD8(d8-1);
        }
    }

    function incrD10(){
        if(nPotion >0 && d10 < 10){
            setnPotion(nPotion+((d10+1) > d10Start ? -1 : 1));
            setD10(1+d10);
        }
    }

    function decD10(){
        if(nPotion >0 && d10 > 1){
            setnPotion(nPotion+((d10-1) < d10Start ? -1 : 1));
            setD10(d10-1);
        }
    }

    function incrD12(){
        if(nPotion >0 && d12 < 12){
            setnPotion(nPotion+((d12+1) > d12Start ? -1 : 1));
            setD12(1+d12);
        }
    }

    function decD12(){
        if(nPotion >0 && d12 > 1){
            setnPotion(nPotion+((d12-1) < d12Start ? -1 : 1));
            setD6(d12-1);
        }
    }
    

    
    function timer(){
        return 0;
    }


    function fetchCard(){
    }

    //Shop useEffect
    useEffect(()=>{
        let handlerShop = (e)=>{
            if(!shopRef.current.contains(e.target)){
                setOpenShop(false);
            }   
        };
        document.addEventListener("mousedown", handlerShop);

        return() =>{
            document.removeEventListener("mousedown", handlerShop);
          }
    });


    
    return (
        <div className="Game">   
            
            <img src={potionImg} className='potionImg' alt='POTION'></img>
            <label className='potionLabel'>{nPotion}</label>
            <div className='timerContainer'><Timer countdown={5}></Timer></div>
            <div className='btnTurn' ></div>
            <div className='shopContainer' ref={shopRef}>
                <img src={shopImg} className='btnShop' alt='SHOP' onClick={()=>setOpenShop(!openShop)}></img>
                <div className={`dropdownShop ${openShop? 'active' : 'inactive'}`} >
                </div>
            </div>

            <div className='extraDices'>
                <div className={`eDice ed1 ${eDice1 ? 'used-extra-dice' : ''}`}></div>
                <div className={`eDice ed2 ${eDice2 ? 'used-extra-dice' : ''}`}></div>
                <div className={`eDice ed3 ${eDice3 ? 'used-extra-dice' : ''}`}></div>
                <div className={`eDice ed4 ${eDice4 ? 'used-extra-dice' : ''}`}><div className='eDicePotion'>{nPotion_extraDice4}</div></div>
                <div className={`eDice ed5 ${eDice5 ? 'used-extra-dice' : ''}`}><div className='eDicePotion'>{nPotion_extraDice5}</div></div>
                <div className={`eDice ed6 ${eDice6 ? 'used-extra-dice' : ''}`}><div className='eDicePotion'>{nPotion_extraDice6}</div></div>
            </div>
            <img src={titleDiceLeft} alt='DICE LEFT TITLE' className='diceLeftTitle' ></img>
            <div className='diceLeftLabel'>{nActions}</div>
            <img src={titleNTurn} alt='NTURN TITLE' className='nTurnTitle' ></img>
            <div className='nTurnLabel'>{nTurn}</div>
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
            
            <div className='cardContainer card1'><Card order = {card1}></Card></div>
            <div className='cardContainer card2'><Card order = {card2}></Card></div>
            <div className='cardContainer card3'><Card order = {card3}></Card></div>
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
                <Skill skill = {grimoire}></Skill>                
                <Skill skill = {staff}></Skill> 
                <Skill skill = {sword}></Skill> 
                <Skill skill = {crossbow}></Skill> 
                <Skill skill = {warhammer}></Skill> 
                <Skill skill = {bracers}></Skill> 
                <Skill skill = {helmet}></Skill> 
                <Skill skill = {greaves}></Skill> 
                <Skill skill = {plotarmor}></Skill> 
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
    );
}

export default Game;
