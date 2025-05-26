import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBY6YT1ZbgOg7da3x9YfZT39xa5eMR5SWQ",
  authDomain: "easyfarma-5ead7.firebaseapp.com",
  projectId: "easyfarma-5ead7",
  storageBucket: "easyfarma-5ead7.appspot.com",
  messagingSenderId: "27066514525",
  appId: "1:27066514525:web:e8755cb84c1acc154461b4",
  measurementId: "G-ZB9H34M0D2",
};

// ✅ Inicialización
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Conectar al emulador solo si estás en desarrollo local
/*
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  console.info("🔌 Conectado al emulador de Auth (localhost:9099)");
}
*/

export { db, auth, analytics };
