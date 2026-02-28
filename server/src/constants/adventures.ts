import { Adventurer } from '../interface/game-interface';

export const BARBARIAN: Adventurer = {
  adventurer: "The Barbarian",
  typeOrder: "of the orcs",
  order1: "scroll",
  order2: "warhammer",
  order3: "helmet",
  gold: 5,
};

export const BOUNTY_HUNTER: Adventurer = {
  adventurer: "Bounty Hunter",
  typeOrder: "everlasting",
  order1: "ring",
  order2: "warhammer",
  order3: "helmet",
  gold: 5,
};

export const CLERIC: Adventurer = {
  adventurer: "The Cleric",
  typeOrder: "divine",
  order1: "backpack",
  order2: "sword",
  order3: "helmet",
  gold: 6,
};

export const KNIGHT: Adventurer = {
  adventurer: "The Knight",
  typeOrder: "of the dragons",
  order1: "backpack",
  order2: "sword",
  order3: "helmet",
  gold: 6,
};

export const RANGER: Adventurer = {
  adventurer: "The Ranger",
  typeOrder: "of the elves",
  order1: "ring",
  order2: "staff",
  order3: "plate armor",
  gold: 6,
};

export const WARRIOR: Adventurer = {
  adventurer: "The Warrior",
  typeOrder: "of the dwarves",
  order1: "grimoire",
  order2: "crossbow",
  order3: "bracers",
  gold: 6,
};

export const WITCH: Adventurer = {
  adventurer: "The Witch",
  typeOrder: "fiery",
  order1: "scroll",
  order2: "staff",
  order3: "plate armor",
  gold: 5,
};

export const WIZARD: Adventurer = {
  adventurer: "The Wizard",
  typeOrder: "shocking",
  order1: "ring",
  order2: "crossbow",
  order3: "greaves",
  gold: 4,
};

export const ADVENTURERS: Adventurer[] = [
  BARBARIAN,
  BOUNTY_HUNTER,
  CLERIC,
  KNIGHT,
  RANGER,
  WARRIOR,
  WITCH,
  WIZARD,
];
