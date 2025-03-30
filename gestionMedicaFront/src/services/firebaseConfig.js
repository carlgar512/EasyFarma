"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBY6YT1ZbgOg7da3x9YfZT39xa5eMR5SWQ",
    authDomain: "easyfarma-5ead7.firebaseapp.com",
    projectId: "easyfarma-5ead7",
    storageBucket: "easyfarma-5ead7.firebasestorage.app",
    messagingSenderId: "27066514525",
    appId: "1:27066514525:web:e8755cb84c1acc154461b4",
    measurementId: "G-ZB9H34M0D2"
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const analytics = (0, analytics_1.getAnalytics)(app);
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
//# sourceMappingURL=firebaseConfig.js.map