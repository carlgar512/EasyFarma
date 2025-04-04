import {  deleteExpirationCode, getExpirationCode, saveExpirationCodeToFirestore } from "../../persistencia/repositorios/expirationCodeDAO";
import { saveUserToFirestore, getEmailByDNI, getUserById, updateUserPassword, createUserInAuth, getUserByEmailFromAuth, getUIDByDNI } from "../../persistencia/repositorios/userDAO";
import { logger } from "../../presentacion/config/logger";
import { eventBus } from "../../serviciosComunes/event/event-emiter";
import { CodigoExpiracion } from "../modelos/CodigoExpiracion";
import { Usuario } from "../modelos/Usuario";

/**
 * Registra un nuevo usuario en Firebase Authentication y lo guarda en Firestore
 */
export const registerUserService = async (userData:any & { password: string }) => {
  try {
    console.log("➡️ Registrando usuario:", userData.email);

    const userRecord = await createUserInAuth(userData.email, userData.password);

    console.log("✅ Usuario creado en Firebase Auth:", userRecord.uid);
    const user :Usuario = new Usuario(userData.dni,userData.email,userData.name,userData.lastName,userData.dateNac,userData.tlf);
    user.setIdUsuario(userRecord.uid);

    console.log("📝 Guardando en Firestore:", user.getIdUsuario());
    await saveUserToFirestore(user);

    console.log("✅ Usuario guardado en Firestore:", user.getIdUsuario());
    return user;
  } catch (error: any) {
    console.error("❌ Error en registerUser:", error.message);
    throw error;
  }
};

/**
 * Busca un usuario por DNI y devuelve su información desde Firebase Auth
 */
export const loginUserWithDNIService = async (dni: string, password: any) => {
  try {
    logger.debug(`🔍 Buscando email por DNI: ${dni}`);
    const email = await getEmailByDNI(dni);
    if (!email) {
      logger.warn(`⚠ No se encontró un usuario con DNI: ${dni}`);
      throw new Error("DNI no encontrado");
    }

    const userRecord = await getUserByEmailFromAuth(email);
    logger.info(`✅ Usuario autenticado: ${userRecord?.uid}`);
    return userRecord;
  } catch (error: any) {
    logger.error("❌ Error al iniciar sesión con DNI:", error.message);
    throw new Error("Error al iniciar sesión");
  }
};

/**
 * Logout no se gestiona desde backend (solo cliente)
 */
export const logoutUserService = async () => {
  logger.warn("🚫 Logout intentado desde backend. Esta acción debe gestionarse en el cliente.");
  throw new Error("Logout debe ser gestionado desde el cliente");
};

/**
 * Obtiene la información del usuario desde Firestore
 */
export const getCurrentUserService = async (userId: string) => {
  try {
    logger.debug(`🔍 Obteniendo datos de usuario: ${userId}`);
    const user = await getUserById(userId);
    if (!user) {
      logger.warn(`⚠ Usuario no encontrado: ${userId}`);
      throw new Error("Usuario no encontrado");
    }
    return user;
  } catch (error: any) {
    logger.error("❌ Error al obtener usuario:", error.message);
    throw new Error("Error al obtener usuario");
  }
};


export const searchUserByDNIService = async (dni: string) => {
  try {
    logger.debug(`🔍 Buscando usuario por DNI: ${dni}`);

    const userEmail = await getEmailByDNI(dni);

    if (!userEmail) {
      logger.warn(`⚠ Usuario no encontrado con DNI: ${dni}`);
      throw new Error("Usuario no encontrado");
    }
    return userEmail;
  } catch (error: any) {
    logger.error(`❌ Error al buscar usuario por DNI: ${error.message}`);
    throw new Error("Error al buscar usuario por DNI");
  }
};

// Genera codigo verificación
export const generateVerificationCodeService = () : string => {
  return Math.floor(Math.random() * 10000).toString().padStart(4, "0");
}



export const saveCodeForUserService = async (dni: string, code: string): Promise<void> => {
  try {
    logger.info(`Iniciando el proceso de guardado para el DNI: ${dni}`);

    const existeCode= await getExpirationCode(dni);
    if(existeCode){
      await deleteExpirationCode(dni);
    }
    // Crear la fecha de expiración (5 minutos)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);  // Expira en 5 minutos

    // Crear el código de expiración
    const expirationCode: CodigoExpiracion = new CodigoExpiracion(dni, code, expiresAt);

    // Llamar a la función para guardar el código en Firestore
    await saveExpirationCodeToFirestore(expirationCode);
    
    eventBus.emit('schedule.deletion', { dni, expiresAt });
    logger.info(`Código de expiración guardado correctamente en Firestore para el DNI: ${dni}`);
  } catch (error) {
    // Si algo falla
    logger.error(`❌ Error al guardar el código de expiración para el DNI: ${dni}`, error);
  }
};

export const maskEmailService = (email: string): string => {
  const [localPart, domain] = email.split('@'); // Divide el email en la parte local y el dominio

  // Enmascara la parte local, dejando la primera letra visible y 5 asteriscos
  const maskedLocalPart = localPart[0] + '*'.repeat(5);  // 5 asteriscos después de la primera letra

  // Enmascara la parte del dominio (todo lo que está después de `@` queda igual)
  const [domainName, tld] = domain.split('.');  // Divide el dominio en el nombre y el TLD (ej. "example" y "com")
  const maskedDomainName = domainName;

  // Devuelve el email con la parte local y el dominio enmascarados
  return `${maskedLocalPart}@${maskedDomainName}.${tld}`;
};


export const checkVerificationCodeService = async (dni: string, code: string): Promise<boolean> => {
  try {
    // Buscar el código de expiración para el DNI
    const existeCode = await getExpirationCode(dni);

    // Verificar si el código de expiración existe
    if (existeCode) {
      // Convertir el objeto de Firestore a la clase CodigoExpiracion
      const codigoExpiracion: CodigoExpiracion = CodigoExpiracion.fromFirestoreObject(existeCode);

      // Comparar el código almacenado con el proporcionado
      if (codigoExpiracion.getCode() === code) {
        logger.info(`✅ El código de verificación para el DNI: ${dni} es válido.`);
        return true; // El código coincide
      } else {
        logger.info(`⚠️ El código de verificación para el DNI: ${dni} es incorrecto.`);
        return false; // El código no coincide
      }
    }
    logger.info(`✅ No se encontró un código de expiración para el DNI: ${dni}.`);
    return false; // No existe el código de expiración
  } catch (error: any) {
    logger.error(`❌ Error al verificar el código de expiración para el DNI: ${dni}. ${error.message}`);
    return false; // En caso de error, retornamos `false`
  }
};


// Servicio para restablecer la contraseña
export const passwordResetService = async (dni: string, password: string): Promise<boolean> => {
  try {
    // Recuperar el correo electrónico del usuario usando el método `getEmailByDNI`
    const uid = await getUIDByDNI(dni);

    // Si no se encuentra el correo asociado al DNI, lanzamos un error
    if (!uid) {
      throw new Error(`No se encontró un usuario con el DNI: ${dni}`);
    }

    // Actualizar la contraseña del usuario en Firebase Authentication
    await updateUserPassword(uid, password);

    return true; // Contraseña actualizada con éxito
  } catch (error: any) {
    console.error("❌ Error al restablecer la contraseña:", error.message);
    throw error; // Lanza el error para que el controlador lo maneje
  }
};
