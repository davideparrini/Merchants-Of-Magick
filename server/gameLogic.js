import barbarian from './Adventurers/barbarian.json';
import cleric from './Adventurers/cleric.json';
import knight from './Adventurers/knight.json';
import ranger from './Adventurers/ranger.json';
import warrior from './Adventurers/warrior.json';
import witch from './Adventurers/witch.json';
import wizard from './Adventurers/wizard.json';


const craftingItemType = [
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
];

const originType = [elves,
    dwarves, 
    orcs,
    dragons
];

const enchantmentType = [ fiery,
    shocking,
    everlasting,
    divine
];


const typeOrder_RANDOM = 'RANDOM';
const typeOrder_NO_ENCHANTMENT= 'NO_ENCHANTMENT';
const typeOrder_NO_ORIGIN = 'NO_ORIGIN';
const typeOrder_BOTH = "BOTH";


function chooseRandomTypeOrder(){
    const r = Math.floor(Math.random() * 3);
    switch (r){
        case 0: return typeOrder_NO_ENCHANTMENT;
        case 1: return typeOrder_NO_ORIGIN;
        case 2: return typeOrder_BOTH;
    }
}

function createNewCard(typeCard){
    var orderJson = {item,gold,enchantment,origin,inProgress}; 
    let t_order = typeCard == typeOrder_RANDOM ? chooseRandomTypeOrder() : typeCard;
    orderJson.item = craftingItemType[Math.floor(Math.random() * craftingItemType.length)];
    switch(t_order){
        case typeOrder_NO_ENCHANTMENT:
            orderJson.origin = originType[Math.floor(Math.random() * originType.length)];
            orderJson.gold = Math.floor(Math.random() * 4) + 2;
            break;
        case typeOrder_NO_ORIGIN:
            orderJson.enchantment = enchantmentType[Math.floor(Math.random() * enchantmentType.length)];
            orderJson.gold = Math.floor(Math.random() * 3) + 3;
            break;
        case typeOrder_BOTH:
            orderJson.enchantment = enchantmentType[Math.floor(Math.random() * enchantmentType.length)];
            orderJson.origin = originType[Math.floor(Math.random() * originType.length)];
            orderJson.gold = Math.floor(Math.random() * 4) + 4;
            break;
    }
    orderJson.inProgress = true;
    return JSON.stringify(orderJson);
}

export function rollDices(){
    var dicesJson = {d6,d8,d10,d12};
    dicesJson.d6 = Math.floor(Math.random() * 6) + 1;
    dicesJson.d8 = Math.floor(Math.random() * 8) + 1;
    dicesJson.d10 = Math.floor(Math.random() * 10) + 1;
    dicesJson.d12 = Math.floor(Math.random() * 12) + 1;
    return JSON.stringify(dicesJson);
}


export function addNewCards_slipCards(listPlayers){
    let oldListCards =[];
    let newListCards = [];
    listPlayers.forEach((p) =>
        p.cards.map((c)=>oldListCards.push(c)) 
    )
    oldListCards.forEach((c)=>{
        if(!c.inProgress){
            newCard = createNewCard(typeOrder_RANDOM);
            newListCards.push(newCard);
        }
        else{
            newListCards.push(c);
        }
    })
    let json = [];
   for(i=0; i < listPlayers.length-1;i++){
        let playerJson = {
            nickname,
            cards:{
                card1,
                card2,
                card3
            }
        };
        playerJson.nickname = listPlayers[i].nickname;
        cards.card1 = newListCards.shift();
        cards.card2 = newListCards.shift();
        cards.card3 = newListCards.shift();
        json.push(playerJson);
   }

}