import {getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc , updateDoc, deleteDoc, query, where, getCountFromServer} from 'firebase/firestore';
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
            username: username
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
        return "ss";
    }

    return {
        hasUsername, setUsername, checkUsername, getUsername 
    }

}


export const dbFirestore = createFirebaseStore();