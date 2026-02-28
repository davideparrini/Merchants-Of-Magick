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
  export interface SignedAdventurer {
    adventurer: Adventurer;
    username: string;
  }


  export interface GameState {
    quest1: boolean;
    quest2: boolean;
    cards: SignedDeckCards[];
    reports: SignedReport[];
    finalReports: SignedFinalReport[];
    decks: Decks;
    orderPlayers: string[];
  }

  export interface GameStateBackup {
    lastGameState: GameState;
    lastTurnPlayed: number;
    lastDiceRolls: DiceRolls;
    quest1: Quest; 
    quest2: Quest;
    playerAdventurers: SignedAdventurer[];
    initConfig: GameInitConfig;
  }
  
  
  export interface Decks {
    itemsDeck: string[];
    enchantmentDeck: string[];
    originDeck: string[];
  }

  export interface SignedDeckCards{
    username:string;
    card1:Card;
    card2:Card;
    card3:Card;
  }

  export interface SignedReport {
    username: string;
    report: Report;
}


// Interfaccia per le carte nel gioco
export interface Card {
    item: string;
    gold: number;
    enchantment?: string;
    origin?: string;
    inProgress: boolean;
}


export interface Report{
    skills: string[];
    items: string[];
    quest1: boolean;
    quest2: boolean;
}


// Interfaccia per il giocatore
export interface PlayerStartGame {
    username: string;
    adventurer: Adventurer;
    card1: Card;
    card2: Card;
    card3: Card;
}

export interface GameInitState { 
    quest1: Quest; 
    quest2: Quest;
    dices: DiceRolls; 
    players: PlayerStartGame[]; 
    config: GameInitConfig 
}


export interface PlayerGame {
    username: string;
    card1: Card;
    card2: Card;
    card3: Card;
    report: Report;
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
    nTurn : number;
    nPotion : number;
    reportTime : number;
    countdown : number;
    dicePerTurn : number; 
}



// Interfaccia per i report finali
export interface SignedFinalReport {
    username: string;
    report: FinalReport;
}
export interface FinalReport {
    shop: string[];
    quest1:boolean;
    quest2:boolean;
    order:boolean;
    renownedAccessories: boolean;
    weaponPrestige: boolean;
    eliteArmor: boolean;
    gold: number;
}


// Interfaccia per il risultato finale
export interface ResolvedFinalReport {
    username: string;
    position: number;
    gold: number;
    report: FinalReport;
}


export interface  BackupPlayer {
    nTurn: number;
    currentGold: number;
    nPotion: number;
    shop: Card[]; 
    skillsTree: Map<number, SkillTree>; 
    skillsGained: string[];
    freeUpgrade: number;
    adventurerQuestDone: boolean;
    nAttributeGained_QuestCrafting: number;
    nAttributeGained_QuestMagicResearch: number;
    quest1Done: boolean;
    quest2Done: boolean;
    extraDiceUsed: {
      ed1: boolean;
      ed2: boolean;
      ed3: boolean;
      ed4: boolean;
      ed5: boolean;
      ed6: boolean;
    };
}


export interface BackupResponse {
    backupPlayer: BackupPlayer,
    backupGameState: GameStateBackup
}

interface SkillTree {
    attribute1: boolean,
    attribute2: boolean,
    attribute3: boolean
}

export interface ArchivedGame {
    lobbyID:string,
    finalReports: ResolvedFinalReport[]
}