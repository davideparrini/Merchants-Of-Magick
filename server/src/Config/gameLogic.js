const {
    CRAFTING_ITEM_TYPES,
    ORIGIN_TYPES,
    ENCHANTMENT_TYPES,
    CRAFTING_ATTRIBUTES,
    MAGIC_ATTRIBUTES,
    TYPE_CARDS,
    ITEM_CATEGORIES,
    DECK_TYPES
} = require("../constants/constants.js");

const barbarian = require("../Adventurers/barbarian.json");
const bountyHunter = require("../Adventurers/bountyHunter.json");
const cleric = require("../Adventurers/cleric.json");
const knight = require("../Adventurers/knight.json");
const ranger = require("../Adventurers/ranger.json");
const warrior = require("../Adventurers/warrior.json");
const witch = require("../Adventurers/witch.json");
const wizard = require("../Adventurers/wizard.json");

function createGameLogic() {
    const Adventurers = [barbarian, bountyHunter, cleric, knight, ranger, warrior, witch, wizard];

    let counter = 1;
    let prevRand = 1;

    let deckItem = [];
    let deckEnchantment = [];
    let deckOrigin = [];

    const rand = (min, max) => {
        if (counter < 0) counter = Math.floor(Math.random() * 9887);
        if (prevRand < 0) prevRand = Math.floor(Math.random() * 9199);
        const time = new Date().getTime();
        const randValue = (((time / counter) / (prevRand + 1)) % (max - min + 1)) + min;
        counter++;
        prevRand = randValue;
        return parseInt(randValue);
    };

    function shuffle(array) {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex > 0) {
            randomIndex = rand(0, currentIndex - 1);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function createDeck(typeDeck) {
        switch (typeDeck) {
            case DECK_TYPES.ITEM:
                return shuffle([...CRAFTING_ITEM_TYPES, ...CRAFTING_ITEM_TYPES, ...CRAFTING_ITEM_TYPES]);
            case DECK_TYPES.ENCHANTMENT:
                return shuffle([...ENCHANTMENT_TYPES, ...ENCHANTMENT_TYPES, ...ENCHANTMENT_TYPES]);
            case DECK_TYPES.ORIGIN:
                return shuffle([...ORIGIN_TYPES, ...ORIGIN_TYPES, ...ORIGIN_TYPES]);
            default:
                return [];
        }
    }

    function chooseRandomTypeCard() {
        const value = rand(0, 2);
        switch (value) {
            case 0: return TYPE_CARDS.NO_ENCHANTMENT;
            case 1: return TYPE_CARDS.NO_ORIGIN;
            case 2: return TYPE_CARDS.BOTH;
            default:
                console.error("Error in chooseRandomTypeCard");
                return null;
        }
    }

    function createNewCard(typeCard) {
        let t_card = typeCard === TYPE_CARDS.RANDOM ? chooseRandomTypeCard() : typeCard;
        let origin = "";
        let gold = 0;
        let enchantment = "";

        if (deckItem.length === 0) deckItem = createDeck(DECK_TYPES.ITEM);
        if (deckEnchantment.length === 0) deckEnchantment = createDeck(DECK_TYPES.ENCHANTMENT);
        if (deckOrigin.length === 0) deckOrigin = createDeck(DECK_TYPES.ORIGIN);

        switch (t_card) {
            case TYPE_CARDS.NO_ENCHANTMENT:
                origin = deckOrigin.pop();
                gold = rand(3, 5);
                break;
            case TYPE_CARDS.NO_ORIGIN:
                enchantment = deckEnchantment.pop();
                gold = rand(3, 5);
                break;
            case TYPE_CARDS.BOTH:
                enchantment = deckEnchantment.pop();
                origin = deckOrigin.pop();
                gold = rand(6, 8);
                break;
            default:
                console.error("Error in createNewCard");
                return null;
        }

        return {
            item: deckItem.pop(),
            gold,
            enchantment,
            origin,
            inProgress: true
        };
    }

    function rollDices() {
        return {
            d6: rand(1, 6),
            d8: rand(1, 8),
            d10: rand(1, 10),
            d12: rand(1, 12)
        };
    }

    function updateCardsTurn(cards, players) {
        let oldListCards = [];
        let newListCards = [];

        players.forEach((username) => {
            let indexPlayer = cards.findIndex((u) => u.username === username);
            oldListCards.push(cards[indexPlayer].card1, cards[indexPlayer].card2, cards[indexPlayer].card3);
        });

        oldListCards.forEach((c) => {
            newListCards.push(c.inProgress ? c : createNewCard(TYPE_CARDS.RANDOM));
        });

        const cardSlip = newListCards.shift();
        newListCards.push(cardSlip);

        return players.map((username) => ({
            username,
            cards: {
                card1: newListCards.shift(),
                card2: newListCards.shift(),
                card3: newListCards.shift()
            }
        }));
    }

    function gameInit(players, config) {
        const quest1Attribute = CRAFTING_ATTRIBUTES[rand(0, 2)];
        const quest2Attribute = MAGIC_ATTRIBUTES[rand(0, 2)];

        return {
            quests: {
                quest1: { attribute: quest1Attribute, gold: 8 },
                quest2: { attribute: quest2Attribute, gold: 8 }
            },
            dices: rollDices(),
            players: players.map((username, i) => ({
                username,
                adventurer: shuffle([...Adventurers])[i],
                cards: {
                    card1: createNewCard(TYPE_CARDS.NO_ENCHANTMENT),
                    card2: createNewCard(TYPE_CARDS.NO_ORIGIN),
                    card3: createNewCard(TYPE_CARDS.BOTH)
                }
            })),
            config
        };
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
                    if(renownedAccessories && ITEM_CATEGORIES.ACCESSORIES.includes(item.item)){
                        newReport.report.gold+= 2;
                    }
                    if(weaponPrestige && ITEM_CATEGORIES.WEAPONS.includes(item.item)){
                        newReport.report.gold += 2;
                    }
                    if(eliteArmor && ITEM_CATEGORIES.ARMOR.includes(item.item)){
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
        gameInit, 
        updateCardsTurn, 
        rollDices,  
        winnerResolution
    };
}

const gameLogic = createGameLogic();
module.exports.gameLogic = gameLogic;


