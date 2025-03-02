
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
import { AppContext } from '../../App';
import BoardCards from '../components/BoardCards/BoardCards';
import Gold from '../components/Gold/Gold';
import FullScreenBtn from '../components/FullScreenBtn/FullScreenBtn';
import ItemShop from '../components/Shop/ItemShop';
import { apiGame } from '../../api/game-api';
import { useDiceState } from '../../hooks/useDiceState';
import { DICE } from '../../Config/constants';
import { useGameState } from '../../hooks/useGameState';
import { useParams } from 'react-router-dom';
import { usePlayerState } from '../../hooks/usePlayerState';



//SE TEST TRUE SI POSSONO GIOCARE INFINITI DADI
const testActive = false;


const TYPE_GOLD_X_BIG = 'XBIG';
const TYPE_GOLD_SMALL = 'SMALL';
const TYPE_GOLD_MEDIUM = 'MEDIUM';


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

function createSkillMap(skills) {
    const skillMap = new Map();

    skills.forEach(skill => {
        skillMap.set(skill.id, {
            attribute1: skill.attribute1 === 0 || skill.attribute1 == null,
            attribute2: skill.attribute2 === 0 || skill.attribute2 == null,
            attribute3: skill.attribute3 === 0 || skill.attribute3 == null
        });
    });

    return skillMap;
}

//numero pozioni necessarie per usare gl'eDice
const nPotion_extraDice1 = 0;
const nPotion_extraDice2 = 0;
const nPotion_extraDice3 = 0;
const nPotion_extraDice4 = 2;
const nPotion_extraDice5 = 3;
const nPotion_extraDice6 = 4;


