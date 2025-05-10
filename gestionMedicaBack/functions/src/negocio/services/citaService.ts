
import { getCentroByIdFromFirestore } from "../../persistencia/repositorios/centroDAO";
import {
    saveCitaToFirestore,
    getCitasNoArchivadasUsuarioFromFirestore,
    getCitasArchivadasUsuarioFromFirestore,
    getCitasPendientesUsuarioFromFirestore,
    getCitasMedicoFromFirestore,
    getCitaByIdFromFirestore,
    updateCitaInFirestore,
    deleteCitasUsuarioFromFirestore,
    deleteCitaByIdFromFirestore
} from "../../persistencia/repositorios/citaDAO";
import { getMedicoByIdFromFirestore } from "../../persistencia/repositorios/medicoDAO";
import { getUserById } from "../../persistencia/repositorios/userDAO";
import { logger } from "../../presentacion/config/logger";
import { eventBus } from "../../serviciosComunes/event/event-emiter";
import { Centro } from "../modelos/Centro";
import { Cita } from "../modelos/Cita";
import { Medico } from "../modelos/Medico";
import { Usuario } from "../modelos/Usuario";
// Ajusta si tienes logger

export class CitaService {

    /**
     * 🔹 Guarda una nueva cita
     */
    static async guardarCita(citaData: any | any[]): Promise<void> {
        logger.info("💾 Guardando cita(s)...");

        const citasArray = Array.isArray(citaData) ? citaData : [citaData];

        for (const citaRaw of citasArray) {
            const cita = new Cita(
                citaRaw.fechaCita,
                citaRaw.horaCita,
                citaRaw.estadoCita,
                citaRaw.archivado,
                citaRaw.idUsuario,
                citaRaw.idMedico
            );

            await saveCitaToFirestore(cita.toFirestoreObject());
            logger.info(`✅ Cita guardada correctamente para usuario ${cita.getIdUsuario()}`);

            try {
                // 🔹 Obtener datos crudos desde Firestore
                const usuarioData = await getUserById(cita.getIdUsuario());
                const medicoData = await getMedicoByIdFromFirestore(cita.getIdMedico());

                if (!usuarioData) {
                    logger.warn(`⚠️ Usuario con ID ${cita.getIdUsuario()} no encontrado. Email no enviado.`);
                    continue;
                }

                if (!medicoData) {
                    logger.warn(`⚠️ Médico con ID ${cita.getIdMedico()} no encontrado. Email no enviado.`);
                    continue;
                }

                const usuario = Usuario.fromFirestore(usuarioData);
                const medico = Medico.fromFirestore(cita.getIdMedico(), medicoData);

                const centroData = await getCentroByIdFromFirestore(medico.getIdCentro());

                if (!centroData) {
                    logger.warn(`⚠️ Centro con ID ${medico.getIdCentro()} no encontrado. Email no enviado.`);
                    continue;
                }

                const centro = Centro.fromFirestore(medico.getIdCentro(), centroData);

                // 🔹 Emitir evento si todo está correcto
                eventBus.emit("send.cita.confirmation", {
                    usuario,
                    cita,
                    medico,
                    centro,
                });

                logger.info(`📨 Email de confirmación preparado para ${usuario.getEmail()}`);

            } catch (err) {
                logger.error(`❌ Error al preparar datos para email de cita del usuario ${cita.getIdUsuario()}:`, err);
            }
        }

        logger.info(`✅ Se guardaron ${citasArray.length} cita(s) correctamente`);
    }

    /**
     * 🔹 Obtiene las citas NO archivadas de un usuario
     */
    static async obtenerCitasNoArchivadasUsuario(idUsuario: string): Promise<any[]> {
        logger.info(`🔍 Buscando citas NO archivadas del usuario: ${idUsuario}`);

        const citasRaw = await getCitasNoArchivadasUsuarioFromFirestore(idUsuario);
        return citasRaw.map(c => Cita.fromFirestore(c.uid, c).toFrontDTO());
    }

    /**
     * 🔹 Obtiene las citas ARCHIVADAS de un usuario
     */
    static async obtenerCitasArchivadasUsuario(idUsuario: string): Promise<any[]> {
        logger.info(`🔍 Buscando citas ARCHIVADAS del usuario: ${idUsuario}`);

        const citasRaw = await getCitasArchivadasUsuarioFromFirestore(idUsuario);
        return citasRaw.map(c => Cita.fromFirestore(c.uid, c).toFrontDTO());
    }

