import { getAuth, GoogleAuthProvider, GithubAuthProvider ,  signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, FacebookAuthProvider  } from "firebase/auth";


import {firebase } from './FirebaseConfig';

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

    async function googleLogin() {
       await signInWithPopup(auth, googleProvider).catch((error) => {
            // The email of the user's account used.
            const email = error.customData.email;
            alert(email + " has been used already");
        })
    }

    async function facebookLogin() {
        await signInWithPopup(auth, facebookProvider).catch((error) => {
            // The email of the user's account used.
            const email = error.customData.email;
            alert(email + " has been used already");
        })
    }

    async function githubLogin() {
        await signInWithPopup(auth, githubProvider).catch((error) => {
            // The email of the user's account used.
            const email = error.customData.email;
            alert(email + " has been used already");
        })
    }


    async function logout() {
        await signOut(auth);
    }


    
    return {
        signUp, login, googleLogin, logout, facebookLogin,githubLogin
    };
}

export const userAuth = createAuthConfig(); 