import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
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

     // Guardar el usuario en Firestore, incluyendo el DNI
     await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: userData.name,
        lastName: userData.lastName,
        dni: userData.dni,  // Guardamos el DNI en Firestore
        email: userData.email, 
        dateNac: userData.dateNac
      });

    return { success: true, user };
  } catch (error: any) {
    console.error("Error al registrar el usuario:", error);
    return { success: false, error: error.message };
  }
};


/**
 * Busca el correo electrónico de un usuario usando su DNI en Firestore.
 */
export const getEmailByDNI = async (dni: string) => {
  try {
    const cleanDni = String(dni).trim(); // Aseguramos que sea string y eliminamos espacios
    console.log("📌 Buscando DNI en Firestore:", cleanDni);
    console.log(dni);

    const usersRef = collection(db, "/users");
    const q = query(usersRef, where("dni", "==", cleanDni));
    const querySnapshot = await getDocs(q);


    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      console.log("✅ Usuario encontrado en Firestore:", userData);
      return { success: true, email: userData.email };
    } else {
      console.log("⚠ No se encontró un usuario con este DNI.");
      return { success: false, error: "No se encontró un usuario con este DNI" };
    }
  } catch (error: any) {
    console.error("❌ Error al obtener correo por DNI:", error);
    return { success: false, error: error.message };
  }
};

  
/**
 * Inicia sesión con DNI y contraseña en Firebase Authentication.
 */
export const loginUserWithDNI = async (dni: string, password: string) => {
  try {
    // Buscar el correo electrónico asociado al DNI
    const response = await getEmailByDNI(dni);
    if (!response.success) {
      return { success: false, error: "DNI no encontrado en la base de datos." };
    }

    const email = response.email;

    // Iniciar sesión en Firebase Authentication con el correo encontrado
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error("Error al iniciar sesión con DNI:", error);
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
