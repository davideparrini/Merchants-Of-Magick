import { arrayUnion, arrayRemove, collection, doc, addDoc, onSnapshot, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ACTION_REMOVE, DECK_TYPES, ERRORS, LOBBY_STATUS } from '../constants/constants';

import { NotFoundError } from '../Errors/NotFoundError';
import { dbFirestore } from '../../Config/FirebaseConfig';
import { gameLogicService } from '../service/game-logic-service';
import { gameService } from '../service/game-service';


// Reusable function to fetch lobby data and throw an error if not found
const getLobbyData = async (lobbyID) => {
    const lobbyRef = doc(dbFirestore, "lobbies", lobbyID);
    const lobbySnap = await getDoc(lobbyRef);
    if (!lobbySnap.exists()) {
        throw new NotFoundError(ERRORS.LOBBY_NOT_FOUND);
    }
    return { id: lobbyID, ...lobbySnap.data() };
};

const getLobbyNoError = async (lobbyID) => {
    const lobbyRef = doc(dbFirestore, "lobbies", lobbyID);
    const lobbySnap = await getDoc(lobbyRef);
    if (!lobbySnap.exists()) {
        return;
    }
    return { id: lobbyID, ...lobbySnap.data() };
};

// Reusable function to update lobby
const updateLobby = async (lobbyID, updateData) => {
    try {
        const lobbyRef = doc(dbFirestore, "lobbies", lobbyID);
        await updateDoc(lobbyRef, updateData);
        return await getLobbyData(lobbyID); // Return the updated lobby
    } catch (error) {
        console.error("Error updating lobby:", error);
        throw error;
    }
};

const getLobbyById = async (lobbyID) => {
    return await getLobbyData(lobbyID);
};

const createLobby = async (player) => {
    const lobbyInit = {
        players: [player],
        leader: player,
        status: LOBBY_STATUS.IN_LOBBY,
        kickedPlayers: [],
        disconnectedPlayers: [],
        backupPlayers: [],
        backupGameState: {},
        gameInitState:{},
        gameState: {
            quest1: false,
            quest2: false,
            nPlayerFinishTurn: 0,
            cards: [],
            reports: [],
            finalReports: [],
            orderPlayers: [],
            decks: {
                itemsDeck: gameLogicService.createDeck(DECK_TYPES.ITEM),
                enchantmentDeck: gameLogicService.createDeck(DECK_TYPES.ENCHANTMENT),
                originDeck: gameLogicService.createDeck(DECK_TYPES.ORIGIN),
            }
        }
    };

    const lobbiesCollection = collection(dbFirestore, "lobbies");
    const lobbyRef = await addDoc(lobbiesCollection, lobbyInit);
    return { id: lobbyRef.id, ...lobbyInit };
};

// Function to remove player from the lobby
const removePlayerFromLobbyHelper = async (lobbyID, player, action) => {
    const lobbyData = await getLobbyNoError(lobbyID);
    if (!lobbyData) {
        return;
    }
    const updatedPlayers = lobbyData.players.filter(p => p !== player);

    if (updatedPlayers.length === 0) {
        await deleteDoc(doc(dbFirestore, "lobbies", lobbyID));
    } else {
        const newLeader = player === lobbyData.leader ? updatedPlayers[0] : lobbyData.leader;
        return await updateLobby(lobbyID, {
            players: updatedPlayers,
            leader: newLeader,
            ...(
                (action === ACTION_REMOVE.KICK ? { kickedPlayers: arrayUnion(player) } : {} )
                ||
                (action === ACTION_REMOVE.DISCONECTED ? { disconnectedPlayers: arrayUnion(player) } : {} )
            )
        });
    }
};

const addPlayerToLobby = async (lobbyID, player) => {
    return await updateLobby(lobbyID, {
        players: arrayUnion(player),
        disconnectedPlayers: arrayRemove(player)
    });
};

const leaveLobby = async (lobbyID, player) => {
    return await removePlayerFromLobbyHelper(lobbyID, player, ACTION_REMOVE.REMOVE);
};

const removePlayerFromLobby = async (lobbyID, player) => {
    return await removePlayerFromLobbyHelper(lobbyID, player, ACTION_REMOVE.KICK);
};
const disconnectPlayerFromLobby = async (lobbyID, player) => {
    return await removePlayerFromLobbyHelper(lobbyID, player, ACTION_REMOVE.DISCONECTED);
};

const removePlayerFromKicked = async (lobbyID, player) => {
    const lobbyData = await getLobbyData(lobbyID);
    if (lobbyData.kickedPlayers.includes(player)) {
        return await updateLobby(lobbyID, {
            kickedPlayers: arrayRemove(player)
        });
    }
    return lobbyData;
};

