

import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteField,
  persistentMultipleTabManager, 
  persistentLocalCache, 
  initializeFirestore
} from 'firebase/firestore';

import { firebase } from '../Config/firebase-config';
import { PlayerConnection } from '../interface/lobby-interface';
import { ERRORS } from '../constants/constants';

const db = initializeFirestore(firebase, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });


const CONNECTIONS_COLLECTION = 'connections';

/**
 * Helper per aggiornare un campo di un giocatore
 */
const updatePlayerField = async (username: string, field: Partial<Record<keyof PlayerConnection, any>>): Promise<void> => {
  const userRef = doc(db, CONNECTIONS_COLLECTION, username);
  await updateDoc(userRef, field);
};

/**
 * Ottiene un giocatore dal database tramite username
 */
const getPlayerByUsername = async (username: string): Promise<PlayerConnection> => {
    const userRef = doc(db, CONNECTIONS_COLLECTION, username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }

    return userSnap.data() as PlayerConnection;
};

/**
 * Aggiorna il socket ID di un giocatore
 */
const loginPlayerSocketID = async (username: string, socketID: string): Promise<void> => {
  await updatePlayerField(username, { socketID });
};

/**
 * Rimuove il socket ID di un giocatore
 */
const logoutPlayerSocketID = async (username: string): Promise<void> => {
  await updatePlayerField(username, { socketID: deleteField() });
};

/**
 * Unisce un giocatore a una lobby
 */
const joinLobby = async (username: string, lobbyID: string): Promise<void> => {
  await updatePlayerField(username, { lobbyID });
};

/**
 * Rimuove un giocatore dalla lobby
 */
const leaveLobby = async (username: string): Promise<void> => {
  await updatePlayerField(username, { lobbyID: deleteField() });
};

export const repositoryPlayer = {
  getPlayerByUsername,
  loginPlayerSocketID,   
  logoutPlayerSocketID,
  joinLobby,
  leaveLobby
};
