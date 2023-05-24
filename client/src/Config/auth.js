import { getAuth, GoogleAuthProvider, GithubAuthProvider ,  signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, FacebookAuthProvider  } from "firebase/auth";


import {firebase } from './FireBaseConfig';

export const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

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
        return signInWithPopup(auth, googleProvider);
    }

    function facebookLogin() {
        return signInWithPopup(auth, facebookProvider);
    }

    function githubLogin() {
        return signInWithPopup(auth, githubProvider);
    }


    async function logout() {
        await signOut(auth);
    }


    
    return {
        signUp, login, googleLogin, logout, facebookLogin,githubLogin
    };
}

export const userAuth = createAuthConfig(); 