import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  arrayUnion, 
  arrayRemove
} from 'firebase/firestore';

import { ACTION_REMOVE, DECK_TYPES, ERRORS, LOBBY_STATUS, TYPE_CARDS } from '../constants/constants';
import { Lobby, PlayerConnection } from '../interface/lobby-interface';
import { GameState } from '../interface/game-interface';
import { NotFoundError } from '../Errors/NotFoundError';
import { db } from './db';
import { gameLogicService } from '../service/game-logic-service';

const LOBBY_COLLECTION = 'lobbies';

// Reusable function to get a lobby document
const getLobbyRef = (lobbyID: string) => doc(db, LOBBY_COLLECTION, lobbyID);

// Reusable function to fetch lobby data and throw an error if not found
const getLobbyData = async (lobbyID: string): Promise<Lobby> => {
    const lobbyRef = getLobbyRef(lobbyID);
    const lobbySnap = await getDoc(lobbyRef);
    if (!lobbySnap.exists()) {
        throw new NotFoundError(ERRORS.LOBBY_NOT_FOUND); 
    }
    return {id: lobbyID, ...lobbySnap.data()} as Lobby;
};
const getLobbyNoError = async (lobbyID: string): Promise<Lobby|undefined> => {
    const lobbyRef = getLobbyRef(lobbyID);
    const lobbySnap = await getDoc(lobbyRef);
    if (!lobbySnap.exists()) {
        return;
    }
    return {id: lobbyID, ...lobbySnap.data()} as Lobby;
};

// Reusable function to update lobby
const updateLobby = async (lobbyID: string, updateData: Record<string, any>): Promise<Lobby> => {
    const lobbyRef = getLobbyRef(lobbyID);
    await updateDoc(lobbyRef, updateData);
    return await getLobbyData(lobbyID); // Ritorna la lobby aggiornata
};

const getLobbyById = async (lobbyID: string): Promise<Lobby> => {
    return await getLobbyData(lobbyID);
};

const createLobby = async (player: PlayerConnection): Promise<Lobby> => {
    const lobbyInit = {
        players: [player],
        leader: player.username,
        status: LOBBY_STATUS.IN_LOBBY,
        kickedPlayers:[],
        disconnectedPlayers:[],
        gameState: {
            quest1: false,
            quest2: false,
            nPlayersEndTurn: 0,
            cards: [],
            reports: [],
            finalReports: [],
            decks:{
                itemsDeck: gameLogicService.createDeck(DECK_TYPES.ITEM),
                enchantmentDeck: gameLogicService.createDeck(DECK_TYPES.ENCHANTMENT),
                originDeck: gameLogicService.createDeck(DECK_TYPES.ORIGIN),
            }
        }
    } as Partial<Lobby>;

    const lobbyRef = await addDoc(collection(db, LOBBY_COLLECTION), lobbyInit);
    return { id: lobbyRef.id, ...lobbyInit } as Lobby;
};

// Function to remove player from the lobby
const removePlayerFromLobbyHelper = async (lobbyID: string, player: PlayerConnection, action: ACTION_REMOVE): Promise<Lobby|undefined> => {
    const lobbyData = await getLobbyNoError(lobbyID);
    if(!lobbyData){
        return;
    }
    const updatedPlayers = lobbyData.players.filter(p => p.username !== player.username);

    if (updatedPlayers.length === 0) {
        await deleteDoc(getLobbyRef(lobbyID));
    } else {
        const newLeader = player.username === lobbyData.leader ? updatedPlayers[0].username : lobbyData.leader;
        return await updateLobby(lobbyID, {
            players: updatedPlayers,
            leader: newLeader,
            ...(action === ACTION_REMOVE.KICK ? { kickedPlayers: arrayUnion(player.username) } : {})
        });
    }
};

const addPlayerToLobby = async (lobbyID: string, player: PlayerConnection): Promise<Lobby> => {
    return await updateLobby(lobbyID, {
        players: arrayUnion(player)
    });
};


const leaveLobby = async (lobbyID: string, player: PlayerConnection): Promise<Lobby|undefined> => {
    return await removePlayerFromLobbyHelper(lobbyID, player,  ACTION_REMOVE.REMOVE);
};

const removePlayerFromLobby = async (lobbyID: string, player: PlayerConnection): Promise<Lobby|undefined> => {
    return await removePlayerFromLobbyHelper(lobbyID, player, ACTION_REMOVE.KICK);
};

const removePlayerFromKicked = async (lobbyID: string, player: PlayerConnection): Promise<Lobby> => {
    const lobbyData = await getLobbyData(lobbyID);
    if (lobbyData.kickedPlayers.includes(player.username)) {
        return await updateLobby(lobbyID, {
            kickedPlayers: arrayRemove(player.username)
        });
    }
    return lobbyData;
};

const changeLobbyLeader = async (lobbyID: string, username: string): Promise<Lobby> => {
    const lobbyData = await getLobbyData(lobbyID);
    const playerIndex = lobbyData.players.findIndex((player) => player.username === username);

    if (playerIndex !== -1) {
        const player = lobbyData.players[playerIndex];
        const updatedPlayers = [player, ...lobbyData.players.filter((player) => player.username !== username)];
        return await updateLobby(lobbyID, {
            leader: username,
            players: updatedPlayers
        });
    } else {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
};

const changeLobbyStatus = async (lobbyID: string, status: string): Promise<Lobby> => {
    return await updateLobby(lobbyID, { status });
};

const updateGameState = async (lobbyID: string, newGameState: GameState): Promise<Lobby> => {
    return await updateLobby(lobbyID, { gameState: newGameState });
};

const getGameState = async (lobbyID: string): Promise<GameState> => {
  const lobbyData = await getLobbyData(lobbyID);
  return lobbyData.gameState;
};

export const repositoryLobby = {
  getLobbyById,
  getLobbyNoError,
  createLobby,
  addPlayerToLobby,
  removePlayerFromLobby,
  changeLobbyLeader,
  changeLobbyStatus,
  updateGameState,
  removePlayerFromKicked,
  leaveLobby,
  getGameState
};

