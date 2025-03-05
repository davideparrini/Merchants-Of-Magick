import { collection, doc, getDoc, setDoc , updateDoc, query, where, getCountFromServer, arrayUnion, arrayRemove, deleteField, getDocs, onSnapshot} from 'firebase/firestore';

import { dbFirestore } from '../../Config/FirebaseConfig';
import { NotFoundError } from '../Errors/NotFoundError';
import { BadRequestError } from '../Errors/BadRequestError';
import { sendNotification } from '../utils';

const USERS_COLLECTION_NAME = 'users';

async function hasUsername(userID) {
    const docRef = doc(dbFirestore, USERS_COLLECTION_NAME, userID);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}

async function setUsername(userID, username) {
    //il check sull'unicità dell' username viene fatto durante l'inserimento dell'username
    //username = username.toLowerCase();
    const docRef = doc(dbFirestore, USERS_COLLECTION_NAME, userID);
    await setDoc(docRef, {
        username: username,
        friendList: [],
        record: 0,
        lobbyID: null,
        online: true
    });
}

async function checkUsername(username) {
    //username = username.toLowerCase();
    const collRef = collection(dbFirestore, USERS_COLLECTION_NAME);
    const q = query(collRef, where('username', '==', username));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count === 0;
}

async function getUserData(userID) {
    const docRef = doc(dbFirestore, USERS_COLLECTION_NAME, userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let username = docSnap.data().username;
        let record = docSnap.data().record;
        if (record === undefined) {
            await updateDoc(docRef, {
                record: 0
            });
        }
        console.log(username);
        return {
            id: docRef.id,
            username,
            record
        };
    }
    return null;
}

const getUserDataFromUsername = async (username) => {
    if (!username) {
        throw new BadRequestError("Username required");
    }

    const collRef = collection(dbFirestore, USERS_COLLECTION_NAME);
    const q = query(collRef, where("username", "==", username));

    const userSnap = await getDocs(q);

    if (userSnap.empty) {
        throw new NotFoundError("Player not found");
    }

    // Firestore permette duplicati, quindi prendi il primo documento trovato
    const userDoc = userSnap.docs[0];

    return { id : userDoc.id, ...userDoc.data()};
};

async function getFriendList(userID) {
    const docRef = doc(dbFirestore, USERS_COLLECTION_NAME, userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let friendList = docSnap.data().friendList;
        return friendList;
    }
    return null;
}

async function joinLobby(userID, lobbyID) {
    const docRef = doc(dbFirestore, USERS_COLLECTION_NAME, userID);
    await updateDoc(docRef, {
        lobbyID: lobbyID
    });
}

async function leaveLobby(userID) {
    const docRef = doc(dbFirestore, USERS_COLLECTION_NAME, userID);
    await updateDoc(docRef, {
        lobbyID: deleteField()
    });
}

async function addFriend(userID, friendUsername) {
    const docRef = doc(dbFirestore, USERS_COLLECTION_NAME, userID);
    await updateDoc(docRef, {
        friendList: arrayUnion(friendUsername)
    });
}

async function removeFriend(userID, friendUsername) {
    const docRef = doc(dbFirestore, USERS_COLLECTION_NAME, userID);
    await updateDoc(docRef, {
        friendList: arrayRemove(friendUsername)
    });
}


export const repositoryUsers = {
    hasUsername,
    setUsername,
    checkUsername,
    getUserData,
    getFriendList,
    addFriend,
    removeFriend,
    joinLobby,
    leaveLobby,
    getUserDataFromUsername
};
