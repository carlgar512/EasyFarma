/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { bajaUsuarioHandler, checkCodeHandler, getEmailByDniHandler, getUserInfoHandler, passwordResetHandler, recoveryRequestHandler, registerHandler } from "./presentacion/controllers/authController";
import "./negocio/services/ListenerService";

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getEmailByDni = getEmailByDniHandler;
export const register = registerHandler;
export const recoveryRequest= recoveryRequestHandler;
export const checkCode = checkCodeHandler;
export const passwordReset = passwordResetHandler;
export const bajaUsuario= bajaUsuarioHandler;
export const getUserInfo = getUserInfoHandler;
