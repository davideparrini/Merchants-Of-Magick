import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  arrayUnion, 
  arrayRemove, 
  persistentMultipleTabManager, 
  persistentLocalCache, 
  initializeFirestore
} from 'firebase/firestore';

import { firebase } from '../Config/firebase-config';
import { ACTION_REMOVE, ERRORS, LOBBY_STATUS } from '../constants/constants';
import { Lobby, GameState, PlayerConnection } from '../interface/lobby-interface';

const db = initializeFirestore(firebase, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });

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
    return lobbySnap.data() as Lobby;
};

// Reusable function to update lobby
const updateLobby = async (lobbyID: string, updateData: Record<string, any>) => {
    const lobbyRef = getLobbyRef(lobbyID);
    await updateDoc(lobbyRef, updateData);
};

const getLobbyById = async (lobbyID: string): Promise<Lobby> => {
    return await getLobbyData(lobbyID);
};

const createLobby = async (player: PlayerConnection): Promise<Lobby> => {
    const lobbyInit = {
        players: [player],
        leaderLobby: player.username,
        status: LOBBY_STATUS.IN_LOBBY,
        gameState: {
            quest1: false,
            quest2: false,
            nPlayersEndTurn: 0,
            cards: [],
            reports: []
        }
    } as Partial<Lobby>;

    const lobbyRef = await addDoc(collection(db, LOBBY_COLLECTION), lobbyInit);
    return {id: lobbyRef.id, ...lobbyInit} as Lobby;
};

// Function to remove player from the lobby
const removePlayerFromLobbyHelper = async (lobbyID: string, player: PlayerConnection, action: ACTION_REMOVE): Promise<void> => {
    const lobbyData = await getLobbyData(lobbyID);  // Non è più nullable
    const updatedPlayers = lobbyData.players.filter(p => p.username !== player.username);

    if (updatedPlayers.length === 0) {
        await deleteDoc(getLobbyRef(lobbyID));
    } else {
        const newLeader = player.username === lobbyData.leader ? updatedPlayers[0].username : lobbyData.leader;
        await updateLobby(lobbyID, {
            players: updatedPlayers,
            leaderLobby: newLeader,
            ...(action === ACTION_REMOVE.KICK && { kickedPlayers: arrayUnion(player.username) })
        });
    }
};

const addPlayerToLobby = async (lobbyID: string, player: PlayerConnection): Promise<void> => {
    const lobbyRef = getLobbyRef(lobbyID);
    const lobbySnap = await getDoc(lobbyRef);
    if (lobbySnap.exists()) {
        await updateDoc(lobbyRef, {
            players: arrayUnion(player),
        });
    }
};

const leaveLobby = async (lobbyID: string, player: PlayerConnection): Promise<void> => {
    await removePlayerFromLobbyHelper(lobbyID, player, ACTION_REMOVE.REMOVE);
};

const removePlayerFromLobby = async (lobbyID: string, player: PlayerConnection): Promise<void> => {
    await removePlayerFromLobbyHelper(lobbyID, player, ACTION_REMOVE.KICK);
};

const removePlayerFromKicked = async (lobbyID: string, player: PlayerConnection): Promise<void> => {
    const lobbyData = await getLobbyData(lobbyID); 
    if (lobbyData && lobbyData.kickedPlayers.includes(player.username)) {
        await updateLobby(lobbyID, {
            kickedPlayers: arrayRemove(player.username)
        });
    }
};

const changeLobbyLeader = async (lobbyID: string, username: string): Promise<void> => {
    const lobbyData = await getLobbyData(lobbyID);  
    
    const playerIndex = lobbyData.players.findIndex((player) => player.username === username);
    if (playerIndex !== -1) {
        const player = lobbyData.players[playerIndex];
        const updatedPlayers = [player, ...lobbyData.players.filter((player) => player.username !== username)];
        await updateLobby(lobbyID, {
            leaderLobby: username,
            players: updatedPlayers
        });
    } else {
        console.log("Player not found in the lobby.");
    }
    
};

const changeLobbyStatus = async (lobbyID: string, status: string): Promise<void> => {
    await updateLobby(lobbyID, { status });
};

const updateGameState = async (lobbyID: string, newGameState: GameState): Promise<void> => {
    await updateLobby(lobbyID, { gameState: newGameState });
};

export const repositoryLobby = {
    getLobbyById,
    createLobby,
    addPlayerToLobby,
    removePlayerFromLobby,
    changeLobbyLeader,
    changeLobbyStatus,
    updateGameState,
    removePlayerFromKicked,
    leaveLobby
};
