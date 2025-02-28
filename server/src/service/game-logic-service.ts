import {
  CRAFTING_ITEM_TYPES,
  ORIGIN_TYPES,
  ENCHANTMENT_TYPES,
  CRAFTING_ATTRIBUTES,
  MAGIC_ATTRIBUTES,
  TYPE_CARDS,
  ITEM_ACCESSORIES,
  ITEM_WEAPONS,
  ITEM_ARMOR,
  DECK_TYPES
} from "../constants/constants";

import { ADVENTURERS } from '../constants/adventures';

import {
  Card,
  DiceRolls,
  GameInitConfig,
  SignedFinalReport,
  ResolvedFinalReport,
  SignedDeckCards,
  Decks,
  GameInitState
} from "../interface/game-interface";
import { repositoryLobby } from "../repository/lobby-repository";


let counter = 1;
let prevRand = 1;

const rand = (min: number, max: number): number => {
  if (counter < 0) counter = Math.floor(Math.random() * 9887);
  if (prevRand < 0) prevRand = Math.floor(Math.random() * 9199);
  const time = new Date().getTime();
  const randValue = (((time / counter) / (prevRand + 1)) % (max - min + 1)) + min;
  counter++;
  prevRand = randValue;
  return parseInt(randValue.toString());
};

const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex > 0) {
    randomIndex = rand(0, currentIndex - 1);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const createDeck = (typeDeck: string): string[] => {
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
};

const chooseRandomTypeCard = (): string => {
  const value = rand(0, 2);
  switch (value) {
    case 0: return TYPE_CARDS.NO_ENCHANTMENT;
    case 1: return TYPE_CARDS.NO_ORIGIN;
    case 2: return TYPE_CARDS.BOTH;
    default:
      console.error("Error in chooseRandomTypeCard");
      return TYPE_CARDS.NO_ENCHANTMENT;
  }
};

const createNewCard = (typeCard: string, decks: Decks): Card => {
  let t_card = typeCard === TYPE_CARDS.RANDOM ? chooseRandomTypeCard() : typeCard;
  let origin = "";
  let gold = 0;
  let enchantment = "";

  if (decks.itemsDeck.length === 0) decks.itemsDeck = createDeck(DECK_TYPES.ITEM);
  if (decks.enchantmentDeck.length === 0) decks.enchantmentDeck = createDeck(DECK_TYPES.ENCHANTMENT);
  if (decks.originDeck.length === 0) decks.originDeck = createDeck(DECK_TYPES.ORIGIN);

  switch (t_card) {
    case TYPE_CARDS.NO_ENCHANTMENT:
      origin = decks.originDeck.pop() || "";
      gold = rand(3, 5);
      break;
    case TYPE_CARDS.NO_ORIGIN:
      enchantment = decks.enchantmentDeck.pop() || "";
      gold = rand(3, 5);
      break;
    case TYPE_CARDS.BOTH:
      enchantment = decks.enchantmentDeck.pop() || "";
      origin = decks.originDeck.pop() || "";
      gold = rand(6, 8);
      break;
  }

  return {
    item: decks.itemsDeck.pop() || "",
    gold,
    enchantment,
    origin,
    inProgress: true,
  };
};

const rollDices = (): DiceRolls => ({
  d6: rand(1, 6),
  d8: rand(1, 8),
  d10: rand(1, 10),
  d12: rand(1, 12),
});

const updateCardsTurn = (cards: SignedDeckCards[], players: string[], decks: Decks, orderPlayers: string[]): SignedDeckCards[] => {
  let oldListCards: Card[] = [];
  let newListCards: Card[] = [];

  const sortedPlayers = players
    .filter(username => orderPlayers.includes(username))
    .sort((a, b) => orderPlayers.indexOf(a) - orderPlayers.indexOf(b));
  
  sortedPlayers.forEach((username) => {
    let indexPlayer = cards.findIndex((u) => u.username === username);
    oldListCards.push(cards[indexPlayer].card1, cards[indexPlayer].card2, cards[indexPlayer].card3);
  });

  oldListCards.forEach((c) => {
    newListCards.push(c.inProgress ? c : createNewCard(TYPE_CARDS.RANDOM, decks)!);
  });

  const cardSlip = newListCards.shift();
  newListCards.push(cardSlip!);

  return sortedPlayers.map((username) => ({
    username,
    card1: newListCards.shift()!,
    card2: newListCards.shift()!,
    card3: newListCards.shift()!,
  }));
};

const gameInit = async (players: string[], config: GameInitConfig, lobbyID: string): Promise<GameInitState> => {
  
  const shuffledPlayers = shuffle(players);
  const gameState = await repositoryLobby.getGameState(lobbyID);
  
  const quest1Attribute = CRAFTING_ATTRIBUTES[rand(0, 2)];
  const quest2Attribute = MAGIC_ATTRIBUTES[rand(0, 2)];
  const adventures = shuffle([...ADVENTURERS]);

  const gameInitState = {
    quest1: { attribute: quest1Attribute, gold: 8 },
    quest2: { attribute: quest2Attribute, gold: 8 },
    
    dices: rollDices(),
    players: shuffledPlayers.map((username, i) => ({
      username,
      adventurer: adventures[i],
      card1: createNewCard(TYPE_CARDS.NO_ENCHANTMENT, gameState.decks),
      card2: createNewCard(TYPE_CARDS.NO_ORIGIN, gameState.decks),
      card3: createNewCard(TYPE_CARDS.BOTH, gameState.decks),
    })),
    config,
  };
  gameState.orderPlayers = shuffledPlayers;
  await repositoryLobby.updateGameState(lobbyID, gameState);

  return gameInitState;
};

const compareByGold = (a: ResolvedFinalReport, b: ResolvedFinalReport): number => b.gold - a.gold;

const calculateGold = (finalReport: SignedFinalReport[]): ResolvedFinalReport[] => finalReport.map((r) => {
  const newReport = {
    username: r.username,
    position: 1,
    gold: 0,
    report: r.report
  };
  const renownedAccessories = r.report.renownedAccessories;
  const weaponPrestige = r.report.weaponPrestige;
  const eliteArmor = r.report.eliteArmor;

  if (r.report.shop.length > 0) {
    r.report.shop.forEach((item) => {
      if (renownedAccessories && ITEM_ACCESSORIES.includes(item)) {
        newReport.gold += 2;
      }
      if (weaponPrestige && ITEM_WEAPONS.includes(item)) {
        newReport.gold += 2;
      }
      if (eliteArmor && ITEM_ARMOR.includes(item)) {
        newReport.gold += 2;
      }
    });
  }

  return newReport;
});

const calculatePositions = (sortedReport: ResolvedFinalReport[]): ResolvedFinalReport[] => {
  let currentPosition = 1; // La posizione iniziale è 1
  let previousGold = sortedReport[0].gold; // Il gold del primo giocatore
  sortedReport[0].position = currentPosition; // Assegniamo la posizione al primo giocatore

  for (let i = 1; i < sortedReport.length; i++) {
    const currentReport = sortedReport[i];
    if (currentReport.gold === previousGold) {
      // Se il gold è uguale a quello del giocatore precedente, manteniamo la stessa posizione
      currentReport.position = currentPosition;
    } else {
      // Se il gold è diverso, incrementiamo la posizione
      currentPosition = i + 1; // La posizione è l'indice + 1
      currentReport.position = currentPosition;
    }
    // Aggiorniamo il gold precedente per il prossimo confronto
    previousGold = currentReport.gold;
  }

  return sortedReport;
};

const winnerResolution = (finalReport: SignedFinalReport[]): ResolvedFinalReport[] => {
  const addedGoldReport = calculateGold(finalReport);
  const sortedReport = addedGoldReport.sort(compareByGold);
  return calculatePositions(sortedReport);
};

  

export const gameLogicService = {
  gameInit,
  updateCardsTurn,
  rollDices,
  winnerResolution,
  createDeck
}
