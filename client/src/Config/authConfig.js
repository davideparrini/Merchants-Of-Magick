import { getAuth, GoogleAuthProvider,  signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";


import {firebase } from './FireBaseConfig';

export const auth = getAuth(firebase);
const provider = new GoogleAuthProvider();


const SIGN_UP_STATE = 'SIGNUPFORM';
const LOGIN_STATE = 'LOGINFORM';
const LOGGED_STATE = 'LOGGED';
const LOBBY_STATE = 'LOBBY';
const GAME_STATE = 'GAME';


function createAuthConfig() {

    async  function signUp(email,password) {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (err) {
            console.error('ERROR signUp with email and password:', err);
        }
    }


    async function login(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password)

        } catch (err) {
            console.error('ERROR login with email and password:', err);
        }
    }

    function googleLogin() {
        return signInWithPopup(auth, provider)
    }

    async function logout() {
        await signOut(auth);
    }


    
    return {
        signUp, login, googleLogin, logout
    };
}

export const authConfig = createAuthConfig(); 