    /**
     * 🔹 Obtiene las citas PENDIENTES de un usuario
     */
    static async obtenerCitasPendientesUsuario(idUsuario: string): Promise<any[]> {
        logger.info(`🔍 Buscando citas PENDIENTES del usuario: ${idUsuario}`);

        const citasRaw = await getCitasPendientesUsuarioFromFirestore(idUsuario);
        return citasRaw.map(c => Cita.fromFirestore(c.uid, c).toFrontDTO());
    }

    /**
     * 🔹 Obtiene todas las citas de un médico
     */
    static async obtenerCitasMedico(idMedico: string): Promise<any[]> {
        logger.info(`🔍 Buscando citas del médico: ${idMedico}`);

        const citasRaw = await getCitasMedicoFromFirestore(idMedico);
        return citasRaw.map(c => Cita.fromFirestore(c.uid, c).toFrontDTO());
    }

    /**
     * 🔹 Obtiene una cita específica por su ID
     */
    static async obtenerCitaPorId(idCita: string): Promise<any> {
        logger.info(`🔍 Buscando cita con ID: ${idCita}`);

        const citaRaw = await getCitaByIdFromFirestore(idCita);
        return Cita.fromFirestore(citaRaw.uid, citaRaw).toFrontDTO();
    }

    /**
     * 🔹 Actualiza los datos de una cita existente
     */
    static async actualizarCita(idCita: string, updatedData: any, esCancelacion: boolean = false): Promise<void> {
        logger.info(`🔄 Actualizando cita con ID: ${idCita}`);

        // Crear instancia de Cita a partir de los datos actualizados
        const citaActualizada = new Cita(
            updatedData.fechaCita,
            updatedData.horaCita,
            updatedData.estadoCita,
            updatedData.archivado,
            updatedData.idUsuario,
            updatedData.idMedico
        );

        // Establecer UID (si tu modelo lo tiene como propiedad separada)
        citaActualizada.setUid(idCita);

        // Ahora actualizamos en Firestore usando el objeto correcto
        await updateCitaInFirestore(idCita, citaActualizada.toFirestoreObject());

        if (esCancelacion) {
            try {
                const usuarioData = await getUserById(citaActualizada.getIdUsuario());
                const medicoData = await getMedicoByIdFromFirestore(citaActualizada.getIdMedico());

                if (!usuarioData || !medicoData) {
                    logger.warn(`⚠️ Datos incompletos para la cita cancelada con ID ${idCita}`);
                    return;
                }

                const usuario = Usuario.fromFirestore(usuarioData);
                const medico = Medico.fromFirestore(citaActualizada.getIdMedico(), medicoData);
                const centroData = await getCentroByIdFromFirestore(medico.getIdCentro());
                if (!centroData) {
                    logger.warn(`⚠️ Centro no encontrado para médico ${medico.getIdCentro()}`);
                    return;
                }

                const centro = Centro.fromFirestore(medico.getIdCentro(), centroData);

                eventBus.emit("send.cita.cancelacion", { usuario, cita: citaActualizada, medico, centro });

                logger.info(`📨 Email de cancelación emitido para cita ${idCita}`);
            } catch (err) {
                logger.error(`❌ Error al emitir email de cancelación para cita ${idCita}:`, err);
            }
        }

        logger.info(`✅ Cita ${idCita} actualizada correctamente`);
    }

    /**
     * 🔹 Elimina todas las citas de un usuario
     */
    static async eliminarCitasUsuario(idUsuario: string): Promise<void> {
        logger.info(`🗑️ Eliminando todas las citas del usuario: ${idUsuario}`);

        await deleteCitasUsuarioFromFirestore(idUsuario);

        logger.info(`✅ Citas del usuario ${idUsuario} eliminadas correctamente`);
    }

    /**
     * 🔹 Elimina una cita específica por su ID
     */
    static async eliminarCitaPorId(idCita: string): Promise<void> {
        logger.info(`🗑️ Eliminando cita con ID: ${idCita}`);

        await deleteCitaByIdFromFirestore(idCita);

        logger.info(`✅ Cita con ID ${idCita} eliminada correctamente`);
    }
}
