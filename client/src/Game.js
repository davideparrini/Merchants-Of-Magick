/* eslint-disable react/jsx-pascal-case */

import './Game.scss';
import { v4 as uuid } from 'uuid';


import Skill from './components/Skill/Skill';

import Card from './components/Card/Card';

import Legend from './components/Legend/Legend';

import titleCraftingSkills from './images/craftingSkillTitle.png'
import titleMagicResearch from './images/magicResearchTitle.png'
import titleDiceLeft from './images/diceLeftTitle2.png'
import titleNTurn from './images/turnNTitle.png'
import titleExtraDices from './images/extraDicesTitle.png'

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
import ExtraDice from './components/ExtraDice/ExtraDice';
import ForgeButton from './components/ForgeButton/ForgeButton';
import Shop from './components/Shop/Shop';
import ButtonTurnDone from './components/ButtonTurn/ButtonTurn';
import Quest from './components/Quest/Quest';
import OrdersContainer from './components/Order/OrdersContainer';


function Game({}) {

    

    //CONFIGURAZIONI GIOCO

    const DICE_PER_TURN = 2;
    const N_POTION_TEST = 5;
    const TIMER_COUNTDOWN = 10;
    const MAX_N_TURN = 10;

    //SE TEST TRUE SI POSSONO GIOCARE INFINITI DADI
    const testActive = true;


     //lista skills crafting item
     const skillListCraftingItem = [
        backpack,
        scroll,
        ring,
        grimoire,
        staff,
        sword,
        crossbow, 
        warhammer,
        bracers,
        helmet,
        greaves,
        plotarmor
    ]

    //lista skills magic research
    const skillListMagicResearch = [
        fiery,
        shocking,
        everlasting,
        divine,
        elves,
        dwarves, 
        orcs,
        dragons,
        glamorPotionSupplier,
        renownedAccessories ,
        weaponPrestige,
        eliteArmor
    ]

    
    //TEST
    const card1 ={item:'plot armor',gold: 5,enchantment: 'divine' , origin:'of the dragons'};
    const card2 ={item:'crossbow',gold: 3,enchantment: 'everlasting' , origin:'of the elves'};
    const card3 ={item:'warhammer',gold: 7,enchantment: 'shocking' , origin: 'of the dwarves'};
    const card4 ={item:'sword',gold: 7,enchantment: 'fiery' , origin: 'of the orcs'};
    const card5 ={item:'helmet',gold: 7,enchantment: 'fiery' , origin: ''};
    const card6 ={item:'ring',gold: 7,enchantment: 'everlasting' , origin: 'of the dwarves'};

    const quest1 = {attribute:"wood", request: 8,gold : 8};
    const quest2 = {attribute:"elemental", request: 8, gold : 8};
    const order =  {typeOrder:"divine",sponsorName: "Urfrick", req1:"ring", req2: "sword", req3: 'helmet', gold: 5};

    const player1 ={name:"player1", card1: card1,card2: card2,card3: card3};
    const player2 ={name:"player1", card1: card6,card2: card5,card3: card1};
    const player3 ={name:"player1", card1: card3,card2: card4,card3: card2};
    const SKILLS_TEST = ['divine','plot armor','of the dragons'];

    //numero pozioni necessarie per usare gl'eDice
    const nPotion_extraDice1 = 0;
    const nPotion_extraDice2 = 0;
    const nPotion_extraDice3 = 0;
    const nPotion_extraDice4 = 2;
    const nPotion_extraDice5 = 3;
    const nPotion_extraDice6 = 4;
    

    
    //Ref al area dello shop, Close on out-click
    let shopRef = useRef();

    //Ref al area della legenda, Close on out-click
    let legendRef = useRef();

    //Ref al area dello table, Close on out-click
    let skillTableRef = useRef();

    //Ref per mantenere il dado toccato
    let typeTouchedDiceRef = useRef();

    //Ref per mantenere il valore del dado toccato
    let valueTouchedDiceRef = useRef();


    //gold player
    const[goldAttuale,setGoldAttuale] = useState(0);

    //bool openLegend
    const [openLegend,setOpenLegend] = useState(false);

    //bool openShop
    const [openShop,setOpenShop] = useState(false);

    //lista items dentro lo shop
    const [shop,setShop] = useState([]);

   
    //monitor del timer, finito countDown -> true
    const [timerEnd,setTimerEnd] = useState(false);
    
    //durata di un turno
    const countdownTurn = TIMER_COUNTDOWN;

    //numero pozioni
    const [nPotion,setNPotion] = useState(N_POTION_TEST);

    //Tipi dado
    const TYPE_D6 = 'd6';
    const TYPE_D8 = 'd8';
    const TYPE_D10 = 'd10';
    const TYPE_D12 = 'd12';

    //Tipi dado
    const TYPE_EXTRADICE1 = 'ed1';
    const TYPE_EXTRADICE2 = 'ed2';
    const TYPE_EXTRADICE3 = 'ed3';
    const TYPE_EXTRADICE4 = 'ed4';
    const TYPE_EXTRADICE5 = 'ed5';
    const TYPE_EXTRADICE6 = 'ed6';

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

    //numero di dadi rimanenti da usare (variabile incrementabile e decrementabile usando un extra dice(temporanamente), E decrementata ogni volta che usiamo un dado)
    const [nDiceLeft_toUse,setNDiceLeft_toUse] = useState(DICE_PER_TURN);

    //numero dadi che sono possibili giocare nel turno attuale (variabile incrementabile e decrementabile usando  un extra dice(temporanamente))
    const [totalPossibleDice_toUse,setTotalPossibleDice_toUse] = useState(DICE_PER_TURN);

    //numero dadi usati
    const [nDiceLeft_Used,setNDiceLeft_Used] = useState(0);

    //lista di extra-dice usati temporaneamente
    const [extraDiceUsedTempList,setExtraDiceUsedTempList] = useState([]);


    //bool extra-dice, eDice(true) -> eDice usato e non più disponibile per tutta la partita
    const [extraDiceUsed1,setExtraDiceUsed1] = useState(false);
    const [extraDiceUsed2,setExtraDiceUsed2] = useState(false);
    const [extraDiceUsed3,setExtraDiceUsed3] = useState(false);
    const [extraDiceUsed4,setExtraDiceUsed4] = useState(false);
    const [extraDiceUsed5,setExtraDiceUsed5] = useState(false);
    const [extraDiceUsed6,setExtraDiceUsed6] = useState(false);
    
    

    //numero turno attuale
    const [nTurn,setNTurn] = useState(1);


   
    //bool carta girata, showCard(false) -> carta girata
    const[showCard1,setShowCard1] = useState(true);
    const[showCard2,setShowCard2] = useState(true);
    const[showCard3,setShowCard3] = useState(true);
    
    //numero freeUpgrade disponibili
    const [freeUpgrade,setFreeUpgrade] = useState(0);

    
    const typeAttributeQuestCrafting = quest1.attribute;
    const typeAttributeQuestMagicResearch = quest2.attribute;
    const [nAttributeGained_QuestCrafting,setnAttributeGained_QuestCrafting] = useState(0);
    const [nAttributeGained_QuestMagicResearch,setnAttributeGained_QuestMagicResearch] = useState(0);


    //lista skill acquisite
    const[skillsGained,setSkillsGained] = useState(SKILLS_TEST);

    
////////////////////////////////////FUCTIONS//////////////////////////////////////////////////////////////////////////////////////

    const addItemShop = (card) => {
        setShop((s) => [...s, card])
      }
    


    function updateStartValueTurnDice(){
        setD6startValue(d6Value);
        setD8startValue(d8Value);
        setD10startValue(d10Value);
        setD12startValue(d12Value);
    }

    

    //funzione da passare al component child Skill per aggiungere la skill alla lista delle skill del giocatore
    function getSkillGained(skillGained){
        setSkillsGained((l)=>[...l,skillGained]);
    }
    

    //Controllo se il giocatore possiede le skill necessarie per craftare la carta
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
        return typeTouchedDiceRef.current !== '';
    }

    //funzione che setta tutti i dadi come non toccati diceTouched -> false
    function setAllDiceNoTouched(){
        setDiceTouchedD6(false);
        setDiceTouchedD8(false)
        setDiceTouchedD10(false);
        setDiceTouchedD12(false);
    }

    
    //funzione che restituisce la fun per cambiare lo state di DiceUsed relativa al dado toccato
    function choose_fun_setDiceUsed(){
        switch(typeTouchedDiceRef.current){
            case TYPE_D6: return setDiceUsedD6;
            case TYPE_D8: return setDiceUsedD8;
            case TYPE_D10: return setDiceUsedD10;
            case TYPE_D12: return setDiceUsedD12;     
            default: return;
        }
    }


    
