import { auth } from "../../presentacion/config/firebaseConfig";

/**
 * Crea un usuario en Firebase Authentication (solo backend)
 */
export const signUp = async (email: string, password: string) => {
  return await auth.createUser({
    email,
    password
  });
};

/**
 * Verifica si un usuario existe por email (login real solo ocurre en frontend)
 */
export const getUserByEmail = async (email: string) => {
  return await auth.getUserByEmail(email);
};

/**
 * Logout no se maneja desde el backend
 */
export const signOutUser = async () => {
  throw new Error("Logout debe ser gestionado desde el cliente");
};
