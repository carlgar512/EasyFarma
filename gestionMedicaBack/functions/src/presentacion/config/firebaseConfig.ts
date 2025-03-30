import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

// Forzar uso de emuladores si estamos en local
if (process.env.FUNCTIONS_EMULATOR === "true") {
  db.settings({
    host: "localhost:8085", // Puerto del emulador Firestore
    ssl: false
  });

  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"; // Puerto Auth
}

export { db, auth };