// funzione che restituisce la fun per cambiare lo state di DiceUsed relativa al dado toccato
    function choose_fun_setExtraDiceUsed(){
        if(!extraDiceUsed1 && extraDiceUsedTempList.includes(TYPE_EXTRADICE1)) return setExtraDiceUsed1;
        if(!extraDiceUsed2 && extraDiceUsedTempList.includes(TYPE_EXTRADICE2)) return setExtraDiceUsed2;
        if(!extraDiceUsed3 && extraDiceUsedTempList.includes(TYPE_EXTRADICE3)) return setExtraDiceUsed3;
        if(!extraDiceUsed4 && extraDiceUsedTempList.includes(TYPE_EXTRADICE4)) return setExtraDiceUsed4;
        if(!extraDiceUsed5 && extraDiceUsedTempList.includes(TYPE_EXTRADICE5)) return setExtraDiceUsed5;
        if(!extraDiceUsed6 && extraDiceUsedTempList.includes(TYPE_EXTRADICE6)) return setExtraDiceUsed6;
        return null;
    }


    
    //funzione passata al component per la gestione logica del extra-dice
    function onClickHandlerExtraDice(requireNPots,extraDiceUsedTemporarily, definitelyExtraDiceUsed,setExtraDiceUsedTemporarily, setIsPlayble,typeExtraDice){
        //se l extra-dice è usato definitivamente non puoi fare niente
        if(definitelyExtraDiceUsed) return;

        //se l extra-dice non è stato usato (in modo temporaneo) (quindi è utilizzabile/"buono")
        if(!extraDiceUsedTemporarily){
            //controllo che si possano usare massimo 2 extra-dice per turno, in caso lo setto setIsPlayeble a false per far diventare gl'extra dice non usati Unclickable
            if(extraDiceUsedTempList.length >= 2) {
                setIsPlayble(false);
                return;
            }
            // se i req delle pozioni e incremento i dice disponibili, 
            // i dice che al massimo usero in quel turno (non sono la stessa cosa, dice disponibili vengono decrementati quando uso un dado, i totalPossibleDice_toUse no )
            //quindi faccio una serie di incrementi e decrementi per implementare la logica del gioco e metto a true lo stato del diceUsedTemporarily
            if(nPotion >= requireNPots){ 
                setNPotion((n)=>(n-requireNPots));
                setNDiceLeft_toUse((n)=>(n+1));
                setExtraDiceUsedTempList((l)=>[...l,typeExtraDice]);
                setTotalPossibleDice_toUse((n)=>(n+1));
                setExtraDiceUsedTemporarily(true);
            } 
        }
        else{
            //questo controllo evita di avere valori negativi su DiceLeft_toUse
            if(totalPossibleDice_toUse - nDiceLeft_Used > 0){
                setNPotion((n)=>(n+requireNPots));
                setNDiceLeft_toUse((n)=>(n-1));
                setExtraDiceUsedTempList((l)=>l.filter(function(value, index, array){
                    return value !== typeExtraDice;
                }));
                setTotalPossibleDice_toUse((n)=>(n-1));
                setExtraDiceUsedTemporarily(false);
                setIsPlayble(true);

            }
            
        
        }
    }


    function finishTurn(){

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



    //Legend useEffect
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

    //Skilltable useEffect, se tocco un Dice rimanete attivo fino a che non clicko un altra parte dello schermo che non sia skilltable 
    useEffect(()=>{
        let whileDiceTouched = (e)=>{
            if(!skillTableRef.current.contains(e.target)){
                setAllDiceNoTouched();
                typeTouchedDiceRef.current = "";
                valueTouchedDiceRef.current = null;
            }

        };
        document.addEventListener("mousedown", whileDiceTouched);

        return() =>{
            document.removeEventListener("mousedown", whileDiceTouched);
          }
    },[typeTouchedDiceRef]);




////////////////////////////////////////////  RETURN  //////////////////////////////////////////////////////
    return (
        <div className="Game">   
            
            <div className='upperContainer'>
                <div className='containerExtraDices'>
                    <img src={titleExtraDices} alt='EXTRA DICES' className='upperContainerTitles-2' ></img>
                    <div className='extra-dices'>
                        <ExtraDice
                            nPotion_extraDice={nPotion_extraDice1}
                            onClickHandlerExtraDice={onClickHandlerExtraDice}
                            definitelyExtraDiceUsed={extraDiceUsed1}   
                            typeExtraDice={TYPE_EXTRADICE1}        
                        />
                        <ExtraDice
                            nPotion_extraDice={nPotion_extraDice2} 
                            onClickHandlerExtraDice={onClickHandlerExtraDice}
                            definitelyExtraDiceUsed={extraDiceUsed2}     
                            typeExtraDice={TYPE_EXTRADICE2}       
                        />
                        <ExtraDice
                            nPotion_extraDice={nPotion_extraDice3}
                            onClickHandlerExtraDice={onClickHandlerExtraDice}
                            definitelyExtraDiceUsed={extraDiceUsed3}              
                            typeExtraDice={TYPE_EXTRADICE3}             
                        />
                        <ExtraDice
                            nPotion_extraDice={nPotion_extraDice4}
                            onClickHandlerExtraDice={onClickHandlerExtraDice}
                            definitelyExtraDiceUsed={extraDiceUsed4}               
                            typeExtraDice={TYPE_EXTRADICE4}           
                        />
                        <ExtraDice
                            nPotion_extraDice={nPotion_extraDice5}
                            onClickHandlerExtraDice={onClickHandlerExtraDice}
                            definitelyExtraDiceUsed={extraDiceUsed5}           
                            typeExtraDice={TYPE_EXTRADICE5}               
                        ></ExtraDice>
                        <ExtraDice
                            nPotion_extraDice={nPotion_extraDice6}
                            onClickHandlerExtraDice={onClickHandlerExtraDice}
                            definitelyExtraDiceUsed={extraDiceUsed6}         
                            typeExtraDice={TYPE_EXTRADICE6}               
                        />  
                    </div>
                </div>
                
                <div className='containerDiceLeft'>
                    <img src={titleDiceLeft} alt='DICE LEFT TITLE' className='upperContainerTitles' ></img>
                    <div className='dice-left-label'>{nDiceLeft_toUse}</div>
                </div>
                
                <div className='containerTurn'>
                    <img src={titleNTurn} alt='NTURN TITLE' className='upperContainerTitles' ></img>
                    <div className='n-turn-label'>{nTurn +'/'+ MAX_N_TURN}</div>
                </div>
                
                <div className='timer-container'><Timer countdown={countdownTurn}/></div>

            </div>
            <div className='legend-container' ref={legendRef}>
                <button className='legend-btn' onClick={()=>setOpenLegend(!openLegend)}>L</button>
                <Legend openLegend={openLegend}/>
            </div>

            
        
            

            <div className='container-dices-potion'>
                <div className='container-potion'>
                    <img src={potionImg} className='potion-img' alt='POTION'></img>
                    <label className='potion-label'>{nPotion}</label>
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
                    nActions={nDiceLeft_toUse} 
                    onClickImgHandler={()=>{
                        typeTouchedDiceRef.current = TYPE_D6;
                        valueTouchedDiceRef.current = d6Value;
                        setAllDiceNoTouched(); 
                        setDiceTouchedD6(true);
                    }}
                />
                <Container_dice_diceValue 
                    typeDice={TYPE_D8} 
                    nPotion={nPotion} 
                    setnPotion={setNPotion} 
                    startTurnDiceValue={d8startValue} 
                    diceValue={d8Value} 
                    setDiceValue={setD8Value} 
                    usedDice={diceUsedD8} 
                    diceTouched={diceTouchedD8} 
                    nActions={nDiceLeft_toUse} 
                    onClickImgHandler={()=>{
                        typeTouchedDiceRef.current = TYPE_D8;
                        valueTouchedDiceRef.current = d8Value;
                        setAllDiceNoTouched(); 
                        setDiceTouchedD8(true);
                    }}
                />
                <Container_dice_diceValue 
                    typeDice={TYPE_D10} 
                    nPotion={nPotion} 
                    setnPotion={setNPotion} 
                    startTurnDiceValue={d10startValue} 
                    diceValue={d10Value} 
                    setDiceValue={setD10Value} 
                    usedDice={diceUsedD10} 
                    diceTouched={diceTouchedD10} 
                    nActions={nDiceLeft_toUse} 
                    onClickImgHandler={()=>{
                        typeTouchedDiceRef.current = TYPE_D10;
                        valueTouchedDiceRef.current = d10Value;
                        setAllDiceNoTouched(); 
                        setDiceTouchedD10(true);
                    }}
                />
                <Container_dice_diceValue 
                    typeDice={TYPE_D12} 
                    nPotion={nPotion} 
                    setnPotion={setNPotion} 
                    startTurnDiceValue={d12startValue} 
                    diceValue={d12Value} setDiceValue={setD12Value} 
                    usedDice={diceUsedD12} diceTouched={diceTouchedD12} 
                    nActions={nDiceLeft_toUse} 
                    onClickImgHandler={()=>{
                        typeTouchedDiceRef.current = TYPE_D12;
                        valueTouchedDiceRef.current = d12Value;
                        setAllDiceNoTouched(); 
                        setDiceTouchedD12(true);
                    }}
                />
            </div>


            <div className='card-container'>
                <Card order = {card1} 
                    isShowed={showCard1}
                />
                <ForgeButton 
                    checkSkillCard={checkSkillCard}
                    setShowCard={setShowCard1}
                    addItemShop={addItemShop}
                    showCard={showCard1}
                    card={card1}
                    setgoldAttuale={setGoldAttuale}
                />

                <Card order = {card2} 
                    isShowed={showCard2} 
                />
                <ForgeButton 
                    checkSkillCard={checkSkillCard}
                    setShowCard={setShowCard2}
                    addItemShop={addItemShop}
                    showCard={showCard2}
                    card={card2}
                    setgoldAttuale={setGoldAttuale}
                />

                <Card order = {card3} 
                    isShowed={showCard3}
                />
                <ForgeButton 
                    checkSkillCard={checkSkillCard}
                    setShowCard={setShowCard3}
                    addItemShop={addItemShop}
                    showCard={showCard3}
                    card={card3}
                    setgoldAttuale={setGoldAttuale}
                />
            </div>
            <div className='players-table'>

            </div>
           

            <div className='skills-table' ref={skillTableRef}>
                <img src={titleCraftingSkills} alt='CRAFTING SKILLS' className='title-crafting-skills'/>
                {
                   skillListCraftingItem.map((s,i)=>{
                        return (
                            <Skill skill = {s} key={i} 
                                setNPotion={setNPotion}
                                fun_passSkillGained={getSkillGained}
                                valueTouchedDiceRef={valueTouchedDiceRef}
                                typeTouchedDiceRef={typeTouchedDiceRef}
                                isDiceTouched={isDiceTouched}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_Used={setNDiceLeft_Used}
                                setDiceUsed={choose_fun_setDiceUsed()}
                                setAllDicesNoTouched={setAllDiceNoTouched}
                                setExtraDiceUsed={choose_fun_setExtraDiceUsed()}
                                setNAttrQuest1={setnAttributeGained_QuestCrafting}
                                setNAttrQuest2={setnAttributeGained_QuestMagicResearch}
                                typeAttrQuest1={typeAttributeQuestCrafting}
                                typeAttrQuest2={typeAttributeQuestMagicResearch}
                                freeUpgrade={freeUpgrade > 0}
                                setFreeUpgrade={setFreeUpgrade}
                                setgoldAttuale={setGoldAttuale}
                                testActive={testActive}
                            />
                        )
                   }) 
                }
                <img src={titleMagicResearch} alt='MACIC RESEARCH SKILLS' className='title-magic-research'/>
                {
                   skillListMagicResearch.map((s,i)=>{
                        return (
                            <Skill skill = {s} key={i} 
                                setNPotion={setNPotion}
                                fun_passSkillGained={getSkillGained}
                                valueTouchedDiceRef={valueTouchedDiceRef}
                                typeTouchedDiceRef={typeTouchedDiceRef}
                                isDiceTouched={isDiceTouched}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_Used={setNDiceLeft_Used}
                                setDiceUsed={choose_fun_setDiceUsed()}
                                setAllDicesNoTouched={setAllDiceNoTouched}
                                setExtraDiceUsed={choose_fun_setExtraDiceUsed()}
                                setNAttrQuest1={setnAttributeGained_QuestCrafting}
                                setNAttrQuest2={setnAttributeGained_QuestMagicResearch}
                                typeAttrQuest1={typeAttributeQuestCrafting}
                                typeAttrQuest2={typeAttributeQuestMagicResearch}
                                freeUpgrade={freeUpgrade > 0}
                                setFreeUpgrade={setFreeUpgrade}
                                setgoldAttuale={setGoldAttuale}
                                testActive={testActive}
                            />
                        )
                   }) 
                }
            </div>

            <div className={`orderContainer`}>
                <OrdersContainer order={order} skillsGained={skillsGained} setNPotion={setNPotion} setFreeUpgrade={setFreeUpgrade} setgoldAttuale ={setGoldAttuale}/>
            </div>
            <div className='quest'>
                <Quest quest={quest1} progress={nAttributeGained_QuestCrafting} setgoldAttuale={setGoldAttuale}/>
                <Quest quest={quest2} progress={nAttributeGained_QuestMagicResearch} setgoldAttuale={setGoldAttuale}/>
            </div>
            <div className='btn-turn-container'>
                <ButtonTurnDone finishTurn={finishTurn}/>
            </div>
            
            <div className='shop-container' ref={shopRef}>
                <Shop 
                    shop={shop}
                    openShop={openShop}
                    setOpenShop={setOpenShop}
                />
            </div>
        </div>
    );
}

export default Game;
