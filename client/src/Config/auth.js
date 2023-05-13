import { getAuth, GoogleAuthProvider,  signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";


import {firebase } from './FireBaseConfig';

export const auth = getAuth(firebase);
const provider = new GoogleAuthProvider();


function createAuthConfig() {

    async  function signUp(email,password) {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            return true;
        } catch (err) {
            console.error('ERROR signUp with email and password:', err);
            return false;
        }
    }


    async function login(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (err) {
            console.error('ERROR login with email and password:', err);
            return false;
        }
    }

    function googleLogin() {
        return signInWithPopup(auth, provider);
    }

    async function logout() {
        await signOut(auth);
    }


    
    return {
        signUp, login, googleLogin, logout
    };
}

export const userAuth = createAuthConfig(); 