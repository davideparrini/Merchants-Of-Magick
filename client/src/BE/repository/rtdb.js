import { sendNotification } from "../utils";
import { dbRTB } from "../../Config/FirebaseConfig"; 
import { ref, update, remove, onValue, set, onDisconnect } from "firebase/database";

const USERS_COLLECTION_NAME = "users";

/** Aggiungere un invito */
const addInvite = async (userID, lobbyID, usernameInviter) =>
  await update(ref(dbRTB, `${USERS_COLLECTION_NAME}/${userID}/inviteMap`), {
    [usernameInviter]: { lobbyID }
  });

/** Rimuovere un invito */
const removeInvite = async (userID, usernameInviter) =>
  await remove(ref(dbRTB, `${USERS_COLLECTION_NAME}/${userID}/inviteMap/${usernameInviter}`));

/** Resettare tutti gli inviti */
const resetInvite = async (userID) =>
  await set(ref(dbRTB, `${USERS_COLLECTION_NAME}/${userID}/inviteMap`), {});

/** Trovare chiavi presenti in map2 ma non in map1 */
const getKeysInMap2NotInMap1 = (map1, map2) =>
  Object.keys(map2).filter((key) => !(key in map1));

/** Ascoltare gli inviti in tempo reale */
let unsubscribe = null;

const subscribeToInvite = (userID, setInfoInviterLobby, infoInviterLobby, setOpenToastNotification) => {
  if (userID === "-1") return;

  const userRef = ref(dbRTB, `${USERS_COLLECTION_NAME}/${userID}/inviteMap`);

  if (unsubscribe) unsubscribe(); // Rimuove il vecchio listener

  unsubscribe = onValue(userRef, (snapshot) => {
    const newData = snapshot.val() || {};

    if (Object.keys(infoInviterLobby).length < Object.keys(newData).length) {
      getKeysInMap2NotInMap1(infoInviterLobby, newData).forEach((key) => {
        setInfoInviterLobby((prev) => ({ ...prev, [key]: newData[key] }));
        setOpenToastNotification(true);
        sendNotification(`You are invited to a lobby by ${key}.`);
      });
    }
  });
};

const setupOnDisconnect = (userID) => {
    if (!userID) return;
  
    const userRef = ref(dbRTB, `users/${userID}`);
  
    onDisconnect(userRef).update({
      inviteMap: {}, // Svuota gli inviti
      online: false  // Imposta lo stato offline
    });
  };

/** Impostare lo stato online di un utente */
const setOnline = async (userID, online) =>
  await set(ref(dbRTB, `${USERS_COLLECTION_NAME}/${userID}/online`), online);


export const rtdb = { 
    addInvite, 
    removeInvite, 
    resetInvite, 
    subscribeToInvite, 
    setOnline,
    setupOnDisconnect 
};

