/* eslint-disable react/jsx-pascal-case */

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
    
    //Ref al area dello shop, Close on out-click
    let shopRef = useRef();

    //Ref al area dello table, Close on out-click
    let skillTableRef = useRef();

    //Ref per mantenere il dado toccato
    let typeTouchedDiceRef = useRef();

    //Ref per mantenere il valore del dado toccato
    let valueTouchedDiceRed = useRef();

    //bool openShop
    const [openShop,setOpenShop] = useState(false);
    //lista items dentro lo shop
    const [shop,setShop] = useState([]);

   
    //monitor del timer, finito countDown -> true
    const [timerEnd,setTimerEnd] = useState(false);
    
    //durata di un turno
    const countdownTurn = 10;

    //numero pozioni
    const [nPotion,setNPotion] = useState(100);

    //Tipi dado
    const TYPE_D6 = 'd6';
    const TYPE_D8 = 'd8';
    const TYPE_D10 = 'd10';
    const TYPE_D12 = 'd12';

    //valori dei dadi
    const [d6Value,setD6Value]=useState(5);
    const [d8Value,setD8Value]=useState(1);
    const [d10Value,setD10Value]=useState(8);
    const [d12Value,setD12Value]=useState(11);

    //valori dei dadi a inizio turno, utile saperlo per applicare logica funzionamento pozioni
    const [d6startValue,setD6startValue]=useState(d6Value);
    const [d8startValue,setD8startValue]=useState(d8Value);
    const [d10startValue,setD10startValue]=useState(d10Value);
    const [d12startValue,setD12startValue]=useState(d12Value);

    //bool se i dadi sono stati toccati, diceTouched(true) -> focused 
    const [diceTouchedD6 ,setDiceTouchedD6] = useState(false);
    const [diceTouchedD8 ,setDiceTouchedD8] = useState(false);
    const [diceTouchedD10 ,setDiceTouchedD10] = useState(false);
    const [diceTouchedD12 ,setDiceTouchedD12] = useState(false);

    //bool dadi usati, diceUsed(true) -> non più disponibile
    const[diceUsedD6,setDiceUsedD6] = useState(false);
    const[diceUsedD8,setDiceUsedD8] = useState(false);
    const[diceUsedD10,setDiceUsedD10] = useState(false);
    const[diceUsedD12,setDiceUsedD12] = useState(false);

    //bool se un attributo è stato upgradato
    //const[attributeUpgraded,setAttributeUpgraded] = useState(false);

    let attributeUpgradedRef = useRef(false);

    //numero di dadi rimanenti da usare
    const [diceLeft_toUse,setDiceLeft_toUse] = useState(2);
    //numero turno attuale
    const [nTurn,setNTurn] = useState(1);

    //bool extra-dice, eDice(true) -> eDice usato e non più disponibile per tutta la partita
    const [extraDice1,setExtraDice1] = useState(false);
    const [extraDice2,setExtraDice2] = useState(false);
    const [extraDice3,setExtraDice3] = useState(false);
    const [extraDice4,setExtraDice4] = useState(false);
    const [extraDice5,setExtraDice5] = useState(false);
    const [extraDice6,setExtraDice6] = useState(false);
    
    //numero pozioni necessarie per usare gl'eDice
    const nPotion_extraDice4 = 2;
    const nPotion_extraDice5 = 3;
    const nPotion_extraDice6 = 4;
    
    //carte di gioco durante il turno

    const card1 ={item:'crossbow',gold: 5,enchantment: 'fiery' , origin:'of the dragons'};
    const card2 ={item:'scroll',gold: 3,enchantment: 'everlasting' , origin:'of the elves'};
    const card3 ={item:'warhammer',gold: 7,enchantment: 'shocking' , origin: 'of the dwarves'};

    //bool carta girata, showCard(false) -> carta girata
    const[showCard1,setShowCard1] = useState(true);
    const[showCard2,setShowCard2] = useState(true);
    const[showCard3,setShowCard3] = useState(true);
    

    //lista skill acquisite
    const[skillsGained,setSkillsGained] = useState([]);

    
////////////////////////////////////FUCTIONS//////////////////////////////////////////////////////////////////////////////////////

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

    


    function getSkillFromCard(skillGained){
        setSkillsGained((l)=>[...l,skillGained]);
    }
    
    function checkSkillCard(card){
        const hasItemSkill = skillsGained.includes(card.item);
        const hasEnchantmentSkill = card.enchantment == null || card.enchantment === '' ? true : skillsGained.includes(card.origin);
        const hasOriginSkill = card.origin == null || card.origin === '' ? true : skillsGained.includes(card.origin);
        return hasItemSkill && hasEnchantmentSkill && hasOriginSkill ;
    }

    

    function timer(){
        return 0;
    }

    //predicato per vedere se un dado è stato toccato
    function isDiceTouched(){ 
        return typeTouchedDiceRef.current != '';
    }

    //funzione che setta tutti i dadi come non toccati diceTouched -> false
    function setAllDiceNoTouched(){
        setDiceTouchedD6(false);
        setDiceTouchedD8(false)
        setDiceTouchedD10(false);
        setDiceTouchedD12(false);
    }

    function setUpgradeAttributeRef(){
        attributeUpgradedRef.current = true;
    }

    function choose_fun_setDiceUsed(){
        switch(typeTouchedDiceRef.current){
            case TYPE_D6: return setDiceUsedD6;
            case TYPE_D8: return setDiceUsedD8;
            case TYPE_D10: return setDiceUsedD10;
            case TYPE_D12: return setDiceUsedD12;     
            default: return;
        }
    }

    ////////////////////////////////////    USE EFFECT   //////////////////////////////////////////////////////////////

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

    //Skilltable useEffect, se tocco un Dice rimanete attivo fino a che non clicko un altra parte dello schermo che non sia skilltable 
    useEffect(()=>{
        let handlerSkillTable = (e)=>{
            if(!skillTableRef.current.contains(e.target)){
                setAllDiceNoTouched();
                typeTouchedDiceRef.current = "";
                valueTouchedDiceRed.current = null;
                
            }
            // else{
            //     if(attributeUpgradedRef.current){
            //         switch(typeTouchedDiceRef.current){
            //             case TYPE_D6: 
            //                 setDiceUsedD6(true);
            //                 setDiceLeft_toUse((n)=>(n-1));
            //                 break;
            //             case TYPE_D8: 
            //                 setDiceUsedD8(true);
            //                 setDiceLeft_toUse((n)=>(n-1));
            //                 break;
            //             case TYPE_D10: 
            //                 setDiceUsedD10(true);
            //                 setDiceLeft_toUse((n)=>(n-1));
            //             break;
            //             case TYPE_D12: 
            //                 setDiceUsedD12(true);
            //                 setDiceLeft_toUse((n)=>(n-1));
            //                 break;     
            //             default: return;
            //         }
            //         attributeUpgradedRef.current = false;
            //         typeTouchedDiceRef.current = null;
            //         valueTouchedDiceRed.current = null;
            //     }
            // }   
        };
        document.addEventListener("mousedown", handlerSkillTable);

        return() =>{
            document.removeEventListener("mousedown", handlerSkillTable);
          }
    },[typeTouchedDiceRef]);


    //DA SISTEMARE
    // useEffect(()=>{
    //     //setAttributeUpgraded(true);
    //     console.log(nAttribute);  
    // },[nAttribute]);


    return (
        <div className="Game">   
            
            <div className='timerContainer'><Timer countdown={countdownTurn}></Timer></div>
            
            <div className='extraDices'>
                <div className={`eDice ed1 ${extraDice1 ? 'no-active' : ''}`}></div>
                <div className={`eDice ed2 ${extraDice2 ? 'no-active' : ''}`}></div>
                <div className={`eDice ed3 ${extraDice3 ? 'no-active' : ''}`}></div>
                <div className={`eDice ed4 ${extraDice4 ? 'no-active' : ''}`}><div className='eDicePotion'>{nPotion_extraDice4}</div></div>
                <div className={`eDice ed5 ${extraDice5 ? 'no-active' : ''}`}><div className='eDicePotion'>{nPotion_extraDice5}</div></div>
                <div className={`eDice ed6 ${extraDice6 ? 'no-active' : ''}`}><div className='eDicePotion'>{nPotion_extraDice6}</div></div>
            </div>

            <img src={titleDiceLeft} alt='DICE LEFT TITLE' className='diceLeftTitle' ></img>
            <div className='diceLeftLabel'>{diceLeft_toUse}</div>

            <img src={titleNTurn} alt='NTURN TITLE' className='nTurnTitle' ></img>
            <div className='nTurnLabel'>{nTurn}</div>


            <div className='containerDices_Potion'>
                <div className='container-potion'>
                    <img src={potionImg} className='potionImg' alt='POTION'></img>
                    <label className='potionLabel'>{nPotion}</label>
                </div>
                <Container_dice_diceValue 
                    typeDice={TYPE_D6} 
                    nPotion={nPotion} 
                    setnPotion={setNPotion} 
                    startTurnDiceValue={d6startValue} 
                    diceValue={d6Value} 
                    setDiceValue={setD6Value} 
                    usedDice={diceUsedD6} 
                    diceTouched={diceTouchedD6} 
                    nActions={diceLeft_toUse} 
                    onClickImgHandler={()=>{
                        typeTouchedDiceRef.current = TYPE_D6;
                        valueTouchedDiceRed.current = d6Value;
                        setAllDiceNoTouched(); 
                        setDiceTouchedD6(true);
                    }}
                ></Container_dice_diceValue>
                <Container_dice_diceValue 
                    typeDice={TYPE_D8} 
                    nPotion={nPotion} 
                    setnPotion={setNPotion} 
                    startTurnDiceValue={d8startValue} 
                    diceValue={d8Value} 
                    setDiceValue={setD8Value} 
                    usedDice={diceUsedD8} 
                    diceTouched={diceTouchedD8} 
                    nActions={diceLeft_toUse} 
                    onClickImgHandler={()=>{
                        typeTouchedDiceRef.current = TYPE_D8;
                        valueTouchedDiceRed.current = d8Value;
                        setAllDiceNoTouched(); 
                        setDiceTouchedD8(true);
                    }}
                    ></Container_dice_diceValue>
                <Container_dice_diceValue 
                    typeDice={TYPE_D10} 
                    nPotion={nPotion} 
                    setnPotion={setNPotion} 
                    startTurnDiceValue={d10startValue} 
                    diceValue={d10Value} 
                    setDiceValue={setD10Value} 
                    usedDice={diceUsedD10} 
                    diceTouched={diceTouchedD10} 
                    nActions={diceLeft_toUse} 
                    onClickImgHandler={()=>{
                        typeTouchedDiceRef.current = TYPE_D10;
                        valueTouchedDiceRed.current = d10Value;
                        setAllDiceNoTouched(); 
                        setDiceTouchedD10(true);
                    }}
                ></Container_dice_diceValue>
                <Container_dice_diceValue 
                    typeDice={TYPE_D12} 
                    nPotion={nPotion} 
                    setnPotion={setNPotion} 
                    startTurnDiceValue={d12startValue} 
                    diceValue={d12Value} setDiceValue={setD12Value} 
                    usedDice={diceUsedD12} diceTouched={diceTouchedD12} 
                    nActions={diceLeft_toUse} 
                    onClickImgHandler={()=>{
                        typeTouchedDiceRef.current = TYPE_D12;
                        valueTouchedDiceRed.current = d12Value;
                        setAllDiceNoTouched(); 
                        setDiceTouchedD12(true);
                    }}
                ></Container_dice_diceValue>
            </div>


            <div className='cardContainer'>
                <Card order = {card1} 
                    isShowed={showCard1}>
                </Card>
                <button className='btn-crafting' 
                    onClick={()=>{
                        if(checkSkillCard(card1)){
                            setShowCard1(false);
                        }
                    }}
                ></button>
                <Card order = {card2} 
                    isShowed={showCard2} 
                ></Card>
                <button className='btn-crafting' 
                    onClick={()=>{
                        if(checkSkillCard(card2)){ 
                            setShowCard2(false) 
                        }
                    }}
                ></button>
                <Card order = {card3} 
                    isShowed={showCard3}
                ></Card>
                <button className='btn-crafting' 
                    onClick={()=>{
                        if(checkSkillCard(card3)){ 
                            setShowCard3(false)
                        } 
                    }}
                ></button>
            </div>
            <div className='playerTable'>playerTable</div>
            <div className='quest1'>quest1</div>
            <div className='quest2'>quest2</div>
            <div className='order1'>order1</div>
            <div className='order2'>order2</div>
            <div className='order3'>order3</div>
            <div className='skillsTable' ref={skillTableRef}>
                <img src={titleCraftingSkills} alt='CRAFTING SKILLS' className='titleCraftingSkills'></img>
                <Skill skill = {backpack} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {scroll} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {ring} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {grimoire} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill>                
                <Skill skill = {staff} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {sword} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {crossbow} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {warhammer}
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {bracers}
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {helmet} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {greaves} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {plotarmor} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <img src={titleMagicResearch} alt='MACIC RESEARCH SKILLS' className='titleMagicResearch'></img>
                <Skill skill = {fiery} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {shocking} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {everlasting} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {divine} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {elves} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill>
                <Skill skill = {dwarves} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {orcs} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {dragons} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {glamorPotionSupplier} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {renownedAccessories} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {weaponPrestige} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill> 
                <Skill skill = {eliteArmor} 
                    setNPotion={setNPotion}
                    fun_passSkillGained={getSkillFromCard}
                    diceValue={valueTouchedDiceRed.current}
                    typeDice={typeTouchedDiceRef.current}
                    isDiceTouched={isDiceTouched}
                    setDiceLeft_toUse={setDiceLeft_toUse}
                    setDiceUsed={choose_fun_setDiceUsed()}
                ></Skill>  

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
