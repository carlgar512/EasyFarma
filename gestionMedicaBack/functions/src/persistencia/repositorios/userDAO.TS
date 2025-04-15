import { auth } from "../../presentacion/config/firebaseConfig";
import { Usuario } from "../../negocio/modelos/Usuario";
import { db } from "../../presentacion/config/firebaseConfig";
import { UserRecord } from "firebase-admin/auth";


/**
 * Guarda un usuario en Firestore
 */
export const saveUserToFirestore = async (user: Usuario) => {
  try {
    console.log("📄 [DAO] Guardando en Firestore:", user.getIdUsuario());
    const userRef = db.collection("users").doc(user.getIdUsuario());
    await userRef.set(user.toFirestoreObject());
    console.log("✅ [DAO] Guardado exitoso:", user.getIdUsuario());
  } catch (error: any) {
    console.error("❌ [DAO] Error guardando en Firestore:", error.message);
    throw error;
  }
};

/**
 * Busca el email de un usuario por su DNI
 */
export const getEmailByDNI = async (dni: string): Promise<string | null> => {
  const cleanDni = String(dni).trim();
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("dni", "==", cleanDni).get();

  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    return data.email;
  }

  return null;
};

/**
 * Busca el email de un usuario por su DNI
 */
export const getUIDByDNI = async (dni: string): Promise<string | null> => {
  const cleanDni = String(dni).trim();
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("dni", "==", cleanDni).get();

  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    return data.uid;
  }

  return null;
};

/**
 * Obtiene un usuario por su UID
 */
export const getUserById = async (uid: string): Promise<JSON | null> => {
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  return userDoc.exists ? (userDoc.data() as JSON) : null;
};


export const updateUserPassword = async (email: string, password: string): Promise<void> => {
  try {
    // Actualizar la contraseña del usuario en Firebase Authentication
    await auth.updateUser(email, {
      password: password, // Cambiar la contraseña
    });

    console.log(`✅ Contraseña actualizada correctamente para el usuario con email: ${email}`);
  } catch (error: any) {
    console.error(`❌ Error al actualizar la contraseña para el usuario con email: ${email}:`, error.message);
    throw new Error(`Error al actualizar la contraseña para el usuario con email: ${email}`);
  }
}

export const createUserInAuth = async (email: string, password: string): Promise<UserRecord> => {
  try {
    // Crear el usuario en Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    console.log(`✅ Usuario creado con éxito con email: ${email}`);
    return userRecord; // Devuelve el record del usuario creado
  } catch (error: any) {
    console.error(`❌ Error al crear el usuario con email: ${email}`, error.message);
    throw new Error(`Error al crear el usuario con email: ${email}`);
  }
};

export const getUserByEmailFromAuth = async (email: string): Promise<UserRecord | null> => {
  try {
    // Obtiene el usuario de Firebase Authentication utilizando el correo
    const userRecord = await auth.getUserByEmail(email);

    console.log(`✅ Usuario encontrado con el correo: ${email}`);
    return userRecord; // Devuelve el objeto del usuario si se encuentra
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ No se encontró un usuario con el correo: ${email}`);
    } else {
      console.error(`❌ Error al obtener el usuario con el correo: ${email}`, error.message);
    }
    return null; // Si el usuario no se encuentra, retorna null
  }
};

export const updateUserInFirestore = async (uid: string, userData:any) => {
  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.update(userData);
  } catch (error) {
    console.error("❌ [DAO User] Error al actualizar en Firestore:", error);
    throw error;
  }
};
