export const LOBBY_STATUS = {
    IN_LOBBY: "in-lobby",
    IN_GAME: "in-game",
    GAME_OVER: "game-over"
} as const;

export const ERRORS = {
    LOBBY_NOT_FOUND: "Lobby not found",
    GAME_CONTINUED: "Game continued without you",
    LOBBY_STARTED: "The lobby started the game",
    GAME_NOT_STARTED: "Game has not started yet",
    GAME_NOT_OVER: "Game is still in progress",
    GAME_OVER: "Game over",
    PLAYER_ALREADY_IN_LOBBY: "Player is already in a lobby",
    LOBBY_FULL: "Lobby is full",
    PLAYER_NOT_FOUND: "Player is no longer in the lobby",
    PLAYER_NOT_JOINED_LOBBY: "Player has never joined this lobby", 
    PLAYER_KICKED: "Player was kicked from the lobby",
    NOT_LOBBY_LEADER: "Only the lobby leader can kick players"
} as const;


export const CRAFTING_ITEM_TYPES = [
    "backpack", "scroll", "ring", "grimoire",
    "staff", "sword", "crossbow", "warhammer",
    "bracers", "helmet", "greaves", "plate armor"
];

export const ORIGIN_TYPES = [
    "of the elves", "of the dwarves",
    "of the orcs", "of the dragons"
];

export const ENCHANTMENT_TYPES = [
    "fiery", "shocking", "everlasting", "divine"
];

export const CRAFTING_ATTRIBUTES = ["steel", "wood", "leather"];
export const MAGIC_ATTRIBUTES = ["elemental", "arcane", "wild"];

export const TYPE_CARDS = {
    RANDOM: "RANDOM",
    NO_ENCHANTMENT: "NO_ENCHANTMENT",
    NO_ORIGIN: "NO_ORIGIN",
    BOTH: "BOTH"
} as const;

export const ITEM_ACCESSORIES = ["backpack", "scroll", "ring", "grimoire"];
export const ITEM_ARMOR = ["bracers", "helmet", "greaves", "plate armor"];
export const ITEM_WEAPONS = ["staff", "sword", "crossbow", "warhammer"];


export const DECK_TYPES = {
    ITEM: "TYPE_DECK_ITEM",
    ENCHANTMENT: "TYPE_DECK_ENCHANTMENT",
    ORIGIN: "TYPE_DECK_ORIGIN"
} as const;

  
  export enum ACTION_REMOVE {
    KICK,
    REMOVE
  }