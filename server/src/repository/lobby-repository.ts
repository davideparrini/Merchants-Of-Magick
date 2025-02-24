import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  deleteField, 
  query, 
  where, 
  getCountFromServer, 
  arrayUnion, 
  arrayRemove, 
  persistentMultipleTabManager, 
  persistentLocalCache, 
  initializeFirestore, 
  DocumentData 
} from 'firebase/firestore';

import { firebase } from '../Config/firebase-config';
import { LOBBY_STATUS } from '../constants/constants';
import { Lobby, GameState } from '../interface/lobby-interface';

const db = initializeFirestore(firebase, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });

const LOBBY_COLLECTION = 'lobbies';


const getLobbyById = async (lobbyID: string): Promise<Lobby | null> => {
    const lobbyRef = doc(db, LOBBY_COLLECTION, lobbyID);
    const lobbySnap = await getDoc(lobbyRef);
    return lobbySnap.exists() ? (lobbySnap.data() as Lobby) : null;
};

const createLobby = async (username: string): Promise<string> => {
    const lobbyRef = await addDoc(collection(db, LOBBY_COLLECTION), {
        players: [username],
        leaderLobby: username,
        status: LOBBY_STATUS.IN_LOBBY,
        gameState: {
            players: [username],
            nPlayers: 1,
            quest1: false,
            quest2: false,
            nPlayersEndTurn: 0,
            cards: [],
            report: []
        }
    });

    return lobbyRef.id;
};

const addPlayerToLobby = async (lobbyID: string, username: string): Promise<void> => {
    const lobbyRef = doc(db, LOBBY_COLLECTION, lobbyID);
    const lobbySnap = await getDoc(lobbyRef);
    if (lobbySnap.exists()) {
        const lobbyData = lobbySnap.data() as Lobby;
        await updateDoc(lobbyRef, {
            players: arrayUnion(username),
            'gameState.players': arrayUnion(username)
        });
    }
};

const removePlayerFromLobby = async (lobbyID: string, username: string): Promise<void> => {
    const lobbyRef = doc(db, LOBBY_COLLECTION, lobbyID);
    const lobbySnap = await getDoc(lobbyRef);
    if (lobbySnap.exists()) {
        const lobbyData = lobbySnap.data() as Lobby;
        const updatedPlayers = lobbyData.players.filter(player => player !== username);
        if (updatedPlayers.length === 0) {
            await deleteDoc(lobbyRef);
        } else {
            const newLeader = username === lobbyData.leaderLobby ? updatedPlayers[0] : lobbyData.leaderLobby;
            await updateDoc(lobbyRef, {
                players: arrayRemove(username),
                'gameState.players': arrayRemove(username),
                leaderLobby: newLeader
            });
        }
    }
};

const changeLobbyLeader = async (lobbyID: string, username: string): Promise<void> => {
  const lobbyRef = doc(db, LOBBY_COLLECTION, lobbyID);
  const lobbySnap = await getDoc(lobbyRef);

  if (lobbySnap.exists()) {
      const lobbyData = lobbySnap.data() as Lobby;

      if (lobbyData.players.includes(username)) {
          // Rimuove il nuovo leader dall'array players e lo mette in testa
          const updatedPlayers = [
              username,
              ...lobbyData.players.filter(player => player !== username)
          ];

          await updateDoc(lobbyRef, {
              leaderLobby: username,
              players: updatedPlayers
          });
      }
  }
};

const changeLobbyStatus = async (lobbyID: string, status: string): Promise<void> => {
    const lobbyRef = doc(db, LOBBY_COLLECTION, lobbyID);
    await updateDoc(lobbyRef, {
        status: status
    });
};

const updateGameState = async (lobbyID: string, newGameState: GameState): Promise<void> => {
    const lobbyRef = doc(db, LOBBY_COLLECTION, lobbyID);
    await updateDoc(lobbyRef, {
        gameState: newGameState
    });
};

  

export const repositoryLobby = {
  getLobbyById,
  createLobby,
  addPlayerToLobby,
  removePlayerFromLobby,
  changeLobbyLeader,
  changeLobbyStatus,
  updateGameState
};
