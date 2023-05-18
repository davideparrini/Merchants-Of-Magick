
import './Game.scss';


import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Timer from '../components/Timer/Timer';
import ContainerDice from '../components/ContainerDice/ContainerDice'
import ExtraDice from '../components/ExtraDice/ExtraDice';
import ForgeButton from '../components/ForgeButton/ForgeButton';
import Shop from '../components/Shop/Shop';
import ButtonTurnDone from '../components/ButtonTurn/ButtonTurn';
import Quest from '../components/Quest/Quest';
import OrdersContainer from '../components/Order/OrdersContainer';
import BoardPlayers from '../components/BoardPlayers/BoardPlayers';
import ReportBoard from '../components/ReportPlayer/ReportPlayer';
import Exit from '../components/Exit/Exit';
import Skill from '../components/Skill/Skill';
import Card from '../components/Card/Card';
import Legend from '../components/Legend/Legend';

import titleCraftingSkills from './images/craftingSkillTitle2.png'
import titleMagicResearch from './images/magicResearchTitle2.png'
import titleDiceLeft from './images/diceLeftTitle2.png'
import titleNTurn from './images/turnNTitle.png'
import titleExtraDices from './images/extraDicesTitle.png'
import potionImg from './images/potion4.png'

import backpack from '../components/Skill/skillsJson/backpack.json'
import scroll from '../components/Skill/skillsJson/scroll.json'
import ring from '../components/Skill/skillsJson/ring.json'
import grimoire from '../components/Skill/skillsJson/grimoire.json'
import staff from '../components/Skill/skillsJson/staff.json'
import sword from '../components/Skill/skillsJson/sword.json'
import crossbow from '../components/Skill/skillsJson/crossbow.json'
import warhammer from '../components/Skill/skillsJson/warhammer.json'
import bracers from '../components/Skill/skillsJson/bracers.json'
import helmet from '../components/Skill/skillsJson/helmet.json'
import greaves from '../components/Skill/skillsJson/greaves.json'
import platearmor from '../components/Skill/skillsJson/platearmor.json'
import fiery from '../components/Skill/skillsJson/fiery.json'
import shocking from '../components/Skill/skillsJson/shocking.json'
import everlasting from '../components/Skill/skillsJson/everlasting.json'
import divine from '../components/Skill/skillsJson/divine.json'
import elves from '../components/Skill/skillsJson/elves.json'
import dwarves from '../components/Skill/skillsJson/dwarves.json'
import orcs from '../components/Skill/skillsJson/orcs.json'
import dragons from '../components/Skill/skillsJson/dragons.json'
import glamorPotionSupplier from '../components/Skill/skillsJson/glamorPotionSupplier.json'
import renownedAccessories from '../components/Skill/skillsJson/renownedAcc.json'
import weaponPrestige from '../components/Skill/skillsJson/weaponPrestige.json'
import eliteArmor from '../components/Skill/skillsJson/eliteArmor.json'
import { AppContext } from '../App';
import { connectionHandlerClient } from '../Config/connectionHandler';
import BoardCards from '../components/BoardCards/BoardCards';
import Gold from '../components/Gold/Gold';



//SE TEST TRUE SI POSSONO GIOCARE INFINITI DADI
const testActive = true;


const TYPE_GOLD_BIG = 'BIG';

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
    platearmor
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


//numero pozioni necessarie per usare gl'eDice
const nPotion_extraDice1 = 0;
const nPotion_extraDice2 = 0;
const nPotion_extraDice3 = 0;
const nPotion_extraDice4 = 2;
const nPotion_extraDice5 = 3;
const nPotion_extraDice6 = 4;


