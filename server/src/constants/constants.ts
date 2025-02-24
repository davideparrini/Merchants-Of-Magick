export const LOBBY_STATUS = {
    IN_LOBBY: "in-lobby",
    IN_GAME: "in-game",
    GAME_OVER: "game-over"
} as const;

export const ERRORS = {
    LOBBY_NOT_FOUND: "Lobby not found",
    GAME_ALREADY_STARTED: "Game already started",
    LOBBY_FULL: "Lobby is full",
    PLAYER_NOT_FOUND: "Player not found in lobby",
    NOT_LOBBY_LEADER: "Only the leader can kick players"
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
