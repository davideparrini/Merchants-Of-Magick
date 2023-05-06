import {getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc , updateDoc, deleteDoc,deleteField, query, where, getCountFromServer, arrayUnion, arrayRemove} from 'firebase/firestore';
import {firebase } from './FireBaseConfig';

const db = getFirestore(firebase);


function createFirebaseStore() {

    async function hasUsername(user){
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }

    async function setUsername(user, username){
        //il check sull'unicità dell' username viene fatto durante l'inserimento dell'username
        //username = username.toLowerCase();
        await setDoc(doc(db, "users", user.uid),{
            username: username,
            friendList: []
        });
    }

    async function checkUsername(username){
        //username = username.toLowerCase();
        const collRef = collection(db,"users");
        const q =  query(collRef, where('username', '==', username)) ;
        const snapshot = await getCountFromServer(q);
        console.log(snapshot.data().count)
        return snapshot.data().count === 0;
    }

    async function getUsername(user){
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let username = docSnap.data().username;
            console.log("username", username);
            return username;
        } 
        return null;
    }

    async function getFriendList(user){
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let friendList = docSnap.data().friendList;
            return friendList;
        } 
        return null;
    }

    async function addFriend(user,friendUsername){
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef,{
            friendList: arrayUnion(friendUsername)
        });
    }

    async function removeFriend(user,friendUsername){
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef,{
            friendList: arrayRemove(friendUsername)
        });
    }

    async function setSocketID(user,socketID){
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef,{
            socketID: socketID
        });
    }

    async function getSocketID(user){
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let socketID = docSnap.data().socketID;
            return socketID;
        } 
        return null;
    }
    async function deleteSocketID(user){
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef,{
            socketID: deleteField()
        });
    }

    return {
        hasUsername,
        setUsername, 
        checkUsername, 
        getUsername, 
        getFriendList, 
        addFriend,
        removeFriend,
        setSocketID,
        getSocketID,
        deleteSocketID
    }

}


export const dbFirestore = createFirebaseStore();