function Game() {


    const { socketID, fullScreen, refreshGame, userAuthenticated,checkPersonalScore, singlePlayerGame, username, gameInitState, gameOnNewTurn,setGameOnNewTurn, gameUpdated, setGameUpdated, gameEnd, setGameEnd, WINNER_PAGE, LOGGED_PAGE,navigate } = useContext(AppContext);
    
    
    const { id: lobbyID } = useParams();

    //Ref al area dello table, Close on out-click
    let skillTableRef = useRef();

    //Ref al area dello table, Close on out-click
    let dicesRef = useRef();

    //Ref per mantenere il dado toccato
    let typeTouchedDiceRef = useRef();

    //Ref per mantenere il valore del dado toccato
    let valueTouchedDiceRef = useRef();

    const { gameCurrentState } = useGameState(gameInitState.config, createSkillMap([...skillListCraftingItem, ...skillListMagicResearch]));

    //valori dei dadi
    const { d6, d8, d10, d12, resetDices, resetTouchedDices} = useDiceState(gameInitState.dices);

    const { quest1, quest2, adventurer, updatePlayerState } = usePlayerState(gameInitState.quest1, gameInitState.quest2, gameInitState.player.adventurer);

    const[goldFromSkills, setGoldFromSkills] = useState(0);

    //turnDone == true -> turno completato, in attesa di passare al turno successivo
    const[turnDone, setTurnDone] = useState(false);
    
    
    const [gameRestart, setGameRestart] = useState(false);

    //aprire il report di fine turno
    const [openReport,setOpenReport] = useState(false);

    //lista skills ottenute durante il turno, utile per il report di fine turno (ad ogni turno viene resettata)
    const[reportSkills, setReportSkills] = useState([]);

    //lista items ottenuti durante il turno, utile per il report di fine turno (ad ogni turno viene resettata)
    const[reportItems, setReportItems] = useState([]);

    //lista report di tutti i player
    const[reportEndTurn, setReportEndTurn ] = useState([]);

    //report timer
    const[reportTime,setReportTime] = useState(gameInitState.config.reportTime);

    //numero di dadi rimanenti da usare (variabile incrementabile e decrementabile usando un extra dice(temporanamente), E decrementata ogni volta che usiamo un dado)
    const [nDiceLeft_toUse,setNDiceLeft_toUse] = useState(gameInitState.config.dicePerTurn);

    //numero dadi che sono possibili giocare nel turno attuale (variabile incrementabile e decrementabile usando  un extra dice(temporanamente))
    const [totalPossibleDice_toUse,setTotalPossibleDice_toUse] = useState(gameInitState.config.dicePerTurn);

    //numero dadi usati
    const [nDiceLeft_Used,setNDiceLeft_Used] = useState(0);

    //lista di extra-dice usati temporaneamente
    const [extraDiceUsedTempList,setExtraDiceUsedTempList] = useState([]);
    
    const [boardListPlayers,setBoardListPlayers] = useState(singlePlayerGame ?  null : gameInitState.otherPlayers);
    const [boardCards,setBoardListCards] = useState(singlePlayerGame ? gameInitState.cardsBoard :  null);

    const [card1,setCard1] = useState(gameInitState.player.card1);
    const [card2,setCard2] = useState(gameInitState.player.card2);
    const [card3,setCard3] = useState(gameInitState.player.card3);

    //bool carta girata, showCard(false) -> carta girata
    const[showCard1,setShowCard1] = useState(true);
    const[showCard2,setShowCard2] = useState(true);
    const[showCard3,setShowCard3] = useState(true);


    const [nAttributeGained_QuestCrafting,setnAttributeGained_QuestCrafting] = useState(0);
    const [nAttributeGained_QuestMagicResearch,setnAttributeGained_QuestMagicResearch] = useState(0);
    
    const[quest1Reward ,setQuest1Reward] = useState(gameInitState.quest1.gold);
    const[quest2Reward ,setQuest2Reward] = useState(gameInitState.quest2.gold);
    
    const[openScoreSinglePlayer, setOpenScoreSinglePlayer] = useState(false);
    
    
////////////////////////////////////FUCTIONS//////////////////////////////////////////////////////////////////////////////////////

    const addItemShop =  useCallback((card) => {
        gameCurrentState.setShop((s) => [...s, card]);
        setReportItems((ri)=>[...ri,(card.enchantment + ' ' + card.item + ' ' + card.origin)])
      },[])
    
    

    //Controllo se il giocatore possiede le skill necessarie per craftare la carta
    const checkSkillCard = useCallback((card)=>{
        const hasItemSkill = gameCurrentState.skillsGained.includes(card.item);
        const hasEnchantmentSkill = card.enchantment === '' ? true : gameCurrentState.skillsGained.includes(card.enchantment);
        const hasOriginSkill = card.origin === '' ? true : gameCurrentState.skillsGained.includes(card.origin);
        return hasItemSkill && hasEnchantmentSkill && hasOriginSkill ;
    },[gameCurrentState.skillsGained])


    //predicato per vedere se un dado è stato toccato
    const isDiceTouched = useCallback(()=>{ 
        
        return typeTouchedDiceRef.current !== '';
    },[])
    
   
    
    //funzione che restituisce la fun per cambiare lo state di DiceUsed relativa al dado toccato
    const choose_fun_setDiceUsed = useCallback(()=>{
        switch(typeTouchedDiceRef.current){
            case DICE.d6: return d6.setIsTouched;
            case DICE.d8: return d8.setIsTouched;
            case DICE.d10: return d10.setIsTouched;
            case DICE.d12: return d12.setIsTouched;     
            default: return;
        }
    },[])

    const toggleDiceTouch = (dice) => {
        const isTouched = dice.isTouched;
        
        // Reset stato dei dadi precedenti
        resetTouchedDices();
        
        if (isTouched) {
            typeTouchedDiceRef.current = '';
            valueTouchedDiceRef.current = null;
        } else {
            typeTouchedDiceRef.current = dice.type;
            valueTouchedDiceRef.current = dice.value;
        }
        
        // Impostiamo lo stato del dado
        dice.setIsTouched(!isTouched);
    };
    

    
    // funzione che restituisce la fun per cambiare lo state di DiceUsed relativa al dado toccato
    const choose_fun_setExtraDiceUsed = useCallback(()=>{
        if(!gameCurrentState.extraDiceUsed.ed1 && extraDiceUsedTempList.includes(TYPE_EXTRADICE1)) return gameCurrentState.getSetExtraDiceUsed(TYPE_EXTRADICE1);
        if(!gameCurrentState.extraDiceUsed.ed2 && extraDiceUsedTempList.includes(TYPE_EXTRADICE2)) return gameCurrentState.getSetExtraDiceUsed(TYPE_EXTRADICE2);
        if(!gameCurrentState.extraDiceUsed.ed3 && extraDiceUsedTempList.includes(TYPE_EXTRADICE3)) return gameCurrentState.getSetExtraDiceUsed(TYPE_EXTRADICE3);
        if(!gameCurrentState.extraDiceUsed.ed4 && extraDiceUsedTempList.includes(TYPE_EXTRADICE4)) return gameCurrentState.getSetExtraDiceUsed(TYPE_EXTRADICE4);
        if(!gameCurrentState.extraDiceUsed.ed5 && extraDiceUsedTempList.includes(TYPE_EXTRADICE5)) return gameCurrentState.getSetExtraDiceUsed(TYPE_EXTRADICE5);
        if(!gameCurrentState.extraDiceUsed.ed6 && extraDiceUsedTempList.includes(TYPE_EXTRADICE6)) return gameCurrentState.getSetExtraDiceUsed(TYPE_EXTRADICE6);
    },[extraDiceUsedTempList, gameCurrentState])

    const restoreBackupState = (backupResponse) => {

        const { backupGameState, backupPlayer } = backupResponse;
        gameCurrentState.setGameState(backupPlayer);
        const lastGameState = backupGameState.lastGameState;


        setTurnDone(false);
        setGameRestart(true);
        setOpenReport(false);
        setReportSkills([]);
        setReportItems([]);
        setReportEndTurn([]);
        setReportTime(backupGameState.initConfig.reportTime);
        setNDiceLeft_toUse(backupGameState.initConfig.dicePerTurn);
        setTotalPossibleDice_toUse(backupGameState.initConfig.dicePerTurn);
        setNDiceLeft_Used(0);
        setExtraDiceUsedTempList([]);

        resetDices(backupGameState.lastDiceRolls);

        //Cerco il mio index nell'array di tutte le carte , cella array -> mazzo di carte di un giocatore + username
        console.log(backupResponse)
        const indexCardsCurrentPlayer = lastGameState.cards.findIndex((p)=> p.username === username );
        const cardsCurrentPlayer = lastGameState.cards[indexCardsCurrentPlayer];

        const adventurerCurrentPlayer = backupGameState.playerAdventurers[indexCardsCurrentPlayer];

        updatePlayerState(backupGameState.quest1, backupGameState.quest2, adventurerCurrentPlayer.adventurer);

        //setto le mie carte 
        setCard1(cardsCurrentPlayer.card1);
        setCard2(cardsCurrentPlayer.card2);
        setCard3(cardsCurrentPlayer.card3);
        setShowCard1(true);
        setShowCard2(true);
        setShowCard3(true);

        const newBoardPlayer = [];
        let i = indexCardsCurrentPlayer + 1;
        while(i < lastGameState.cards.length){
            newBoardPlayer.push(lastGameState.cards[i]);
            i++;
        }
        let j = 0;
        while(j < indexCardsCurrentPlayer){
            newBoardPlayer.push(lastGameState.cards[j]);
            j++;
        }
        //setto le carte remanenti come carte nella board
        setBoardListPlayers(newBoardPlayer);

        setQuest1Reward(backupGameState.quest1.gold);
        setQuest2Reward(backupGameState.quest2.gold);
        setOpenScoreSinglePlayer(false);
    };
    

    const finishTurn = useCallback(async ()=>{
        if(!turnDone){
            if(!singlePlayerGame){
                if(gameCurrentState.nTurn < gameInitState.config.nTurn){
                    card1.inProgress = showCard1;
                    card2.inProgress = showCard2;
                    card3.inProgress = showCard3;
                    const playerGameState = {
                        username: username,
                        card1: card1,
                        card2: card2,
                        card3: card3,
                        report: {
                            skills: reportSkills, 
                            items: reportItems,
                            quest1: gameCurrentState.quest1Done,
                            quest2: gameCurrentState.quest2Done
                        }
                    }
                    const backupPlayer = {
                        username: username,
                        backup: gameCurrentState
                    }
                    const res = await apiGame.finishTurn(lobbyID, playerGameState, backupPlayer)
                    
                    switch(res.statusCode){
                        case 200:
                            setTurnDone(true);
                            break;
                        default:
                    }
                }else{
                    const finalReport = {
                        username: username,
                        report:{
                            shop: gameCurrentState.shop,
                            quest1: gameCurrentState.quest1Done,
                            quest2: gameCurrentState.quest2Done,
                            order: gameCurrentState.adventurerQuestDone,
                            renownedAccessories: gameCurrentState.skillsGained.includes('renowned accessories'),
                            weaponPrestige: gameCurrentState.skillsGained.includes('weapon prestige'),
                            eliteArmor: gameCurrentState.skillsGained.includes('elite armor'),
                            gold: gameCurrentState.currentGold
                        }
                    }
                   const res = await apiGame.endGame(lobbyID,finalReport);
                    
                   switch(res.statusCode){
                    case 200:
                        setTurnDone(true);
                        break;
                    default:
                }
                }
            }
            else{
                if(gameCurrentState.nTurn < gameInitState.config.nTurn){
                    setTurnDone(true);
                    card1.inProgress = showCard1;
                    card2.inProgress = showCard2;
                    card3.inProgress = showCard3;
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
                        currentGold: gameCurrentState.currentGold,
                        shop: gameCurrentState.shop,
                        renownedAccessories: gameCurrentState.skillsGained.includes('renowned accessories'),
                        weaponPrestige: gameCurrentState.skillsGained.includes('weapon prestige'),
                        eliteArmor: gameCurrentState.skillsGained.includes('elite armor')
                    }
                    
                    window.navigator.serviceWorker.ready.then( ( registration ) => 'active' in registration && registration.active.postMessage({ type:'end-game-single-player', data: dataToSend} ));
                    window.navigator.serviceWorker.onmessage = event => {
                        
                        if(event.data && event.data.type === 'end-game-single-player'){
                            console.log("End single player game")
                            gameCurrentState.setCurrentGold(event.data.data);
                            checkPersonalScore(event.data.data);
                            setGameEnd(true);
                            setOpenScoreSinglePlayer(true);
                        }
                    };
                }
            }
            
            
        }
    },[boardCards, card1, card2, card3, checkPersonalScore, gameCurrentState, gameInitState.config.nTurn, reportItems, reportSkills, setGameEnd, setGameOnNewTurn, setGameUpdated, showCard1, showCard2, showCard3, singlePlayerGame, turnDone, username]);

    
    
    //Cambio stato aggiornando il turno, facendo un refresh delle struttere dati
    //seguendo la logica del gioco
    const newTurn = useCallback((newGameState)=>{

        //aumento il turno
        gameCurrentState.setNTurn((n)=>(n+1));

        //Refresh sul numero di dadi giocabili per turno
        setNDiceLeft_toUse(2);
        setTotalPossibleDice_toUse(2);
        //Refresh sul numero di dadi giocati
        setNDiceLeft_Used(0);
        //Refresh dei dadi -> ora sono tutti giocabili (non grigi/non clickabili)
        resetDices(newGameState.dices);

        setExtraDiceUsedTempList([]);

        //Check delle quest, se qualcuno ha risolto la quest e te non l hai fatto, dimezza il valore della ricompensa
        if(newGameState.quest1 && !gameCurrentState.quest1Done){
            setQuest1Reward(prev => prev/2);
        }
        if(newGameState.quest2 && !gameCurrentState.quest2Done){
            setQuest2Reward(prev => prev/2);
        }

        //Cerco il mio index nell'array di tutte le carte , cella array -> mazzo di carte di un giocatore + username
        const indexCardsCurrentPlayer = newGameState.cards.findIndex((p)=> p.username === username );
        const cardsCurrentPlayer = newGameState.cards[indexCardsCurrentPlayer];


        //setto le mie carte 
        setCard1(cardsCurrentPlayer.card1);
        setCard2(cardsCurrentPlayer.card2);
        setCard3(cardsCurrentPlayer.card3);
        setShowCard1(true);
        setShowCard2(true);
        setShowCard3(true);

        // if(newGameState.cards.length === 1){
        //     const finalReport = {
        //         username: username,
        //         shop: shop,
        //         quest1: quest1Done,
        //         quest2: quest2Done,
        //         order: adventurerQuestDone,
        //         renownedAccessories: skillsGained.includes('renowned accessories'),
        //         weaponPrestige: skillsGained.includes('weapon prestige'),
        //         eliteArmor: skillsGained.includes('elite armor'),
        //         gold: currentGold
        //     }
        //    return apiGame.endGame(lobby.id, finalReport);
        // }
        
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
        setReportEndTurn(newGameState.reports);
        

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

    },[gameCurrentState, resetDices, gameInitState.config.reportTime, username]);



    const newTurnSinglePlayer = useCallback((newGameState)=>{

        //aumento il turno
        gameCurrentState.setNTurn((n)=>(n+1));

        //Refresh sul numero di dadi giocabili per turno
        setNDiceLeft_toUse(2);
        setTotalPossibleDice_toUse(2);
        //Refresh sul numero di dadi giocati
        setNDiceLeft_Used(0);
        //Refresh dei dadi -> ora sono tutti giocabili (non grigi/non clickabili)
        resetDices(newGameState.dices);
        setExtraDiceUsedTempList([]);
        
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
                quest1: gameCurrentState.quest1Done,
                quest2: gameCurrentState.quest2Done
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

    },[gameCurrentState, gameInitState.config.reportTime, reportItems, reportSkills, resetDices, username])

    ////////////////////////////////////    USE EFFECT   //////////////////////////////////////////////////////////////


    useEffect(() => {
        const checkReconnection = async () => {
            if (gameInitState.mock &&  userAuthenticated && username !== "" && socketID !== -1) {

                const res = await apiGame.reconnectGame(lobbyID, username);
                
                switch(res.statusCode){
                    case 200:
                        restoreBackupState(res.data);
                        break;
                    default:
                        alert("Mi spiace ma ti sei disconnesso e il gioco è andato avanti, non è possibile riunirsi al game");
                        navigate(LOGGED_PAGE);
                }
                
            }
        };
        checkReconnection();
    }, [gameInitState, userAuthenticated, username, socketID]);
    
    

    //Skilltable useEffect, se tocco un Dice rimanete attivo fino a che non clicko un altra parte dello schermo che non sia skilltable 
    useEffect(()=>{
        let whileDiceTouched = (e)=>{
            if(!skillTableRef.current.contains(e.target) && !dicesRef.current.contains(e.target)){
                resetTouchedDices();
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
                navigate(`${WINNER_PAGE}/${lobbyID}`);
            }else{
                setOpenScoreSinglePlayer(true);
            }
        }
    },[gameEnd]);


   
