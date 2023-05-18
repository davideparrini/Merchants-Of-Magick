

import barbarian from './Adventurers/barbarian.json';
import bountyHunter from './Adventurers/bountyHunter.json' ;
import cleric from './Adventurers/cleric.json';
import knight from './Adventurers/knight.json';
import ranger from './Adventurers/ranger.json';
import warrior from './Adventurers/warrior.json';
import witch from './Adventurers/witch.json' ;
import wizard from './Adventurers/wizard.json' ;



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

    let counter = 1;
    let prevRand = 1;
    const rand = (min, max) => {
        if(counter < 0) counter = Math.floor(Math.random()*9887);
        if(prevRand < 0) prevRand = Math.floor(Math.random()*9199);
        const time = new Date().getTime();
        const randValue = (((time / counter) / (prevRand + 1)) % (max-min+1)) + min;
        counter++;
        prevRand = randValue;
        return parseInt(randValue);
    }

    

    //Scelgo un tipo di ordine random 
    function chooseRandomTypeCard(){
        switch (rand(0,2)){
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
        
        
        switch(t_card){
            case typeCard_NO_ENCHANTMENT:
                origin = originType[rand(0,originType.length-1)];
                gold = rand(3,5);
                break;
            case typeCard_NO_ORIGIN:
                enchantment = enchantmentType[rand(0,enchantmentType.length-1)];
                gold = rand(3,5);
                break;
            case typeCard_BOTH:
                enchantment = enchantmentType[rand(0,enchantmentType.length-1)];
                origin = originType[rand(0,originType.length-1)];
                gold = rand(5,7);
                break;
            default: console.error("Err createNewCard"); return;
        }
        
        const card = {
            item: craftingItemType[rand(0,craftingItemType.length-1)],
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
    
    
    function updateTurn(data){
        const {cards, cardsBoard } = data;
        const newCards = {
            card1: (cards.card2.inProgress ? cards.card2 : createNewCard(typeCard_RANDOM)),
            card2: (cards.card3.inProgress ? cards.card3 : createNewCard(typeCard_RANDOM)),
            card3: cardsBoard.shift()
        }

        const updateState = {
            cards: newCards,
            cardsBoard: cardsBoard,
            dices: rollDices()
        }
        return updateState;
    }

    
    
    function gameInit(data){
        const {config} = data;
        //Creazione obj quests, scelgo gl' attribute in modo casuale 
        const quest1Attribute = CraftingAttributes[rand(0,2)] ;
        const quest2Attribute = MagicAttributes[rand(0,2)];

        const quest1 = {
            attribute: quest1Attribute,
            gold : 8
        };

        const quest2 = {
            attribute: quest2Attribute,
            gold : 8
        };
        
        
        const dices = rollDices();
        
        const cardsBoard = [];
        for(let i = 0; i < config.nTurn-1; i++){
            cardsBoard.push(createNewCard(typeCard_RANDOM));
        }
        
        
        const adventurer = Adventurers[rand(0,Adventurers.length-1)];
                
            
        const cards ={
            card1: createNewCard(typeCard_NO_ENCHANTMENT),
            card2: createNewCard(typeCard_NO_ORIGIN),
            card3: createNewCard(typeCard_BOTH),
        }
          
        
        //Metto tutto dentro un unico obj
        const gameInitObj = {
            quest1: quest1,
            quest2: quest2,
            dices : dices,
            adventurer : adventurer,
            cards: cards,
            cardsBoard : cardsBoard,
            config : config
        }


        return gameInitObj;
    }


    function calculateGold(data){
        const {currentGold,shop, renownedAccessories, weaponPrestige, eliteArmor } = data;
        if(shop.length > 0){
            shop.forEach((item)=>{
                if(renownedAccessories && TYPE_ACCESSORIES.includes(item.item)){
                    currentGold += 2;
                }
                if(weaponPrestige && TYPE_WEAPONS.includes(item.item)){
                    currentGold += 2;
                }
                if(eliteArmor && TYPE_ARMOR.includes(item.item)){
                    currentGold += 2;
                }
            })  
        }
  
        return currentGold;
    }

    

    return {
        gameInit, updateTurn, rollDices, createNewCard, calculateGold,craftingItemType, originType, enchantmentType
    };
}

export const gameLogic = createGameLogic(); 