const changeLobbyLeader = async (lobbyID, username) => {
    const lobbyData = await getLobbyData(lobbyID);
    const playerIndex = lobbyData.players.findIndex(player => player === username);

    if (playerIndex !== -1) {
        const player = lobbyData.players[playerIndex];
        const updatedPlayers = [player, ...lobbyData.players.filter(player => player !== username)];
        return await updateLobby(lobbyID, {
            leader: username,
            players: updatedPlayers
        });
    } else {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
};

const changeLobbyStatus = async (lobbyID, status) => {
    return await updateLobby(lobbyID, { status });
};

const updateGameNewTurn = async (lobbyID, newGameState, backupPlayer) => {
    return await updateLobby(lobbyID, { 
        gameState: newGameState ,
        backupPlayers: arrayUnion(backupPlayer)

    });
};
const updateGameState = async (lobbyID, newGameState) => {
    return await updateLobby(lobbyID, { gameState: newGameState });
};

const updateBackupGameState = async (lobbyID, backupPlayer) => {
    return await updateLobby(lobbyID, {
        backupPlayers: arrayUnion(backupPlayer)
    });
};

const getGameState = async (lobbyID) => {
    const lobbyData = await getLobbyData(lobbyID);
    return lobbyData.gameState;
};

const deleteLobby = async (lobbyID) => {
    const lobbyRef = doc(dbFirestore, "lobbies", lobbyID);
    await deleteDoc(lobbyRef);
};


let unsubscribe = null;
let nSub = 0;

const subscribeToLobby = (
    lobby, 
    lobbyID,
    gameInitState,
    username,
    setLobby, 
    setLobbyID,
    setLobbyUpdated, 
    setGameStart, 
    setGameInitState, 
    setGameUpdated, 
    setGameOnNewTurn, 
    setGameEndState, 
    setGameEnd
) => {
    console.log("Numero Sub",nSub++)
    console.log("Sub lobby :", lobby)
    console.log("Sub Game init state :", gameInitState)
  if (lobby === -1 || lobbyID === -1) {
    if (unsubscribe) {
        unsubscribe();
    }
    return;
  }

  const lobbyRef = doc(dbFirestore, "lobbies", lobbyID);

  if (unsubscribe) {
    unsubscribe();
  }

  unsubscribe = onSnapshot(lobbyRef, async (docSnapshot) => {
    if (!docSnapshot.exists()) return;
    
    const newData = docSnapshot.data();
    
    if(!newData.players.includes(username)){
        setLobby(-1);
        setLobbyID(-1);
        unsubscribe();
        return;
    }

    switch (newData.status) {
      case LOBBY_STATUS.IN_LOBBY:
        if (lobby.players.length !== newData.players.length) {
            setLobby({id: lobbyRef.id, ...newData});
            setLobbyUpdated(true);
        }
        break;

      case LOBBY_STATUS.IN_GAME:
        if(gameInitState === -1 && JSON.stringify(lobby.gameInitState) !== JSON.stringify(newData.gameInitState)){
            setGameInitState(newData.gameInitState);
            setGameStart(true);
        }else {
            if (lobby.players.length !== newData.players.length) {
                if(newData.gameState.cards.length !== 0)
                   await gameService.checkAllPlayersFinishTurn(newData, lobbyRef.id, setGameOnNewTurn, setGameUpdated);
            
                if(newData.gameState.finalReports.length !== 0)
                    await gameService.checkAllPlayersEndGame(lobbyRef.id, newData.gameState, newData.players.length, newData.leader === username, setGameEndState, setGameEnd);
                
            }
            if (newData.gameState.cards.length > lobby.gameState.cards.length) {
                await gameService.checkAllPlayersFinishTurn(newData, lobbyRef.id, setGameOnNewTurn, setGameUpdated);
            }
            if (newData.gameState.finalReports.length > lobby.gameState.finalReports.length) {
                await gameService.checkAllPlayersEndGame(lobbyRef.id, newData.gameState, newData.players.length, newData.leader === username, setGameEndState, setGameEnd);
            }
        }
        
        break;
        
        default:
            console.log(`⚠️ Stato ${newData.status} non monitorato.`);
        }
        
        setLobby({id: lobbyRef.id, ...newData});
    
  });
  
}

export const repositoryLobby = {
    getLobbyById,
    getLobbyNoError,
    createLobby,
    addPlayerToLobby,
    removePlayerFromLobby,
    changeLobbyLeader,
    changeLobbyStatus,
    updateLobby,
    updateGameState,
    updateBackupGameState,
    removePlayerFromKicked,
    leaveLobby,
    getGameState,
    deleteLobby,
    disconnectPlayerFromLobby,
    subscribeToLobby,
    updateGameNewTurn
};
