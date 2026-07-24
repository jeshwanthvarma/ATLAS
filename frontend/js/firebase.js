// ======================================================
// ATLAS Firebase Configuration
// frontend/js/firebase.js
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ======================================================
// Firebase Project Configuration
// ======================================================

const firebaseConfig = {

    apiKey: "AIzaSyDhORPG7t3LEiwHS-oGIw7mBriHTV35hjY",

    authDomain: "atlas-7c865.firebaseapp.com",

    projectId: "atlas-7c865",

    storageBucket: "atlas-7c865.firebasestorage.app",

    messagingSenderId: "695242941587",

    appId: "1:695242941587:web:a3364ae38dc79d6cb4d966"

};

// ======================================================
// Initialize Firebase
// ======================================================

const app = initializeApp(firebaseConfig);

// ======================================================
// Authentication
// ======================================================

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({

    prompt: "select_account"

});

// ======================================================
// Exports
// ======================================================

export {

    auth,

    googleProvider

};