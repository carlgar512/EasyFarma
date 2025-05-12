import { getAltaActivaFromFirestore, saveAltaClienteToFirestore, updateAltaCliente } from "../../persistencia/repositorios/altaCienteDAO";
import { generarTarjetaConContador } from "../../persistencia/repositorios/contadorTarjetaDAO";
import { deleteExpirationCode, getExpirationCode, saveExpirationCodeToFirestore } from "../../persistencia/repositorios/expirationCodeDAO";
import { saveTutelaToFirestore } from "../../persistencia/repositorios/tutelaDAO";
import { saveUserToFirestore, getEmailByDNI, getUserById, updateUserPassword, createUserInAuth, getUIDByDNI, updateUserInFirestore, saveChildUserToFirestore } from "../../persistencia/repositorios/userDAO";
import { logger } from "../../presentacion/config/logger";
import { eventBus } from "../../serviciosComunes/event/event-emiter";
import { AltaCliente } from "../modelos/AltaCliente";
import { CodigoExpiracion } from "../modelos/CodigoExpiracion";
import { TipoUsuario } from "../modelos/enums/TipoUsuario";
import { Tutela } from "../modelos/Tutela";
import { Usuario } from "../modelos/Usuario";
import { TutelaService } from "./tutelaService";



export class AuthService {
  /**
   * Registra un nuevo usuario en Firebase Authentication y lo guarda en Firestore
   */
  static async registerUser(userData: any & { password: string }) {
    try {
      logger.info(`➡️ Registrando usuario: ${userData.email}`);
      if (userData.dni) {
        const existingId = await getUIDByDNI(userData.dni);
        if (existingId) {
          logger.warn(`⚠️ El DNI ${userData.dni} ya está registrado. Registro cancelado.`);
          throw new Error("Ya existe un usuario registrado con este DNI.");
        }
      }

      const userRecord = await createUserInAuth(userData.email, userData.password);
      const tarjeta = await generarTarjetaConContador();

      logger.info?.(`✅ Usuario creado en Firebase Auth: ${userRecord.uid}`); // usa logger.info si no tienes logger.success
      const user: Usuario = new Usuario(
        userData.dni,
        userData.email,
        userData.name,
        userData.lastName,
        userData.dateNac,
        userData.tlf,
        tarjeta
      );
      user.setIdUsuario(userRecord.uid);

      logger.info(`📝 Guardando en Firestore: ${user.getIdUsuario()}`);
      await saveUserToFirestore(user);

      const alta = new AltaCliente(user.getIdUsuario(), new Date());
      logger.info(`📁 Creando alta de cliente para el usuario: ${user.getIdUsuario()}`);
      await saveAltaClienteToFirestore(alta.toFirestoreObject());
      logger.info(`✅ Alta de cliente registrada correctamente.`);

      logger.info(`✅ Usuario guardado en Firestore: ${user.getIdUsuario()}`);
      return user;
    } catch (error: any) {
      logger.error(`❌ Error en registerUser: ${error.message}`);
      throw error;
    }
  };


  static async saveUsuarioInfantil(userData: any): Promise<Usuario> {
    try {
      logger.info(`👶 Registrando cuenta infantil para: ${userData.name} ${userData.lastName}`);

      if (userData.dni) {
        const existingId = await getUIDByDNI(userData.dni);
        if (existingId) {
          logger.warn(`⚠️ El DNI ${userData.dni} ya está registrado. Registro cancelado.`);
          throw new Error("Ya existe un usuario registrado con este DNI.");
        }
      }

      const tarjeta = await generarTarjetaConContador();

      const user = new Usuario(
        userData.dni || "",
        userData.email,
        userData.name,
        userData.lastName,
        userData.dateNac,
        userData.tlf,
        tarjeta,
        "",
        false,
        [],
        [],
        TipoUsuario.Infantil
      );

      // Guardar usuario infantil (Firestore genera el ID)
      const userId = await saveChildUserToFirestore(user);
      user.setIdUsuario(userId);
      await updateUserInFirestore(userId, user.toFirestoreObject())

      const alta = new AltaCliente(userId, new Date());
      await saveAltaClienteToFirestore(alta.toFirestoreObject());

      logger.info(`🧷 Creando vínculo de tutela con tutor: ${userData.idTutor}`);
      const fechaActual = new Date().toISOString();
      const tutela = new Tutela(fechaActual, null, userData.idTutor, userId);
      await saveTutelaToFirestore(tutela.toFirestoreObject());

      logger.info(`✅ Usuario infantil y tutela guardados correctamente`);
      return user;
    } catch (error: any) {
      logger.error(`❌ Error en saveUsuarioInfantil: ${error.message}`);
      throw error;
    }
  }

