import { getAuth, GoogleAuthProvider,  signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import {firebase } from './FireBaseConfig';

export const auth = getAuth(firebase);
const provider = new GoogleAuthProvider();

function createAuthConfig() {

    async  function signUp(email,pwd) {
        try {
            await createUserWithEmailAndPassword(auth, email, pwd)
        } catch (err) {
            console.error('ERROR signUp with email and password:', err);
        }
    }
    

    async function login(email, pwd) {
        try {
            await signInWithEmailAndPassword(auth, email, pwd)

        } catch (err) {
            console.error('ERROR login with email and password:', err);
        }
    }

    function googleLogin() {
        signInWithPopup(auth, provider);
    }

    async function logout() {
        await signOut(auth);
    }

   

    return {
        signUp, login, googleLogin, logout
    };
}

export const authConfig = createAuthConfig(); 