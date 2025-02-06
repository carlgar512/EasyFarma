import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Estructura de los datos del usuario
interface UserData {
  name: string;
  lastName: string;
  dni: string;
  email: string;
  dateNac: string;
}

/**
 * Registra un nuevo usuario en Firebase Authentication y almacena los datos en Firestore.
 */
export const registerUser = async (userData: UserData, password: string) => {
  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const user = userCredential.user;

    // Guardar información adicional en Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    return { success: true, user };
  } catch (error: any) {
    console.error("Error al registrar el usuario:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Inicia sesión con correo y contraseña en Firebase Authentication.
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Cierra la sesión del usuario en Firebase Authentication.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error("Error al cerrar sesión:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene la información del usuario autenticado.
 */
export const getCurrentUser = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: "Usuario no encontrado" };
    }
  } catch (error: any) {
    console.error("Error al obtener usuario:", error);
    return { success: false, error: error.message };
  }
};