////////////////////////////////////////////  RETURN  //////////////////////////////////////////////////////
    return (
        <div className='Game'>
            
            {
                singlePlayerGame && openScoreSinglePlayer &&
                   
                    (
                        <div className='score-end-game'>
                            <div className='container-score-end-game'>
                                <label>Shop : </label>
                                <div className='shop-score-end-game'>
                                    
                                {
                                    gameCurrentState.shop.length > 0 ?
                                    gameCurrentState.shop.map((item,k)=>(
                                        <ItemShop item={item} key={k}/>
                                    ))
                                    :'No Item'
                  
                                }</div>
                                <div className='gold-score-end-game'>Gold from skills : <Gold value={goldFromSkills} size={TYPE_GOLD_MEDIUM} active={true}/></div>
                                <div className='gold-score-end-game'>Quest 1 : {gameCurrentState.quest1Done ? <Gold value={8} size={TYPE_GOLD_MEDIUM} active={true}/>: <Gold value={0} size={TYPE_GOLD_MEDIUM} active={true}/>}</div>
                                <div className='gold-score-end-game'>Quest 2 : {gameCurrentState.quest2Done ? <Gold value={8} size={TYPE_GOLD_MEDIUM} active={true}/>: <Gold value={0} size={TYPE_GOLD_MEDIUM} active={true}/>}</div>
                                <div className='gold-score-end-game'>Adventurer quest : {gameCurrentState.adventurerQuestDone ? <Gold value={gameInitState.player.adventurer.gold} size={TYPE_GOLD_MEDIUM} active={true}/>: <Gold value={0} size={TYPE_GOLD_MEDIUM} active={true}/>}</div>
                                <div className='gold-score-end-game'>Bonus Renowned Accessories : { gameCurrentState.skillsGained.includes('renowned accessories') ? ' Yes' : ' No'}</div>
                                <div className='gold-score-end-game'>Bonus Weapon Prestige : { gameCurrentState.skillsGained.includes('weapon prestige') ? ' Yes' : ' No'}</div>
                                <div className='gold-score-end-game'>Bonus Elite Armor : { gameCurrentState.skillsGained.includes('elite armor') ? ' Yes' : ' No'}</div>
                                <div className='bar-score-end-game'/>
                                <div className='final-score-end-game'>
                                    Your score:
                                    <Gold value={gameCurrentState.currentGold} size={TYPE_GOLD_X_BIG} active={true}/>
                                </div>
                               
                            </div>
                            <button className='btn-score-end-game' onClick={()=>{
                                navigate(LOGGED_PAGE);
                                refreshGame();
                            }}>New Game</button>
                        </div>
                    ) 
                 
                
            }
            <ReportBoard reports={reportEndTurn} setReports={setReportEndTurn} endTurn={openReport} setEndTurn={setOpenReport} setGameRestart={setGameRestart} setTurnDone={setTurnDone} reportTime={reportTime} setReportTime={setReportTime}/>
            <div className={`game-container ${fullScreen ? 'fullscreen' : ''} ${turnDone  ? 'wait-state-game' :''}`}>   
                <div className='upper-container'>
                    <div className='container-extra-dices'>
                        <img src={titleExtraDices} alt='EXTRA DICES' className='upper-container-titles-extra-dices' ></img>
                        <div className='extra-dices'>
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice1}
                                nPotion={gameCurrentState.nPotion}
                                setNPotion={gameCurrentState.setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={gameCurrentState.extraDiceUsed.ed1}   
                                typeExtraDice={TYPE_EXTRADICE1}        
                                gameRestart={gameRestart}
                            />
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice2} 
                                nPotion={gameCurrentState.nPotion}
                                setNPotion={gameCurrentState.setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={gameCurrentState.extraDiceUsed.ed2}     
                                typeExtraDice={TYPE_EXTRADICE2}      
                                gameRestart={gameRestart} 
                            />
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice3}
                                nPotion={gameCurrentState.nPotion}
                                setNPotion={gameCurrentState.setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={gameCurrentState.extraDiceUsed.ed3}              
                                typeExtraDice={TYPE_EXTRADICE3}    
                                gameRestart={gameRestart}         
                            />
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice4}
                                nPotion={gameCurrentState.nPotion}
                                setNPotion={gameCurrentState.setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={gameCurrentState.extraDiceUsed.ed4}               
                                typeExtraDice={TYPE_EXTRADICE4}  
                                gameRestart={gameRestart}        
                            />
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice5}
                                nPotion={gameCurrentState.nPotion}
                                setNPotion={gameCurrentState.setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={gameCurrentState.extraDiceUsed.ed5}           
                                typeExtraDice={TYPE_EXTRADICE5}          
                                gameRestart={gameRestart}     
                            ></ExtraDice>
                            <ExtraDice
                                nPotion_extraDice={nPotion_extraDice6}
                                nPotion={gameCurrentState.nPotion}
                                setNPotion={gameCurrentState.setNPotion}
                                nDiceLeft_Used={nDiceLeft_Used}
                                setNDiceLeft_toUse={setNDiceLeft_toUse}
                                totalPossibleDice_toUse={totalPossibleDice_toUse}
                                setTotalPossibleDice_toUse={setTotalPossibleDice_toUse}
                                extraDiceUsedTempList={extraDiceUsedTempList}
                                setExtraDiceUsedTempList={setExtraDiceUsedTempList}
                                definitelyExtraDiceUsed={gameCurrentState.extraDiceUsed.ed6}         
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
                        <div className='n-turn-label'>{gameCurrentState.nTurn +'/'+ gameInitState.config.nTurn}</div>
                    </div>
                    
                    <div className='timer-container'><Timer timerCountdown={gameInitState.config.countdown} finishTurn={finishTurn} turnDone={turnDone} gameRestart={gameRestart}/></div>

                </div>
                <div className='legend-container'><Legend/></div>
                <div className='container-dices-potion' ref={dicesRef} >
                    <div className='container-potion'>
                        <img src={potionImg} className='potion-img' alt='POTION'></img>
                        <div className='potion-label'>{gameCurrentState.nPotion}</div>
                    </div>
                    <ContainerDice  
                        nPotion={gameCurrentState.nPotion} 
                        setnPotion={gameCurrentState.setNPotion} 
                        dice={d6} 
                        nActions={nDiceLeft_toUse} 
                        typeTouchedDiceRef={typeTouchedDiceRef}
                        valueTouchedDiceRef={valueTouchedDiceRef}
                        onClickImgHandler={()=>toggleDiceTouch(d6)}
                    />
                    <ContainerDice  
                        nPotion={gameCurrentState.nPotion} 
                        setnPotion={gameCurrentState.setNPotion} 
                        dice={d8} 
                        nActions={nDiceLeft_toUse} 
                        typeTouchedDiceRef={typeTouchedDiceRef}
                        valueTouchedDiceRef={valueTouchedDiceRef}
                        onClickImgHandler={()=>toggleDiceTouch(d8)}
                    />
                    <ContainerDice  
                        nPotion={gameCurrentState.nPotion} 
                        setnPotion={gameCurrentState.setNPotion} 
                        dice={d10} 
                        nActions={nDiceLeft_toUse} 
                        typeTouchedDiceRef={typeTouchedDiceRef}
                        valueTouchedDiceRef={valueTouchedDiceRef}
                        onClickImgHandler={()=>toggleDiceTouch(d10)}
                    />
                    <ContainerDice  
                        nPotion={gameCurrentState.nPotion} 
                        setnPotion={gameCurrentState.setNPotion} 
                        dice={d12} 
                        nActions={nDiceLeft_toUse} 
                        typeTouchedDiceRef={typeTouchedDiceRef}
                        valueTouchedDiceRef={valueTouchedDiceRef}
                        onClickImgHandler={()=>toggleDiceTouch(d12)}
                    />
                </div>


                <div className='cards-container'>
                    <div  className='card-wrapper'>
                        <div>
                            <Card card = {card1} 
                                isShowed={showCard1}
                                smallSize={false}
                            />
                            <div className='card1-going-away' >OUTGOING</div>
                        </div>
                        <div className='forge-btn-wrapper'>
                            <ForgeButton 
                                checkSkillCard={checkSkillCard}
                                setShowCard={setShowCard1}
                                addItemShop={addItemShop}
                                showCard={showCard1}
                                card={card1}
                                setCurrentGold={gameCurrentState.setCurrentGold}
                                setNPotion={gameCurrentState.setNPotion}
                            />
                        </div>
                    </div>
                    
                    <div className='card-wrapper'>
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
                            setCurrentGold={gameCurrentState.setCurrentGold}
                            setNPotion={gameCurrentState.setNPotion}
                        />
                    </div>
                    <div className='card-wrapper'>
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
                            setCurrentGold={gameCurrentState.setCurrentGold}
                            setNPotion={gameCurrentState.setNPotion}
                        />
                    </div>
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
                    <div className='title-skills-table-container' id='title-skills1'> 
                        <img src={titleCraftingSkills} alt='CRAFTING SKILLS' className='title-skills'/>
                    </div>
                    
                    <div className='skills-container' id='crafting-skills'>
                        {
                        skillListCraftingItem.map((s,i)=>{
                                return (
                                    <Skill skill = {s} key={i} 
                                        skillTree={gameCurrentState.getSkillById(s.id)}
                                        setSkillTree={gameCurrentState.getSkillAttributeSetter(s.id)}
                                        setNPotion={gameCurrentState.setNPotion}
                                        setSkillsGained={gameCurrentState.setSkillsGained}
                                        setReportSkills={setReportSkills}
                                        valueTouchedDiceRef={valueTouchedDiceRef}
                                        typeTouchedDiceRef={typeTouchedDiceRef}
                                        isDiceTouched={isDiceTouched}
                                        setNDiceLeft_toUse={setNDiceLeft_toUse}
                                        nDiceLeft_Used={nDiceLeft_Used}
                                        setNDiceLeft_Used={setNDiceLeft_Used}
                                        setDiceUsed={choose_fun_setDiceUsed()}
                                        setAllDicesNoTouched={resetTouchedDices}
                                        setExtraDiceUsed={choose_fun_setExtraDiceUsed()}
                                        setNAttrQuest1={setnAttributeGained_QuestCrafting}
                                        setNAttrQuest2={setnAttributeGained_QuestMagicResearch}
                                        typeAttrQuest1={gameInitState.quest1.attribute}
                                        typeAttrQuest2={gameInitState.quest2.attribute}
                                        freeUpgrade={gameCurrentState.freeUpgrade > 0}
                                        setFreeUpgrade={gameCurrentState.setFreeUpgrade}
                                        setCurrentGold={gameCurrentState.setCurrentGold}
                                        setGoldFromSkills={setGoldFromSkills}
                                        testActive={testActive}
                                    />
                                )
                        })}
                    </div>
                    
                    <div className='title-skills-table-container' id='title-skills2'>
                        <img src={titleMagicResearch} alt='MACIC RESEARCH SKILLS' className='title-skills' />
                    </div>
                    
                    <div className='skills-container' id='magic-research-skills'>
                        {
                        skillListMagicResearch.map((s,i)=>{
                                return (
                                    <Skill skill = {s} key={i} 
                                        skillTree={gameCurrentState.getSkillById(s.id)}
                                        setSkillTree={gameCurrentState.getSkillAttributeSetter(s.id)}
                                        setNPotion={gameCurrentState.setNPotion}
                                        setSkillsGained={gameCurrentState.setSkillsGained}
                                        setReportSkills={setReportSkills}
                                        valueTouchedDiceRef={valueTouchedDiceRef}
                                        typeTouchedDiceRef={typeTouchedDiceRef}
                                        isDiceTouched={isDiceTouched}
                                        setNDiceLeft_toUse={setNDiceLeft_toUse}
                                        nDiceLeft_Used={nDiceLeft_Used}
                                        setNDiceLeft_Used={setNDiceLeft_Used}
                                        setDiceUsed={choose_fun_setDiceUsed()}
                                        setAllDicesNoTouched={resetTouchedDices}
                                        setExtraDiceUsed={choose_fun_setExtraDiceUsed()}
                                        setNAttrQuest1={setnAttributeGained_QuestCrafting}
                                        setNAttrQuest2={setnAttributeGained_QuestMagicResearch}
                                        typeAttrQuest1={gameInitState.quest1.attribute}
                                        typeAttrQuest2={gameInitState.quest2.attribute}
                                        freeUpgrade={gameCurrentState.freeUpgrade > 0}
                                        setFreeUpgrade={gameCurrentState.setFreeUpgrade}
                                        setCurrentGold={gameCurrentState.setCurrentGold}
                                        setGoldFromSkills={setGoldFromSkills}
                                        testActive={testActive}
                                    />
                                )
                        })}
                    </div>
                    
                </div>
                <div className='container-order-quests'>
                    <div className='container-quests'>
                        <Quest questAttribute={quest1.attribute} questRequest={6} goldReward={quest1Reward} questDone={gameCurrentState.quest1Done} setQuestDone={gameCurrentState.setQuest1Done} progress={nAttributeGained_QuestCrafting} setCurrentGold={gameCurrentState.setCurrentGold}/>
                        <Quest questAttribute={quest2.attribute} questRequest={8} goldReward={quest2Reward} questDone={gameCurrentState.quest2Done} setQuestDone={gameCurrentState.setQuest2Done} progress={nAttributeGained_QuestMagicResearch} setCurrentGold={gameCurrentState.setCurrentGold}/>
                    </div>
                    <div className='container-order'>
                        <OrdersContainer order={adventurer} setAdventurerQuestDone={gameCurrentState.setAdventurerQuestDone} skillsGained={gameCurrentState.skillsGained} setNPotion={gameCurrentState.setNPotion} setFreeUpgrade={gameCurrentState.setFreeUpgrade} setCurrentGold ={gameCurrentState.setCurrentGold}/>
                    </div>
                </div>
                
                <div className='btn-turn-container'>
                    <ButtonTurnDone finishTurn={finishTurn} turnDone={turnDone} gameRestart={gameRestart} nDiceLeft_toUse={nDiceLeft_toUse} />
                </div>
                
                <div className='shop-container'>
                    <Shop shop={gameCurrentState.shop}/>
                </div>
                
            </div>
            <Exit/>
            <FullScreenBtn/>
        </div>
    );
}

export default Game;
