import {getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc , updateDoc,enableIndexedDbPersistence ,deleteDoc,deleteField, query, where, getCountFromServer, arrayUnion, arrayRemove, persistentMultipleTabManager} from 'firebase/firestore';
import {firebase } from './FireBaseConfig';

const db = getFirestore(firebase);

//Deprecated ma funziona
enableIndexedDbPersistence(db).catch(e => console.log(e))

// , {localCache: 
//     persistentLocalCache({tabManager: persistentMultipleTabManager()})
//   })

// 'usersDataMOM';
const USERS_COLLECTION_NAME = 'users';

function createFirebaseStore() {

    async function hasUsername(userID){
        const docRef = doc(db, USERS_COLLECTION_NAME, userID);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }

    async function setUsername(userID, username){
        //il check sull'unicità dell' username viene fatto durante l'inserimento dell'username
        //username = username.toLowerCase();
        await setDoc(doc(db, USERS_COLLECTION_NAME, userID),{
            username: username,
            friendList: [],
            record: 0
        });
    }

    async function checkUsername(username){
        //username = username.toLowerCase();
        const collRef = collection(db,USERS_COLLECTION_NAME);
        const q =  query(collRef, where('username', '==', username)) ;
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count === 0;
    }

    async function getUserData(userID){
        const docRef = doc(db, USERS_COLLECTION_NAME, userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let username = docSnap.data().username;
            let record =  docSnap.data().record;
            if(record === undefined){
                await updateDoc(docRef, {
                    record : 0
                })
            }
            console.log(username);
            return {
                username : username,
                record : record
            };
        } 
        return null;
    }

    async function updateRecord(userID, newRecord){
        const docRef = doc(db, USERS_COLLECTION_NAME, userID);
        await updateDoc(docRef,{
            record: newRecord
        })
    }

    async function getFriendList(userID){
        const docRef = doc(db, USERS_COLLECTION_NAME, userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let friendList = docSnap.data().friendList;
            return friendList;
        } 
        return null;
    }

    async function addFriend(userID,friendUsername){
        const docRef = doc(db, USERS_COLLECTION_NAME, userID);
        await updateDoc(docRef,{
            friendList: arrayUnion(friendUsername)
        });
    }

    async function removeFriend(userID,friendUsername){
        const docRef = doc(db, USERS_COLLECTION_NAME, userID);
        await updateDoc(docRef,{
            friendList: arrayRemove(friendUsername)
        });
    }

    async function setSocketID(userID,socketID){
        const docRef = doc(db, USERS_COLLECTION_NAME, userID);
        await updateDoc(docRef,{
            socketID: socketID
        });
    }

    async function getSocketID(userID){
        const docRef = doc(db, USERS_COLLECTION_NAME, userID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let socketID = docSnap.data().socketID;
            return socketID;
        } 
        return null;
    }
    async function deleteSocketID(userID){
        const docRef = doc(db, USERS_COLLECTION_NAME, userID);
        await updateDoc(docRef,{
            socketID: deleteField()
        });
    }

    return {
        hasUsername,
        setUsername, 
        checkUsername, 
        getUserData, 
        getFriendList, 
        addFriend,
        removeFriend,
        setSocketID,
        getSocketID,
        deleteSocketID,
        updateRecord
    }

}


export const dbFirestore = createFirebaseStore();