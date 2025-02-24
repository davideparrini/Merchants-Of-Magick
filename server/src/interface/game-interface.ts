// interfaces.ts

// Interfaccia per il tipo di avventuriero
export interface Adventurer {
    adventurer: string;
    typeOrder: string;
    order1: string;
    order2: string;
    order3: string;
    gold: number;
  }
  

// Interfaccia per le carte nel gioco
export interface Card {
    item: string;
    gold: number;
    enchantment: string;
    origin: string;
    inProgress: boolean;
}

// Interfaccia per il giocatore
export interface PlayerGame {
    username: string;
    adventurer: Adventurer;
    cards: {
        card1: Card;
        card2: Card;
        card3: Card;
    };
}

// Interfaccia per i tiri dei dadi
export interface DiceRolls {
    d6: number;
    d8: number;
    d10: number;
    d12: number;
}

// Interfaccia per le quest
export interface Quest {
    attribute: string;
    gold: number;
}

// Configurazione di inizio gioco
export interface GameInitConfig {
    [key: string]: any; // Dettagli di configurazione aggiuntivi
}

export interface Report {
    username: string;
    report: {
        skills: string[];
        items: string[];
        quest1: boolean;
        quest2: boolean;
    }
}

// Interfaccia per i report finali
export interface FinalReport {
    username: string;
    position: number;
    report: {
        gold: number;
        renownedAccessories: boolean;
        weaponPrestige: boolean;
        eliteArmor: boolean;
        shop: string[];
    };
}

// Interfaccia per il risultato finale
export interface ResolvedFinalReport {
    username: string;
    position: number;
    report: {
        gold: number;
    };
}

