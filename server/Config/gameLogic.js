import barbarian from '../Adventurers/barbarian.json' assert { type: "json" };
import bountyHunter from '../Adventurers/bountyHunter.json' assert { type: "json" };
import cleric from '../Adventurers/cleric.json' assert { type: "json" };
import knight from '../Adventurers/knight.json' assert { type: "json" };
import ranger from '../Adventurers/ranger.json' assert { type: "json" };
import warrior from '../Adventurers/warrior.json' assert { type: "json" };
import witch from '../Adventurers/witch.json' assert { type: "json" };
import wizard from '../Adventurers/wizard.json' assert { type: "json" };

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
    
    const Adventurers = [barbarian,bountyHunter,cleric,knight,ranger,warrior,witch,wizard];
    const CraftingAttributes = ['steel','wood', 'leather'];
    const MagicAttributes = ['elemental','arcane','wild'];

    const typeCard_RANDOM = 'RANDOM';
    const typeCard_NO_ENCHANTMENT= 'NO_ENCHANTMENT';
    const typeCard_NO_ORIGIN = 'NO_ORIGIN';
    const typeCard_BOTH = "BOTH";
    
    const TYPE_ACCESSORIES=['backpack','scroll','ring','grimoire'];
    const TYPE_ARMOR=['bracers','helmet','greaves','plate armor'];
    const TYPE_WEAPONS=['staff','sword','crossbow','warhammer'];

    //Funzione utilis per mischiare un array
    //Shuffle algorithm -> Fisher-Yates Shuffle
    function shuffle(array) {
        var currentIndex = array.length;
        var randomIndex;
        
        while(currentIndex > 0){
            
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            //scambio gl'elementi dell'array agl'indici currentIndex e randomIndex
            [ array[currentIndex], array[randomIndex] ] = [ array[randomIndex] , array[currentIndex]];
            
        }

        return array;
    }

    //Scelgo un tipo di ordine random 
    function chooseRandomTypeCard(){
        const r = Math.floor(Math.random() * 3);
        
        switch (r){
            case 0: return typeCard_NO_ENCHANTMENT;
            case 1: return typeCard_NO_ORIGIN;
            case 2: return typeCard_BOTH;
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
                origin = originType[Math.floor(Math.random() * originType.length)];
                gold = Math.floor(Math.random() * 4) + 3;
                break;
            case typeCard_NO_ORIGIN:
                enchantment = enchantmentType[Math.floor(Math.random() * enchantmentType.length)];
                gold = Math.floor(Math.random() * 3) + 3;
                break;
            case typeCard_BOTH:
                enchantment = enchantmentType[Math.floor(Math.random() * enchantmentType.length)];
                origin = originType[Math.floor(Math.random() * originType.length)];
                gold = Math.floor(Math.random() * 4) + 4;
                break;
        }
        
        const card = {
            item: craftingItemType[Math.floor(Math.random() * craftingItemType.length)],
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
            d6 : Math.floor(Math.random() * 6) + 1,
            d8 : Math.floor(Math.random() * 8) + 1,
            d10 : Math.floor(Math.random() * 10) + 1,
            d12 : Math.floor(Math.random() * 12) + 1
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
        const quest1Attribute = CraftingAttributes[Math.floor(Math.random() * 3)] ;
        const quest2Attribute = MagicAttributes[Math.floor(Math.random() * 3)];

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
        console.log(config)
        //Metto tutto dentro un unico obj
        const gameInitObj ={
            quests : quests,
            dices : dices,
            players : playerArray,
            nPotion : config.nPotion,
            nTurn : config.nTurn
        }
        return gameInitObj;
    }



    function compareByGold(a,b){
        return b.report.gold - a.report.gold;
    }

    function calculateGold(finalReport){
        const newFinalReport = [];
        finalReport.map((r)=>{
            
            const newReport = {
                username: r.username,
                position: -1,
                report: r.report
            }
            if(r.report.shop.length > 0){
                if(r.report.renownedAccessories){
                    r.report.shop.map((item)=>{
                        if(TYPE_ACCESSORIES.includes(item.item)){
                            newReport.report.gold+= 2;
                        }
                    })
                }
                if(r.report.weaponPrestige){
                    r.report.shop.map((item)=>{
                        if(TYPE_WEAPONS.includes(item.item)){
                            newReport.report.gold += 2;
                        }
                    })
                }
                if(r.report.eliteArmor){
                    r.report.shop.map((item)=>{
                        if(TYPE_ARMOR.includes(item.item)){
                            newReport.report.gold += 2;
                        }
                    })
                }   
            }

            newFinalReport.push(newReport);

        })
        
        return newFinalReport;
    }

    function winnerResolution(finalReport){
        console.log(finalReport)
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

        console.log(resolvedFinalReport);
        return resolvedFinalReport;
    }

    return {
        gameInit, updateCardsTurn, rollDices, createNewCard, winnerResolution, craftingItemType, originType, enchantmentType
    };
}

export const gameLogic = createGameLogic(); 