  /**
  * Busca un usuario por DNI y devuelve su email, validando su estado y tipo de cuenta.
  */
  static async getEmailFromDNI(dni: string): Promise<string> {
    logger.info(`🔍 Buscando email asociado al DNI: ${dni}`);

    // 1. Obtener email
    const email = await getEmailByDNI(dni);
    if (!email) {
      logger.warn(`⚠️ No se encontró ningún email para el DNI: ${dni}`);
      throw new Error("DNI no encontrado");
    }

    // 2. Obtener UID
    const uid = await getUIDByDNI(dni);
    if (!uid) {
      logger.error(`❌ No se encontró UID para el DNI: ${dni}`);
      throw new Error("Usuario no encontrado en el sistema");
    }

    // 3. Obtener datos del usuario
    const userData = await getUserById(uid);
    if (userData) {
      const usuario = Usuario.fromFirestore(userData.id, userData);
      if (usuario.getTipoUsuario() === TipoUsuario.Infantil) {
        logger.error(`⛔ El DNI ${dni} pertenece a una cuenta infantil.`);
        throw new Error("Para loggear una cuenta infantil acceda desde la de su tutor");
      }
    }

    // 4. Validar que tenga alta activa
    const altaActiva = await getAltaActivaFromFirestore(uid);
    if (!altaActiva) {
      logger.warn(`⛔ El usuario con DNI ${dni} está dado de baja`);
      throw new Error("El usuario actualmente está dado de baja");
    }

    logger.info(`✅ Email encontrado: ${email}`);
    return email;
  }


  /**
   * Logout no se gestiona desde backend (solo cliente)
   */
  static async logoutUser(): Promise<void> {
    logger.warn("🚫 Logout intentado desde backend. Esta acción debe gestionarse en el cliente.");
    throw new Error("Logout debe ser gestionado desde el cliente");
  };

