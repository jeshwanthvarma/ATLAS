// ======================================================
// Firebase Admin Configuration
// ATLAS Backend
// ======================================================

const path = require("path");

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

// Load Firebase Service Account
const serviceAccount = require(path.join(
    __dirname,
    "../../firebase/serviceAccountKey.json"
));

// Initialize Firebase only once
if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

module.exports = {
    auth: getAuth(),
};