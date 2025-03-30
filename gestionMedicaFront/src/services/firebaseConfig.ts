// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };