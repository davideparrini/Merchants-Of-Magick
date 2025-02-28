import * as admin from 'firebase-admin';
import { PlayerConnection } from '../interface/lobby-interface';
import { ERRORS } from '../constants/constants';
import { NotFoundError } from '../Errors/NotFoundError';
import { lobbyService } from '../service/lobby-service';
import { BadRequestError } from '../Errors/BadRequestError';
import { db } from '../Config/db-config';

// Costanti per le collezioni
const usersCollection = db.collection("users");
const connectionsCollection = db.collection("connections");

/**
 * Helper per aggiornare un campo di un giocatore
 */
const updatePlayerField = async (username: string, field: Partial<Record<keyof PlayerConnection, any>>): Promise<void> => {
  const userRef = connectionsCollection.doc(username);
  await userRef.update(field);
};

/**
 * Ottiene un giocatore dal database tramite username
 */
const getPlayerByUsername = async (username: string): Promise<PlayerConnection> => {
    if (!username) {
      throw new BadRequestError("Username required");
    }
    const userRef = connectionsCollection.doc(username);
    const userSnap = await userRef.get(); // `get()` in `firebase-admin`

    if (!userSnap.exists) {
      throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }

    return userSnap.data() as PlayerConnection;
};

/**
 * Ottiene un giocatore dal database tramite socketID
 */
const getPlayerBySocketID = async (socketID: string): Promise<PlayerConnection> => {
  const connectionQuery = connectionsCollection.where("socketID", "==", socketID);
  const querySnapshot = await connectionQuery.get(); // `get()` in `firebase-admin`

  if (querySnapshot.empty) {
    throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
  }

  return querySnapshot.docs[0].data() as PlayerConnection;
};

/**
 * Aggiorna il socket ID di un giocatore
 */
const loginPlayerSocketID = async (username: string, socketID: string): Promise<void> => {
   const connectionRef = connectionsCollection.doc(username);
   const connectionSnap = await connectionRef.get();

   if (!connectionSnap.exists) {
     const userQuery = usersCollection.where("username", "==", username);
     const userSnapshot = await userQuery.get();

     if (userSnapshot.empty) {
       throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
     }

     const userDoc = userSnapshot.docs[0];
     const userID = userDoc.id;

     await connectionRef.set({
       username,
       userID,
       socketID,
       lobbyID: null
     });
   } else {
     await connectionRef.update({ socketID });
   }
};

/**
 * Rimuove il socket ID di un giocatore
 */
const logoutPlayerSocketID = async (socketID: string): Promise<void> => {
  const connectionQuery = connectionsCollection.where("socketID", "==", socketID);
  const querySnapshot = await connectionQuery.get();

  if (querySnapshot.empty) {
    return;
  }

  const connectionDoc = querySnapshot.docs[0];
  const connectionData = connectionDoc.data();

  // Se il giocatore è in una lobby, gestisci la rimozione
  if (connectionData.lobbyID) {
    await lobbyService.handlePlayerLeave(connectionData.lobbyID, connectionData.username);
  }

  // Rimuove socketID e lobbyID dalla connessione
  await connectionDoc.ref.update({
    socketID: admin.firestore.FieldValue.delete(),
    lobbyID: admin.firestore.FieldValue.delete(),
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
  await updatePlayerField(username, { lobbyID: admin.firestore.FieldValue.delete() });
};

export const repositoryPlayer = {
  getPlayerByUsername,
  getPlayerBySocketID,
  loginPlayerSocketID,   
  logoutPlayerSocketID,
  joinLobby,
  leaveLobby
};