function Game() {


    const { refreshGame, singlePlayerGame, username, lobby, gameInitState, gameOnNewTurn,setGameOnNewTurn, gameUpdated, setGameUpdated, gameEnd, setGameEnd, WINNER_PAGE, LOGGED_PAGE,navigate } = useContext(AppContext);
    
    

    //Ref al area dello table, Close on out-click
    let skillTableRef = useRef();

    //Ref per mantenere il dado toccato
    let typeTouchedDiceRef = useRef();

    //Ref per mantenere il valore del dado toccato
    let valueTouchedDiceRef = useRef();


    

    //gold player
    const[currentGold,setCurrentGold] = useState(0);


    //numero turno attuale
    const [nTurn,setNTurn] = useState(1);

    const[turnDone, setTurnDone] = useState(false);
    

    const [gameRestart, setGameRestart] = useState(false);


    const [openReport,setOpenReport] = useState(false);

    const[reportSkills, setReportSkills] = useState([]);

    const[reportItems, setReportItems] = useState([]);

    const[reportEndTurn, setReportEndTurn ] = useState([]);

    const[reportTime,setReportTime] = useState(gameInitState.config.reportTime);



    //lista items dentro lo shop
    const [shop,setShop] = useState([]);


    //numero pozioni
    const [nPotion,setNPotion] = useState(gameInitState.config.nPotion);

   
    //valori dei dadi
    const [d6Value,setD6Value] = useState( gameInitState.dices.d6);
    const [d8Value,setD8Value] = useState(gameInitState.dices.d8);
    const [d10Value,setD10Value] = useState(gameInitState.dices.d10);
    const [d12Value,setD12Value] = useState(gameInitState.dices.d12);

    //valori dei dadi a inizio turno, utile saperlo per applicare logica funzionamento pozioni
    const [d6startValue,setD6startValue] = useState(gameInitState.dices.d6);
    const [d8startValue,setD8startValue] = useState(gameInitState.dices.d8);
    const [d10startValue,setD10startValue] = useState(gameInitState.dices.d10);
    const [d12startValue,setD12startValue] = useState(gameInitState.dices.d12);
   

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
    const [nDiceLeft_toUse,setNDiceLeft_toUse] = useState(gameInitState.config.dicePerTurn);

    //numero dadi che sono possibili giocare nel turno attuale (variabile incrementabile e decrementabile usando  un extra dice(temporanamente))
    const [totalPossibleDice_toUse,setTotalPossibleDice_toUse] = useState(gameInitState.config.dicePerTurn);

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


    const [boardListPlayers,setBoardListPlayers] = useState(singlePlayerGame ?  null : gameInitState.players);
    const [boardCards,setBoardListCards] = useState(singlePlayerGame ? gameInitState.cardsBoard :  null);

    const [card1,setCard1] = useState(gameInitState.cards.card1);
    const [card2,setCard2] = useState(gameInitState.cards.card2);
    const [card3,setCard3] = useState(gameInitState.cards.card3);

    //bool carta girata, showCard(false) -> carta girata
    const[showCard1,setShowCard1] = useState(true);
    const[showCard2,setShowCard2] = useState(true);
    const[showCard3,setShowCard3] = useState(true);
    
    //numero freeUpgrade disponibili
    const [freeUpgrade,setFreeUpgrade] = useState(0);


    const [nAttributeGained_QuestCrafting,setnAttributeGained_QuestCrafting] = useState(0);
    const [nAttributeGained_QuestMagicResearch,setnAttributeGained_QuestMagicResearch] = useState(0);
    
    const[quest1Done ,setQuest1Done] = useState(false);
    const[quest2Done ,setQuest2Done] = useState(false);

    const[quest1Reward, setQuest1Reward] = useState(gameInitState.quest1.gold);
    const[quest2Reward, setQuest2Reward] = useState(gameInitState.quest2.gold);

    const[adventurerQuestDone, setAdventurerQuestDone] = useState(false);

    //lista skill acquisite
    const[skillsGained,setSkillsGained] = useState([]);

    const[openScoreSinglePlayer, setOpenScoreSinglePlayer] = useState(false);
    
    
////////////////////////////////////FUCTIONS//////////////////////////////////////////////////////////////////////////////////////

    const addItemShop = (card) => {
        setShop((s) => [...s, card]);
        setReportItems((ri)=>[...ri,(card.enchantment + ' ' + card.item + ' ' + card.origin)])
      }
    
    

    //Controllo se il giocatore possiede le skill necessarie per craftare la carta
    const checkSkillCard = useCallback((card)=>{
        const hasItemSkill = skillsGained.includes(card.item);
        const hasEnchantmentSkill = card.enchantment === '' ? true : skillsGained.includes(card.enchantment);
        const hasOriginSkill = card.origin === '' ? true : skillsGained.includes(card.origin);
        return hasItemSkill && hasEnchantmentSkill && hasOriginSkill ;
    },[skillsGained])


    //predicato per vedere se un dado è stato toccato
    const isDiceTouched = useCallback(()=>{ 
        
        return typeTouchedDiceRef.current !== '';
    },[])
    
    //funzione che setta tutti i dadi come non toccati diceTouched -> false
    const setAllDiceNoTouched = useCallback(()=>{
        
        setDiceTouchedD6(false);
        setDiceTouchedD8(false)
        setDiceTouchedD10(false);
        setDiceTouchedD12(false);
    },[]);

    
    //funzione che restituisce la fun per cambiare lo state di DiceUsed relativa al dado toccato
    const choose_fun_setDiceUsed = useCallback(()=>{
        switch(typeTouchedDiceRef.current){
            case TYPE_D6: return setDiceUsedD6;
            case TYPE_D8: return setDiceUsedD8;
            case TYPE_D10: return setDiceUsedD10;
            case TYPE_D12: return setDiceUsedD12;     
            default: return;
        }
    },[])

    //funzione che setta tutti i dadi come non toccati diceUsed -> false
    const setAllDiceNoUsed= useCallback(()=>{
        setDiceUsedD6(false);
        setDiceUsedD8(false)
        setDiceUsedD10(false);
        setDiceUsedD12(false);
    },[]);
    
    // funzione che restituisce la fun per cambiare lo state di DiceUsed relativa al dado toccato
    const choose_fun_setExtraDiceUsed = useCallback(()=>{
        if(!extraDiceUsed1 && extraDiceUsedTempList.includes(TYPE_EXTRADICE1)) return setExtraDiceUsed1;
        if(!extraDiceUsed2 && extraDiceUsedTempList.includes(TYPE_EXTRADICE2)) return setExtraDiceUsed2;
        if(!extraDiceUsed3 && extraDiceUsedTempList.includes(TYPE_EXTRADICE3)) return setExtraDiceUsed3;
        if(!extraDiceUsed4 && extraDiceUsedTempList.includes(TYPE_EXTRADICE4)) return setExtraDiceUsed4;
        if(!extraDiceUsed5 && extraDiceUsedTempList.includes(TYPE_EXTRADICE5)) return setExtraDiceUsed5;
        if(!extraDiceUsed6 && extraDiceUsedTempList.includes(TYPE_EXTRADICE6)) return setExtraDiceUsed6;
    },[extraDiceUsed1, extraDiceUsed2, extraDiceUsed3, extraDiceUsed4, extraDiceUsed5, extraDiceUsed6, extraDiceUsedTempList])



    const finishTurn = useCallback(()=>{
        if(!turnDone){
            if(!singlePlayerGame){
                if(nTurn < gameInitState.config.nTurn){
                    setTurnDone(true);
                    card1.inProgress = showCard1;
                    card2.inProgress = showCard2;
                    card3.inProgress = showCard3;
                    const playerGameState = {
                        quest1: quest1Done,
                        quest2: quest2Done,
                        cards:{
                            card1: card1,
                            card2: card2,
                            card3: card3
                        },
                        report: {
                            skills: reportSkills, 
                            items: reportItems,
                            quest1: quest1Done,
                            quest2: quest2Done
                        }
                    }
                    connectionHandlerClient.finishTurn(lobby.id, username, playerGameState, (r)=>console.log(r))
                }else{
                    const finalReport = {
                        shop: shop,
                        quest1: quest1Done,
                        quest2: quest2Done,
                        order: adventurerQuestDone,
                        renownedAccessories: skillsGained.includes('renowned accessories'),
                        weaponPrestige: skillsGained.includes('weapon prestige'),
                        eliteArmor: skillsGained.includes('elite armor'),
                        gold: currentGold
                    }
                   connectionHandlerClient.endGame(lobby.id, username, finalReport, (r)=>console.log(r))
                }
            }
            else{
                if(nTurn < gameInitState.config.nTurn){
                    setTurnDone(true);
                    const dataToSend = {
                        cards:{
                            card1: card1,
                            card2: card2,
                            card3: card3
                        },
                        cardsBoard: boardCards
                    }
                    window.navigator.serviceWorker.ready.then( ( registration ) => 'active' in registration && registration.active.postMessage({type:'update-game-single-player', data: dataToSend}));
                    window.navigator.serviceWorker.onmessage = event => {
                        if(event.data && event.data.type === 'update-game-single-player'){
                            console.log("Update single player game")
                            setGameOnNewTurn(event.data.data);
                            setGameUpdated(true);
                        }
                    };
                }
                else{
                    setTurnDone(true);
                    const dataToSend = {
                        currentGold: currentGold,
                        shop: shop,
                        renownedAccessories: skillsGained.includes('renowned accessories'),
                        weaponPrestige: skillsGained.includes('weapon prestige'),
                        eliteArmor: skillsGained.includes('elite armor')
                    }
                    
                    window.navigator.serviceWorker.ready.then( ( registration ) => 'active' in registration && registration.active.postMessage({ type:'end-game-single-player', data: dataToSend} ));
                    window.navigator.serviceWorker.onmessage = event => {
                        
                        if(event.data && event.data.type === 'end-game-single-player'){
                            console.log("End single player game")
                            setCurrentGold(event.data.data);
                            setGameEnd(true);
                            setOpenScoreSinglePlayer(true);
                        }
                    };
                }
            }
            
            
        }
    },[adventurerQuestDone, boardCards, card1, card2, card3, currentGold, gameInitState.config.nTurn, lobby.id, nTurn, quest1Done, quest2Done, reportItems, reportSkills, setGameEnd, setGameOnNewTurn, setGameUpdated, shop, showCard1, showCard2, showCard3, singlePlayerGame, skillsGained, turnDone, username]);

    
    
    //Cambio stato aggiornando il turno, facendo un refresh delle struttere dati
    //seguendo la logica del gioco
    const newTurn = useCallback((newGameState)=>{

        //aumento il turno
        setNTurn((n)=>(n+1));

        //Refresh sul numero di dadi giocabili per turno
        setNDiceLeft_toUse(2);
        setTotalPossibleDice_toUse(2);
        //Refresh sul numero di dadi giocati
        setNDiceLeft_Used(0);
        //Refresh dei dadi -> ora sono tutti giocabili (non grigi/non clickabili)
        setAllDiceNoUsed();

        //Aggiorno il valore dei dati ottenuti dal server
        setD6startValue(newGameState.dices.d6);
        setD8startValue(newGameState.dices.d8);
        setD10startValue(newGameState.dices.d10);
        setD12startValue(newGameState.dices.d12);
        
        setD6Value(newGameState.dices.d6);
        setD8Value(newGameState.dices.d8);
        setD10Value(newGameState.dices.d10);
        setD12Value(newGameState.dices.d12);

        //Check delle quest, se qualcuno ha risolto la quest e te non l hai fatto, dimezza il valore della ricompensa
        if(newGameState.quest1 && !quest1Done){
            setQuest1Reward((n)=>(n/2));
        }
        if(newGameState.quest2 && !quest2Done){
            setQuest2Reward((n)=>(n/2));
        }

        //Cerco il mio index nell'array di tutte le carte , cella array -> mazzo di carte di un giocatore + username
        const indexCardsCurrentPlayer = newGameState.cards.findIndex((p)=> p.username === username );
        const cardsCurrentPlayer = newGameState.cards[indexCardsCurrentPlayer];


        //setto le mie carte 
        setCard1(cardsCurrentPlayer.cards.card1);
        setCard2(cardsCurrentPlayer.cards.card2);
        setCard3(cardsCurrentPlayer.cards.card3);
        setShowCard1(true);
        setShowCard2(true);
        setShowCard3(true);

        if(newGameState.cards.length === 0){
            const finalReport = {
                shop: shop,
                quest1: quest1Done,
                quest2: quest2Done,
                order: adventurerQuestDone,
                renownedAccessories: skillsGained.includes('renowned accessories'),
                weaponPrestige: skillsGained.includes('weapon prestige'),
                eliteArmor: skillsGained.includes('elite armor'),
                gold: currentGold
            }
           return connectionHandlerClient.endGame(lobby.id, username, finalReport, (r)=>console.log(r))
        }
        
        const newBoardPlayer = [];
        let i = indexCardsCurrentPlayer + 1;
        while(i < newGameState.cards.length){
            newBoardPlayer.push(newGameState.cards[i]);
            i++;
        }
        let j = 0;
        while(j < indexCardsCurrentPlayer){
            newBoardPlayer.push(newGameState.cards[j]);
            j++;
        }
        //setto le carte remanenti come carte nella board
        setBoardListPlayers(newBoardPlayer);

        
        //Setto il report di fine turno 
        setReportEndTurn(newGameState.report);
        

        //Refresh strutture dati utili per calcolare il proprio report di fine  turno
        setReportSkills([]);
        setReportItems([]);
        
        //Setto il game come resettato, 
        //in modo da aggiornare alcune strutture dati nested di alcuni child component
        setGameRestart(true);

        //Setto il timer del report di fine turno
        setReportTime(gameInitState.config.reportTime);

        //Apro il report di fine turno
        setOpenReport(true);

    },[quest1Done, quest2Done, username, adventurerQuestDone, skillsGained,shop, currentGold]);



    const newTurnSinglePlayer = useCallback((newGameState)=>{

        //aumento il turno
        setNTurn((n)=>(n+1));

        //Refresh sul numero di dadi giocabili per turno
        setNDiceLeft_toUse(2);
        setTotalPossibleDice_toUse(2);
        //Refresh sul numero di dadi giocati
        setNDiceLeft_Used(0);
        //Refresh dei dadi -> ora sono tutti giocabili (non grigi/non clickabili)
        setAllDiceNoUsed();

        //Aggiorno il valore dei dati ottenuti dal server
        setD6startValue(newGameState.dices.d6);
        setD8startValue(newGameState.dices.d8);
        setD10startValue(newGameState.dices.d10);
        setD12startValue(newGameState.dices.d12);
        
        setD6Value(newGameState.dices.d6);
        setD8Value(newGameState.dices.d8);
        setD10Value(newGameState.dices.d10);
        setD12Value(newGameState.dices.d12);

        
        setCard1(newGameState.cards.card1);
        setCard2(newGameState.cards.card2);
        setCard3(newGameState.cards.card3);
        setShowCard1(true);
        setShowCard2(true);
        setShowCard3(true);

        
        setBoardListCards(newGameState.cardsBoard);

        const report = [{
            username: username,
            report: {
                skills: reportSkills, 
                items: reportItems,
                quest1: quest1Done,
                quest2: quest2Done
            }
        }];

        //Setto il report di fine turno 
        setReportEndTurn(report);
        //Refresh strutture dati utili per calcolare il proprio report di fine  turno
        setReportSkills([]);
        setReportItems([]);
        
        //Setto il game come resettato, 
        //in modo da aggiornare alcune strutture dati nested di alcuni child component
        setGameRestart(true);

        //Setto il timer del report di fine turno
        setReportTime(gameInitState.config.reportTime);

        //Apro il report di fine turno
        setOpenReport(true);

    },[ quest1Done, quest2Done, reportItems, reportSkills, username])

    ////////////////////////////////////    USE EFFECT   //////////////////////////////////////////////////////////////


    

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


    useEffect(()=>{
        if(turnDone && gameUpdated){
            if(singlePlayerGame){
                newTurnSinglePlayer(gameOnNewTurn);
            }
            else{
                newTurn(gameOnNewTurn);
            }
            
            setGameUpdated(false);
        }
    },[turnDone, gameUpdated])


    useEffect(()=>{
        if(gameEnd){
            if(!singlePlayerGame){
                navigate(`${WINNER_PAGE}/${lobby.id}`);
            }else{
                setOpenScoreSinglePlayer(true);
            }
        }
    },[gameEnd]);


   
////////////////////////////////////////////  RETURN  //////////////////////////////////////////////////////
    return (
        <div className='Game'>
            <Exit/>
            {
                singlePlayerGame && openScoreSinglePlayer &&
                    (
                        <div className='score-end-game'>
                            <div className='container-gold-score'>
                                Your score:
                                <Gold value={currentGold} size={TYPE_GOLD_BIG} active={true}/>
                            </div>
                            <button className='btn-score-end-game' onClick={()=>{
                                navigate(LOGGED_PAGE);
                                refreshGame();
                            }}>New Game</button>
                        </div>
                    ) 
                 
                
            }
            <ReportBoard reports={reportEndTurn} setReports={setReportEndTurn} endTurn={openReport} setEndTurn={setOpenReport} setGameRestart={setGameRestart} setTurnDone={setTurnDone} reportTime={reportTime} setReportTime={setReportTime}/>
            <div className={`game-container ${turnDone  ? 'wait-state-game' :''}`}>   
                <div className='upper-container'>
                    <div className='container-extra-dices'>
                        <img src={titleExtraDices} alt='EXTRA DICES' className='upper-container-titles-extra-dices' ></img>
                        <div className='extra-dices'>
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice1}
                                nPotion={nPotion}
                                setNPotion={setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={extraDiceUsed1}   
                                typeExtraDice={TYPE_EXTRADICE1}        
                                gameRestart={gameRestart}
                            />
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice2} 
                                nPotion={nPotion}
                                setNPotion={setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={extraDiceUsed2}     
                                typeExtraDice={TYPE_EXTRADICE2}      
                                gameRestart={gameRestart} 
                            />
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice3}
                                nPotion={nPotion}
                                setNPotion={setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={extraDiceUsed3}              
                                typeExtraDice={TYPE_EXTRADICE3}    
                                gameRestart={gameRestart}         
                            />
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice4}
                                nPotion={nPotion}
                                setNPotion={setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={extraDiceUsed4}               
                                typeExtraDice={TYPE_EXTRADICE4}  
                                gameRestart={gameRestart}        
                            />
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice5}
                                nPotion={nPotion}
                                setNPotion={setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={extraDiceUsed5}           
                                typeExtraDice={TYPE_EXTRADICE5}          
                                gameRestart={gameRestart}     
                            ></ExtraDice>
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice6}
                                nPotion={nPotion}
                                setNPotion={setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={extraDiceUsed6}         
                                typeExtraDice={TYPE_EXTRADICE6}  
                                gameRestart={gameRestart}
                            />  
                        </div>
                    </div>
                    
                    <div className='container-dice-left'>
                        <img src={titleDiceLeft} alt='DICE LEFT TITLE' className='upper-container-titles'></img>
                        <div className='dice-left-label'>{nDiceLeft_toUse}</div>
                    </div>
                    
                    <div className='container-turn'>
                        <img src={titleNTurn} alt='NTURN TITLE' className='upper-container-titles' ></img>
                        <div className='n-turn-label'>{nTurn +'/'+ gameInitState.config.nTurn}</div>
                    </div>
                    
                    <div className='timer-container'><Timer timerCountdown={gameInitState.config.countdown} finishTurn={finishTurn} turnDone={turnDone} gameRestart={gameRestart}/></div>

                </div>
                <div className='legend-container'><Legend/></div>
                <div className='container-dices-potion'>
                    <div className='container-potion'>
                        <img src={potionImg} className='potion-img' alt='POTION'></img>
                        <label className='potion-label'>{nPotion}</label>
                    </div>
                    <ContainerDice 
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
                    <ContainerDice 
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
                    <ContainerDice 
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
                    <ContainerDice 
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
                    <div>
                        <Card card = {card1} 
                            isShowed={showCard1}
                            smallSize={false}
                        />
                        <div className='card1-going-away' >OUTGOING</div>
                    </div>
                    <ForgeButton 
                        checkSkillCard={checkSkillCard}
                        setShowCard={setShowCard1}
                        addItemShop={addItemShop}
                        showCard={showCard1}
                        card={card1}
                        setCurrentGold={setCurrentGold}
                    />

                    <Card card = {card2} 
                        isShowed={showCard2} 
                        smallSize={false}
                    />
                    <ForgeButton 
                        checkSkillCard={checkSkillCard}
                        setShowCard={setShowCard2}
                        addItemShop={addItemShop}
                        showCard={showCard2}
                        card={card2}
                        setCurrentGold={setCurrentGold}
                    />

                    <Card card = {card3} 
                        isShowed={showCard3}
                        smallSize={false}
                    />
                    <ForgeButton 
                        checkSkillCard={checkSkillCard}
                        setShowCard={setShowCard3}
                        addItemShop={addItemShop}
                        showCard={showCard3}
                        card={card3}
                        setCurrentGold={setCurrentGold}
                    />
                </div>
                {
                    (!singlePlayerGame) ? (
                        <div className='players-table'>
                            <BoardPlayers boardListPlayers={boardListPlayers} gameRestart={gameRestart} />
                        </div>
                    )
                    : (
                        <div  className='players-table'>
                            <BoardCards boardCards={boardCards}  gameRestart={gameRestart} />
                        </div>
                    )
                }
                
            

                <div className='skills-table' ref={skillTableRef}>
                    <div className='container-title-skills'>
                        <img src={titleCraftingSkills} alt='CRAFTING SKILLS' className='title-skills'/>
                        <div className='skills-container'>
                            {
                            skillListCraftingItem.map((s,i)=>{
                                    return (
                                        <Skill skill = {s} key={i} 
                                            setNPotion={setNPotion}
                                            setSkillsGained={setSkillsGained}
                                            setReportSkills={setReportSkills}
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
                                            typeAttrQuest1={gameInitState.quest1.attribute}
                                            typeAttrQuest2={gameInitState.quest2.attribute}
                                            freeUpgrade={freeUpgrade > 0}
                                            setFreeUpgrade={setFreeUpgrade}
                                            setCurrentGold={setCurrentGold}
                                            testActive={testActive}
                                        />
                                    )
                            })}
                        </div>
                        

                    </div>
                    <div className='container-title-skills'>
                        <img src={titleMagicResearch} alt='MACIC RESEARCH SKILLS' className='title-skills'/>
                        <div className='skills-container'>
                            {
                            skillListMagicResearch.map((s,i)=>{
                                    return (
                                        <Skill skill = {s} key={i} 
                                            setNPotion={setNPotion}
                                            setSkillsGained={setSkillsGained}
                                            setReportSkills={setReportSkills}
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
                                            typeAttrQuest1={gameInitState.quest1.attribute}
                                            typeAttrQuest2={gameInitState.quest2.attribute}
                                            freeUpgrade={freeUpgrade > 0}
                                            setFreeUpgrade={setFreeUpgrade}
                                            setCurrentGold={setCurrentGold}
                                            testActive={testActive}
                                        />
                                    )
                            })}
                        </div>
                    </div>
                </div>
                <div className='container-order-quests'>
                    <div className='container-quests'>
                        <Quest questAttribute={gameInitState.quest1.attribute} questRequest={6} goldReward={quest1Reward} questDone={quest1Done} setQuestDone={setQuest1Done} progress={nAttributeGained_QuestCrafting} setCurrentGold={setCurrentGold}/>
                        <Quest questAttribute={gameInitState.quest2.attribute} questRequest={8} goldReward={quest2Reward} questDone={quest2Done} setQuestDone={setQuest2Done} progress={nAttributeGained_QuestMagicResearch} setCurrentGold={setCurrentGold}/>
                    </div>
                    <div className='container-order'>
                        <OrdersContainer order={gameInitState.adventurer} setAdventurerQuestDone={setAdventurerQuestDone} skillsGained={skillsGained} setNPotion={setNPotion} setFreeUpgrade={setFreeUpgrade} setCurrentGold ={setCurrentGold}/>
                    </div>
                </div>
                
                <div className='btn-turn-container'>
                    <ButtonTurnDone finishTurn={finishTurn} turnDone={turnDone} gameRestart={gameRestart} nDiceLeft_toUse={nDiceLeft_toUse} />
                </div>
                
                <div className='shop-container'>
                    <Shop shop={shop}/>
                </div>
            </div>
        </div>
    );
}

export default Game;
