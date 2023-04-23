
import './Game.scss';
import { v4 as uuid } from 'uuid';

import CreateLobby from './components/LobbyComponents/CreateLobby';
import Skill from './components/Skill/Skill';

import Card from './components/Card/Card';
import ButtonTurnDone from './components/ButtonTurn/ButtonTurn';
import Legend from './components/Legend/Legend';

import titleCraftingSkills from './images/craftingSkillTitle.png'
import titleMagicResearch from './images/magicResearchTitle.png'
import titleDiceLeft from './images/diceLeftTitle2.png'
import titleNTurn from './images/turnNTitle.png'

import shopImg from './images/shop.png'
import potionImg from './images/potion4.png'

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
import Container_dice_diceValue from './components/Container_Dice/Container_dice_diceValue';


function Game() {
    
    let shopRef = useRef();
    let skillTableRef = useRef();
    let typeTouchedDiceRef = useRef('d6');



    const [openShop,setOpenShop] = useState(false);
    const [shop,setShop] = useState([]);

   

    const [clockWork,setClockWork] = useState(false);
    const [nPotion,setnPotion] = useState(11);

    const [d6Value,setD6Value]=useState(5);
    const [d8Value,setD8Value]=useState(1);
    const [d10Value,setD10Value]=useState(8);
    const [d12Value,setD12Value]=useState(11);

    const [d6startValue,setD6startValue]=useState(d6Value);
    const [d8startValue,setD8startValue]=useState(d8Value);
    const [d10startValue,setD10startValue]=useState(d10Value);
    const [d12startValue,setD12startValue]=useState(d12Value);

    const [diceTouchedD6 ,setDiceTouchedD6] = useState(false);
    const [diceTouchedD8 ,setDiceToucheD8] = useState(false);
    const [diceTouchedD10 ,setDiceTouchedD10] = useState(false);
    const [diceTouchedD12 ,setDiceTouchedD12] = useState(false);

    const[diceUsedD6,setDiceUsedD6] = useState(false);
    const[diceUsedD8,setDiceUsedD8] = useState(false);
    const[diceUsedD10,setDiceUsedD10] = useState(false);
    const[diceUsedD12,setDiceUsedD12] = useState(false);

    const[attributeUpgraded,setAttributeUpgraded] = useState(true);

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
    const card1 ={item:'crossbow',gold: 5,enchantment: 'fiery' , origin:'of the Dragons'};
    const card2 ={item:'scroll',gold: 3,enchantment: 'everlasting' , origin:'of the Elves'};
    const card3 ={item:'warhammer',gold: 7,enchantment: 'shocking' , origin: 'of the Dwarves'};

    const[showedCard1,setshowedCard1] = useState(true);
    const[showedCard2,setshowedCard2] = useState(true);
    const[showedCard3,setshowedCard3] = useState(true);
    

    
    const nPotion_extraDice4 = 2;
    const nPotion_extraDice5 = 3;
    const nPotion_extraDice6 = 4;
    const time = 10;


    const craftingItemType = ['Accessories','Weapons','Armor']

    const listD6_id_Skills = new Array(1,2,3,4,5,6,7,8,9,10,11,12);
    const listD8_id_Skills = new Array(1,2,3,4,5,7,8,9,11,12,13,14,16,18,20,21,22,24);
    const listD10_id_Skills = new Array(1,3,4,7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24);
    const listD12_id_Skills = new Array(13,15,16,17,18,20,21,23,24);

    const map_id_Skill = new Map();
    map_id_Skill.set(1,backpack);
    map_id_Skill.set(2,scroll);
    map_id_Skill.set(3,ring);
    map_id_Skill.set(4,grimoire);
    map_id_Skill.set(5,staff);
    map_id_Skill.set(6,sword);
    map_id_Skill.set(7,crossbow);
    map_id_Skill.set(8,warhammer);
    map_id_Skill.set(9,bracers);
    map_id_Skill.set(10,helmet);
    map_id_Skill.set(11,greaves);
    map_id_Skill.set(12,plotarmor);
    map_id_Skill.set(13,fiery);
    map_id_Skill.set(14,shocking);
    map_id_Skill.set(15,everlasting);
    map_id_Skill.set(16,divine);
    map_id_Skill.set(17,elves);
    map_id_Skill.set(18,dwarves);
    map_id_Skill.set(19,orcs);
    map_id_Skill.set(20,dragons);
    map_id_Skill.set(21,glamorPotionSupplier);
    map_id_Skill.set(22,renownedAccessories);
    map_id_Skill.set(23,weaponPrestige);
    map_id_Skill.set(24,eliteArmor);


    // const map0 = new Map([
    //     ['a', 1],
    //     ['b', 2],
    //     ['c', 3]
    //   ]);
      
    //   const map1 = new Map(
    //     [...map0]
    //     .filter(([k, v]) => v < 3 )
    //   );

    
    const addItemShop = (card) => {
        const item = {
          id: uuid(),
          card,
        }
        setShop((s) => [...s, item])
      }
    


    function updateStartValueTurnDice(){
        setD6startValue(d6Value);
        setD8startValue(d8Value);
        setD10startValue(d10Value);
        setD12startValue(d12Value);
    }

    function checkAttribute_Dice(typeDice, diceValue, skill){
        let attBool1 = false;
        let attBool2 = false;
        let attBool3 = false;
        
        if(craftingItemType.includes(skill.typeItem) ){
            switch(typeDice){
                case 'd6':{
                    attBool1 = diceValue >= skill.attribute1;
                    attBool2 = diceValue >= skill.attribute2;
                    attBool3 = diceValue >= skill.attribute3;
                }
                    break;  
                case 'd8':{
                    attBool2 = diceValue >= skill.attribute2;
                    attBool3 = diceValue >= skill.attribute3;
                }
                    break;
                case 'd10':{
                    attBool3 = diceValue >= skill.attribute3;
                }
                    break;
                case 'd12':{
                }
                    break;
            }
        }
        else{
            switch(typeDice){
                case 'd6':{
                    attBool1 = diceValue <= skill.attribute1;
                    attBool2 = diceValue <= skill.attribute2;
                    attBool3 = diceValue <= skill.attribute3;
                }
                    break;  
                case 'd8':{
                    attBool1 = diceValue <= skill.attribute1;
                }
                    break;
                case 'd10':{
                    attBool1 = diceValue <= skill.attribute1;
                    attBool2 = diceValue <= skill.attribute2;
                }
                    break;
                case 'd12':{
                    attBool1 = diceValue <= skill.attribute1;
                    attBool2 = diceValue <= skill.attribute2;
                    attBool3 = diceValue <= skill.attribute3;
                }
                    break;
            }
        }
        return {attBool1,attBool2,attBool3};
    }

    function checkDice_Skill(typeDice,diceValue){
        map_id_Skill.forEach()
    }

    function checkSkillCard(card){
        return true;
    }

    
    // function upgradeAttribute(typeDice){
    //     switch(typeDice){
    //         case 'd6':
    //             if(true){
    //                 setnActions((n)=>(n-1));
    //                 setDiceUsedD6(true);
    //                 setAttributeUpgraded(true);
    //             }
    //             break;
    //         case 'd8':
    //             break;
    //         case 'd10':
    //             break;
    //         case 'd12':
    //         break;
    //     }
    // }
    function timer(){
        return 0;
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

    //Skilltable useEffect, se tocco un Dice rimanee attivo fino a che non clicko un altra parte dello schermo che non sia skilltable 
    useEffect(()=>{
        let handlerSkillTable = (e)=>{
            if(!skillTableRef.current.contains(e.target)){
                setDiceTouchedD6(false);
                setDiceToucheD8(false);
                setDiceTouchedD10(false);
                setDiceTouchedD12(false);
            }
            else{
                if(attributeUpgraded){
                    switch(typeTouchedDiceRef.current){
                        case 'd6': 
                            setDiceUsedD6(true);
                            setnActions((n)=>(n-1));
                            break;
                        case 'd8': 
                            setDiceUsedD8(true);
                            setnActions((n)=>(n-1));
                            break;
                        case 'd10': 
                            setDiceUsedD10(true);
                            setnActions((n)=>(n-1));
                        break;
                        case 'd12': 
                            setDiceUsedD12(true);
                            setnActions((n)=>(n-1));
                            break;     
                    }
                    setAttributeUpgraded(false);
                }
            }   
        };
        document.addEventListener("mousedown", handlerSkillTable);

        return() =>{
            document.removeEventListener("mousedown", handlerSkillTable);
          }
    });


    //use
    useEffect(()=>{
        let handlerDiceTouched = (e)=>{
            
        }

    });


    return (
        <div className="Game">   
            
            <div className='timerContainer'><Timer countdown={time}></Timer></div>
            
            <div className='extraDices'>
                <div className={`eDice ed1 ${eDice1 ? 'no-active' : ''}`}></div>
                <div className={`eDice ed2 ${eDice2 ? 'no-active' : ''}`}></div>
                <div className={`eDice ed3 ${eDice3 ? 'no-active' : ''}`}></div>
                <div className={`eDice ed4 ${eDice4 ? 'no-active' : ''}`}><div className='eDicePotion'>{nPotion_extraDice4}</div></div>
                <div className={`eDice ed5 ${eDice5 ? 'no-active' : ''}`}><div className='eDicePotion'>{nPotion_extraDice5}</div></div>
                <div className={`eDice ed6 ${eDice6 ? 'no-active' : ''}`}><div className='eDicePotion'>{nPotion_extraDice6}</div></div>
            </div>

            <img src={titleDiceLeft} alt='DICE LEFT TITLE' className='diceLeftTitle' ></img>
            <div className='diceLeftLabel'>{nActions}</div>

            <img src={titleNTurn} alt='NTURN TITLE' className='nTurnTitle' ></img>
            <div className='nTurnLabel'>{nTurn}</div>


            <div className='containerDices_Potion'>
                <div className='container-potion'>
                    <img src={potionImg} className='potionImg' alt='POTION'></img>
                    <label className='potionLabel'>{nPotion}</label>
                </div>
                <Container_dice_diceValue typeDice={'d6'} nPotion={nPotion} setnPotion={setnPotion} startTurnDiceValue={d6startValue} diceValue={d6Value} setDiceValue={setD6Value} usedDice={diceUsedD6} diceTouched={diceTouchedD6} nActions={nActions} onClickImgHandler={setDiceTouchedD6}></Container_dice_diceValue>
                <Container_dice_diceValue typeDice={'d8'} nPotion={nPotion} setnPotion={setnPotion} startTurnDiceValue={d8startValue} diceValue={d8Value} setDiceValue={setD8Value} usedDice={diceUsedD8} diceTouched={diceTouchedD8} nActions={nActions} onClickImgHandler={setDiceToucheD8}></Container_dice_diceValue>
                <Container_dice_diceValue typeDice={'d10'} nPotion={nPotion} setnPotion={setnPotion} startTurnDiceValue={d10startValue} diceValue={d10Value} setDiceValue={setD10Value} usedDice={diceUsedD10} diceTouched={diceTouchedD10} nActions={nActions} onClickImgHandler={setDiceTouchedD10}></Container_dice_diceValue>
                <Container_dice_diceValue typeDice={'d12'} nPotion={nPotion} setnPotion={setnPotion} startTurnDiceValue={d12startValue} diceValue={d12Value} setDiceValue={setD12Value} usedDice={diceUsedD12} diceTouched={diceTouchedD12} nActions={nActions} onClickImgHandler={setDiceTouchedD12}></Container_dice_diceValue>
            </div>


            <div className='cardContainer'>
                <Card order = {card1} isShowed={showedCard1}></Card>
                <button className='btn-crafting' onClick={()=>{if(checkSkillCard(card1)) setshowedCard1(false) }}></button>
                <Card order = {card2} isShowed={showedCard2} ></Card>
                <button className='btn-crafting' onClick={()=>{if(checkSkillCard(card2)) setshowedCard2(false) }}></button>
                <Card order = {card3} isShowed={showedCard3}></Card>
                <button className='btn-crafting' onClick={()=>{if(checkSkillCard(card3)) setshowedCard3(false) }}></button>
            </div>
            <div className='playerTable'>playerTable</div>
            <div className='quest1'>quest1</div>
            <div className='quest2'>quest2</div>
            <div className='order1'>order1</div>
            <div className='order2'>order2</div>
            <div className='order3'>order3</div>
            <div className='skillsTable' ref={skillTableRef}>
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
            <div className='legend-container'><Legend></Legend></div>
            <button className='btnTurn'></button>

            <div className='shopContainer' ref={shopRef}>
                <img src={shopImg} className='btnShop' alt='SHOP' onClick={()=>setOpenShop(!openShop)}></img>
                <div className={`dropdownShop ${openShop? 'active' : 'inactive'}`}></div>
            </div>
        </div>
    );
}

export default Game;
