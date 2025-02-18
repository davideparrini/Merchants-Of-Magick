
const barbarian = require('../Adventurers/barbarian.json');
const bountyHunter = require('../Adventurers/bountyHunter.json');
const cleric = require('../Adventurers/cleric.json');
const knight = require('../Adventurers/knight.json');
const ranger = require('../Adventurers/ranger.json');
const warrior = require('../Adventurers/warrior.json');
const witch = require('../Adventurers/witch.json');
const wizard = require('../Adventurers/wizard.json');

function createGameLogic(){
    const craftingItemType = [
        'backpack',
        'scroll',
        'ring',
        'grimoire',
        'staff',
        'sword',
        'crossbow', 
        'warhammer',
        'bracers',
        'helmet',
        'greaves',
        'plate armor'
    ];
    
    const originType = [
        'of the elves',
        'of the dwarves', 
        'of the orcs',
        'of the dragons'
    ];
    
    const enchantmentType = [ 
        'fiery',
        'shocking',
        'everlasting',
        'divine'
    ];
    
    const Adventurers = [barbarian, bountyHunter, cleric, knight, ranger, warrior, witch, wizard];
    const CraftingAttributes = ['steel','wood', 'leather'];
    const MagicAttributes = ['elemental','arcane','wild'];

    const typeCard_RANDOM = 'RANDOM';
    const typeCard_NO_ENCHANTMENT= 'NO_ENCHANTMENT';
    const typeCard_NO_ORIGIN = 'NO_ORIGIN';
    const typeCard_BOTH = "BOTH";
    
    const TYPE_ACCESSORIES=['backpack','scroll','ring','grimoire'];
    const TYPE_ARMOR=['bracers','helmet','greaves','plate armor'];
    const TYPE_WEAPONS=['staff','sword','crossbow','warhammer'];

    const TYPE_DECK_ITEM = 'TYPE_DECK_ITEM';
    const TYPE_DECK_ENCHANTMENT = 'TYPE_DECK_ENCHANTMENT';
    const TYPE_DECK_ORIGIN = 'TYPE_DECK_ORIGIN';

    let counter = 1;
    let prevRand = 1;

    let deckItem = [];
    let deckEnchantment = [];
    let deckOrigin = [];

    const rand = (min, max) => {
        if(counter < 0) counter = Math.floor(Math.random()*9887);
        if(prevRand < 0) prevRand = Math.floor(Math.random()*9199);
        const time = new Date().getTime();
        const randValue = (((time / counter) / (prevRand + 1)) % (max-min+1)) + min;
        counter++;
        prevRand = randValue;
        return parseInt(randValue);
    }

    //Funzione utilis per mischiare un array
    //Shuffle algorithm -> Fisher-Yates Shuffle
    function shuffle(array) {
        var currentIndex = array.length;
        var randomIndex;
        
        while(currentIndex > 0){
            randomIndex = rand(0, currentIndex-1);
            currentIndex--;

            //scambio gl'elementi dell'array agl'indici currentIndex e randomIndex
            [ array[currentIndex], array[randomIndex] ] = [ array[randomIndex] , array[currentIndex]];
            
        }

        return array;
    }

    function createDeck(typeDeck){
        switch(typeDeck){
            case TYPE_DECK_ITEM:
                const newDeckItem = [...craftingItemType].concat([...craftingItemType], [...craftingItemType]);
                return shuffle(newDeckItem);
            case TYPE_DECK_ENCHANTMENT:
                const newDeckEnchantment = [...enchantmentType].concat([...enchantmentType], [...enchantmentType]);
                return shuffle(newDeckEnchantment);
            case TYPE_DECK_ORIGIN:
                const newDeckOrigin = [...originType].concat([...originType], [...originType]);
                return shuffle(newDeckOrigin);
            default: return;
        }

    }

    //Scelgo un tipo di ordine random 
    function chooseRandomTypeCard(){
        const value = rand(0, 2);
        switch (value){
            case 0: return typeCard_NO_ENCHANTMENT;
            case 1: return typeCard_NO_ORIGIN;
            case 2: return typeCard_BOTH;
            default: console.error("Err chooseRandom typeCard"); return;
        }
    }
    
     //Crea una nuova carta specificando come paramento il tipo della carta
     function createNewCard(typeCard){
        
        let t_card = typeCard === typeCard_RANDOM ? chooseRandomTypeCard() : typeCard;
        var origin = '';
        var gold = 0;
        var enchantment = '';
        if(deckItem.length === 0) deckItem = createDeck(TYPE_DECK_ITEM);
        if(deckEnchantment.length === 0) deckEnchantment = createDeck(TYPE_DECK_ENCHANTMENT);
        if(deckOrigin.length === 0) deckOrigin = createDeck(TYPE_DECK_ORIGIN);

        switch(t_card){
            case typeCard_NO_ENCHANTMENT:
                origin = deckOrigin.pop();
                gold = rand(3,5);
                break;
            case typeCard_NO_ORIGIN:
                enchantment = deckEnchantment.pop();
                gold = rand(3,5);
                break;
            case typeCard_BOTH:
                enchantment = deckEnchantment.pop();
                origin = deckOrigin.pop();
                gold = rand(6,8);
                break;
            default: console.error("Err createNewCard"); return;
        }
        
        const card = {
            item: deckItem.pop(),
            gold: gold,
            enchantment: enchantment,
            origin: origin,
            inProgress: true
        }
        return card;
    }
    
    //funzione che crea un obj con i tiri dei dadi scelti a caso
    function rollDices(){
        
        var dices = {
            d6 : rand(1,6),
            d8 : rand(1,8),
            d10 : rand(1,10),
            d12 : rand(1,12)
        }
        return dices;
    }
    
    
    
    function updateCardsTurn(cards , players){

        let oldListCards =[]; //tutte le carte, giocate e non
        let newListCards = []; //carte giocate -> sostituite con nuove carte
        //pusho in ordine di playerIndex le carte dei giocatori in oldListCards

        players.forEach((username) =>{
            let indexPlayer = cards.findIndex((u)=> u.username === username);
            
            oldListCards.push(cards[indexPlayer].card1);
            oldListCards.push(cards[indexPlayer].card2);
            oldListCards.push(cards[indexPlayer].card3);
        }
        )
        //sostituisco le carte giocate con delle nuove, pushando tutto in newListCards
        oldListCards.forEach((c)=>{
            if(!c.inProgress){
                const newCard = createNewCard(typeCard_RANDOM);
                newListCards.push(newCard);
            }
            else{
                newListCards.push(c);
            }
        })
        
        //slittamento di una carta,
        const cardSlip = newListCards.shift();
        newListCards.push(cardSlip);

        let updatedCards = []; //res

        for(let i=0; i < players.length; i++){ 
            //ridistribuisco carte ai giocatori associando username-carte
            let playerCards = {
                username: players[i],
                cards: {
                    card1: newListCards.shift(),
                    card2: newListCards.shift(),
                    card3: newListCards.shift()
                }
            };

            //obj creato lo pusho nel lista delle carte aggiornate, risultato della funzione
            updatedCards.push(playerCards);
        }
        return updatedCards;
    }

    
    //Crea un obj con tutte le informazioni utili per inziare il game,
    //viene mandato dal server a tutti i client della lobby
    function gameInit(players, config){
        //Creazione obj quests, scelgo gl' attribute in modo casuale 
        const quest1Attribute = CraftingAttributes[rand(0,2)] ;
        const quest2Attribute = MagicAttributes[rand(0,2)];

        const quests = {
            quest1 : {
                attribute: quest1Attribute,
                gold : 8
            },
            quest2 : {
                attribute: quest2Attribute,
                gold : 8
            }
        }

        //Creazione obj contentendi i tiri dei dadi
        const dices = rollDices();
        

        //Creazione obj dell'info di tutti player, un player -> adveture e 3 carte
        let playerArray = [];
        let copyArray = [...Adventurers];
        let adventurersShuffled = shuffle(copyArray);
        for(let i = 0; i < players.length; i++){
            let player = {
                username: players[i],
                adventurer: adventurersShuffled[i],
                cards:{
                    card1: createNewCard(typeCard_NO_ENCHANTMENT),
                    card2: createNewCard(typeCard_NO_ORIGIN),
                    card3: createNewCard(typeCard_BOTH),
                }
            }

            playerArray.push(player);
        }
    

        //Metto tutto dentro un unico obj
        const gameInitObj ={
            quests : quests,
            dices : dices,
            players : playerArray,
            config : config
        }
        return gameInitObj;
    }



    function compareByGold(a,b){
        return b.report.gold - a.report.gold;
    }

    function calculateGold(finalReport){
        const newFinalReport = [];
        finalReport.forEach((r)=>{
            
            const newReport = {
                username: r.username,
                position: -1,
                report: r.report
            }
            const renownedAccessories = r.report.renownedAccessories;
            const weaponPrestige = r.report.weaponPrestige;
            const eliteArmor = r.report.eliteArmor;
            
            if(r.report.shop.length > 0){
                r.report.shop.forEach((item)=>{
                    if(renownedAccessories && TYPE_ACCESSORIES.includes(item.item)){
                        newReport.report.gold+= 2;
                    }
                    if(weaponPrestige && TYPE_WEAPONS.includes(item.item)){
                        newReport.report.gold += 2;
                    }
                    if(eliteArmor && TYPE_ARMOR.includes(item.item)){
                        newReport.report.gold += 2;
                    }
                })  
            }

            newFinalReport.push(newReport);

        })
        
        return newFinalReport;
    }

    function winnerResolution(finalReport){
        const addedGoldReport = calculateGold(finalReport);
        const sortedReport = addedGoldReport.sort(compareByGold);
        let positionValue = 0;
        let goldValue = Infinity;
        const resolvedFinalReport = [];
        sortedReport.map((r)=>{
            const resolvedReport = {
                username: r.username,
                position: -1,
                report: r.report
            }
            if(r.report.gold < goldValue){
                resolvedReport.position = ++positionValue;
                goldValue = r.report.gold;
            }
            else if(r.report.gold === goldValue){
                resolvedReport.position = positionValue;
            }
            else{
                resolvedReport.position = -2;
            }
            resolvedFinalReport.push(resolvedReport);
        })

        return resolvedFinalReport;
    }

    return {
        gameInit, updateCardsTurn, rollDices, createNewCard, winnerResolution, craftingItemType, originType, enchantmentType
    };
}

const gameLogic = createGameLogic();
module.exports.gameLogic = gameLogic;