  /**
   * Obtiene la información del usuario desde Firestore
   */
  static async getCurrentUser(userId: string) {
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


  static async searchUserByDNI(dni: string): Promise<string> {
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

  static async getUserDataByDNI(dni: string): Promise<Usuario> {
    try {
      logger.debug(`🔍 Buscando usuario por DNI: ${dni}`);

      const uid = await getUIDByDNI(dni);

      if (!uid) {
        logger.warn(`⚠ Usuario no encontrado con DNI: ${dni}`);
        throw new Error("Usuario no encontrado");
      }

      const userData = await getUserById(uid);

      if (!userData) {
        logger.warn(`⚠ No se encontró información del usuario con UID: ${uid}`);
        throw new Error("Datos del usuario no disponibles");
      }

      const usuario = Usuario.fromFirestore(userData.id, userData);
      usuario.setIdUsuario(uid); // 👈 Añadimos el UID al modelo

      return usuario;
    } catch (error: any) {
      logger.error(`❌ Error al buscar usuario por DNI: ${error.message}`);
      throw new Error("Error al buscar usuario por DNI");
    }
  }


  // Genera codigo verificación
  static generateVerificationCode(): string {
    return Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  }



  static async saveCodeForUser(dni: string, code: string): Promise<void> {
    try {
      logger.info(`Iniciando el proceso de guardado para el DNI: ${dni}`);

      const existeCode = await getExpirationCode(dni);
      if (existeCode) {
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

  static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@'); // Divide el email en la parte local y el dominio

    // Enmascara la parte local, dejando la primera letra visible y 5 asteriscos
    const maskedLocalPart = localPart[0] + '*'.repeat(5);  // 5 asteriscos después de la primera letra

    // Enmascara la parte del dominio (todo lo que está después de `@` queda igual)
    const [domainName, tld] = domain.split('.');  // Divide el dominio en el nombre y el TLD (ej. "example" y "com")
    const maskedDomainName = domainName;

    // Devuelve el email con la parte local y el dominio enmascarados
    return `${maskedLocalPart}@${maskedDomainName}.${tld}`;
  };


  static async checkVerificationCode(dni: string, code: string): Promise<boolean> {
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
  static async passwordReset(dni: string, password: string): Promise<boolean> {
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



  static async bajaUsuario(idUsuario: string): Promise<boolean> {
    try {
      // 1. Obtener el alta activa
      const altaActiva = await getAltaActivaFromFirestore(idUsuario);

      if (!altaActiva) {
        logger.warn(`⚠️ No se encontró alta activa para el usuario con ID: ${idUsuario}`);
        throw new Error("No hay alta activa para este usuario");
      }

      const { id, ...datosAlta } = altaActiva;
      const altaUsuario = AltaCliente.fromFirestoreObject(datosAlta);

      // 2. Establecer fecha de baja
      const fechaBaja = new Date();
      altaUsuario.setFechaBaja(fechaBaja);

      // 3. Actualizar alta en Firestore
      await updateAltaCliente(id, altaUsuario.toFirestoreObject());

      logger.info(`✅ Usuario con ID ${idUsuario} dado de baja correctamente en alta ID ${altaActiva.id}`);

      // 4. Finalizar tutelas activas donde es tutor
      const tutelas = await TutelaService.obtenerTutelasPorIdTutor(idUsuario);
      const activas = tutelas.filter(t => !t.fechaDesvinculacion);

      for (const tutela of activas) {
        try {
          await TutelaService.finalizarTutela(tutela.idTutela);
          logger.info(`🔚 Tutela finalizada: ${tutela.idTutela}`);
        } catch (e: any) {
          logger.warn(`⚠️ No se pudo finalizar la tutela ${tutela.idTutela}: ${e.message}`);
        }
      }
      return true;

    } catch (error: any) {
      logger.error(`❌ Error en bajaUsuario para ID ${idUsuario}: ${error.message}`);
      throw error;
    }
  }

  static async bajaUsuarioComoTutelado(idUsuario: string): Promise<boolean> {
    try {
      // 1. Obtener el alta activa
      const altaActiva = await getAltaActivaFromFirestore(idUsuario);
  
      if (!altaActiva) {
        logger.warn(`⚠️ No se encontró alta activa para el usuario con ID: ${idUsuario}`);
        throw new Error("No hay alta activa para este usuario");
      }
  
      const { id, ...datosAlta } = altaActiva;
      const altaUsuario = AltaCliente.fromFirestoreObject(datosAlta);
  
      // 2. Establecer fecha de baja
      const fechaBaja = new Date();
      altaUsuario.setFechaBaja(fechaBaja);
  
      // 3. Actualizar alta en Firestore
      await updateAltaCliente(id, altaUsuario.toFirestoreObject());
  
      logger.info(`✅ Usuario con ID ${idUsuario} dado de baja correctamente en alta ID ${altaActiva.id}`);
  
      // 4. Finalizar tutelas activas donde es tutelado
      const tutelas = await TutelaService.obtenerTutelasPorIdTutelado(idUsuario);
      const activas = tutelas.filter(t => !t.fechaDesvinculacion);
  
      for (const tutela of activas) {
        try {
          await TutelaService.finalizarTutela(tutela.idTutela);
          logger.info(`🔚 Tutela finalizada: ${tutela.idTutela}`);
        } catch (e: any) {
          logger.warn(`⚠️ No se pudo finalizar la tutela ${tutela.idTutela}: ${e.message}`);
        }
      }
  
      return true;
  
    } catch (error: any) {
      logger.error(`❌ Error en bajaUsuarioComoTutelado para ID ${idUsuario}: ${error.message}`);
      throw error;
    }
  }


  static async getCurrentUserLastAlta(userId: string) {
    try {
      logger.debug(`🔍 Obteniendo datos de la alta de cliente del usuario: ${userId}`);
      const userAlta = await getAltaActivaFromFirestore(userId);
      if (!userAlta) {
        logger.warn(`⚠ Alta de cliente no encontrada: ${userId}`);
        throw new Error("Alta de cliente no encontrada");
      }
      const alta = AltaCliente.fromFirestoreObject(userAlta);
      return alta.toFrontendObject();
    } catch (error: any) {
      logger.error("❌ Error al obtener alta de usuario:", error.message);
      throw new Error("Error al obtener alta de usuario");
    }
  };


  static async updateUser(userData: any) {
    try {
      logger.debug(`✏️ Actualizando usuario UID: ${userData.uid}`);

      await updateUserInFirestore(userData.uid, userData);

      logger.info(`✅ Usuario ${userData.uid} actualizado correctamente.`);

      return;

    } catch (error: any) {
      logger.error(`❌ Error al actualizar usuario ${userData.uid}:`, error.message);
      throw new Error("Error al actualizar los datos del usuario.");
    }
  };


  static async compruebaNuevoTutor(dni: string, tarjeta: string): Promise<Usuario> {
    try {
      const uid = await getUIDByDNI(dni);

      if (!uid) {
        throw new Error("No se encontró ningún usuario con ese DNI.");
      }
      console.log(uid);

      const rawUser = await getUserById(uid);

      if (!rawUser) {
        throw new Error("No se pudo recuperar el usuario asociado al DNI.");
      }
      const usuario = Usuario.fromFirestore(rawUser.id, rawUser);
      if (usuario.getTipoUsuario() === TipoUsuario.Infantil) {
        throw new Error("Un usuario Infantil no puede ser tutor.");
      }

      if (usuario.getNumTarjeta() !== tarjeta) {
        throw new Error("El número de tarjeta no coincide con el usuario.");
      }

      return usuario;

    } catch (error: any) {
      console.error("❌ Error en compruebaNuevoTutor:", error.message);
      throw error;
    }
  }

}