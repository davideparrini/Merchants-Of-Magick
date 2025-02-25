

import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteField,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

import { firebase } from '../Config/firebase-config';
import { PlayerConnection } from '../interface/lobby-interface';
import { ERRORS } from '../constants/constants';
import { NotFoundError } from '../Errors/NotFoundError';
import { db } from './db';


const USERS_COLLECTION = "users";
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
   // 🔎 3️⃣ Controlla se il record esiste in "connections"
   const connectionRef = doc(db, CONNECTIONS_COLLECTION, username);
   const connectionSnap = await getDoc(connectionRef);

   // 📝 4️⃣ Se non esiste, crea un nuovo record
   if (!connectionSnap.exists()) {

    const usersRef = collection(db, USERS_COLLECTION);
    const userQuery = query(usersRef, where("username", "==", username));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
    const userDoc = userSnapshot.docs[0];
    const userID = userDoc.id; 

     await setDoc(connectionRef, {
       username,
       userID,
       socketID,
       lobbyID: null
     });
   } else {
     await updateDoc(connectionRef, { socketID });
   }
};

/**
 * Rimuove il socket ID di un giocatore
 */
const logoutPlayerSocketID = async (socketID: string): Promise<void> => {
  const connectionsRef = collection(db, CONNECTIONS_COLLECTION);
  const connectionQuery = query(connectionsRef, where("socketID", "==", socketID));
  const querySnapshot = await getDocs(connectionQuery);

 
  if (querySnapshot.empty) {
    
    return;
  }

  const connectionDoc = querySnapshot.docs[0];
  await updateDoc(doc(db, CONNECTIONS_COLLECTION, connectionDoc.id), {
    socketID: deleteField(),
  });
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
