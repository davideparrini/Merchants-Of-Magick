


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

export function createOrder(typeOrder){
    var orderJson = {item,gold,enchantment,origin}; 
    let t_order = typeOrder == typeOrder_RANDOM ? chooseRandomTypeOrder() : typeOrder;
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
