import { deleteTratamientoByIdFromFirestore, deleteTratamientosFromFirestore, getTratamientosFromFirestore, saveTratamientoToFirestore, toggleArchivadoTratamiento } from "../../persistencia/repositorios/tratamientoDAO";
import { logger } from "../../presentacion/config/logger";
import { Tratamiento } from "../modelos/Tratamiento";

export class TratamientoService {
    /**
     * Guarda un nuevo tratamiento en Firestore
     */
    static async guardarTratamientos(tratamientosData: any[]): Promise<void> {
        logger.info(`💾 Recibidos ${tratamientosData.length} tratamientos para guardar`);

        for (const data of tratamientosData) {
            const tratamiento = Tratamiento.fromFirestore(data);

            // Validación: si estado === true, forzamos fechaFin a null
            if (tratamiento.getEstado() === true) {
                tratamiento.setFechaFin(null);
            }

            await saveTratamientoToFirestore(tratamiento.toFirestoreObject());

            logger.info(`✅ Tratamiento para usuario ${tratamiento.getIdUsuario()} guardado.`);
        }
    }
    /**
     * Obtiene tratamientos archivados de un usuario
     */
    static async obtenerTratamientosArchivados(idUsuario: string): Promise<any[]> {
        logger.info(`📁 Obteniendo tratamientos archivados para el usuario: ${idUsuario}`);

        const rawData = await getTratamientosFromFirestore(idUsuario);

        const archivados = rawData
            .filter((t: any) => t.archivado === true)
            .map((t: any) => Tratamiento.fromFirestore(t).toFrontDTO(t.id));

        logger.info(`✅ Se encontraron ${archivados.length} tratamientos archivados`);
        return archivados;
    }

    /**
     * Obtiene tratamientos activos (no archivados) de un usuario
     */
    static async obtenerTratamientosActivos(idUsuario: string): Promise<any[]> {
        logger.info(`📂 Obteniendo tratamientos activos para el usuario: ${idUsuario}`);

        const rawData = await getTratamientosFromFirestore(idUsuario);

        const activos = rawData
            .filter((t: any) => t.archivado === false)
            .map((t: any) => Tratamiento.fromFirestore(t).toFrontDTO(t.id));

        logger.info(`✅ Se encontraron ${activos.length} tratamientos activos`);
        return activos;
    }

    /**
     * Elimina todos los tratamientos de un usuario
     */
    static async eliminarTratamientosUsuario(idUsuario: string): Promise<void> {
        logger.info(`🗑️ Eliminando todos los tratamientos del usuario: ${idUsuario}`);

        await deleteTratamientosFromFirestore(idUsuario);

        logger.info(`✅ Tratamientos del usuario ${idUsuario} eliminados correctamente`);
    }

    /**
     * Elimina un tratamiento por su ID
     */
    static async eliminarTratamientoPorId(idTratamiento: string): Promise<void> {
        logger.info(`🗑️ Eliminando tratamiento con ID: ${idTratamiento}`);

        await deleteTratamientoByIdFromFirestore(idTratamiento);

        logger.info(`✅ Tratamiento con ID ${idTratamiento} eliminado correctamente`);
    }

    /**
     * Actualiza el estado de "archivado" de un tratamiento
     */
    static async actualizarEstadoArchivado(idTratamiento: string, nuevoEstado: boolean): Promise<void> {
        logger.info(`🔄 Cambiando estado 'archivado' del tratamiento ${idTratamiento} a ${nuevoEstado}`);

        await toggleArchivadoTratamiento(idTratamiento, nuevoEstado);

        logger.info(`✅ Tratamiento ${idTratamiento} actualizado a archivado = ${nuevoEstado}`);
    }

    /**
 * Obtiene tratamientos actuales (estado === true) de un usuario
 */
    static async obtenerTratamientosActuales(idUsuario: string): Promise<any[]> {
        logger.info(`🟢 Obteniendo tratamientos actuales para el usuario: ${idUsuario}`);

        const rawData = await getTratamientosFromFirestore(idUsuario);

        const actuales = rawData
            .filter((t: any) => t.estado === true)
            .map((t: any) => Tratamiento.fromFirestore(t).toFrontDTO(t.id));

        logger.info(`✅ Se encontraron ${actuales.length} tratamientos actuales`);
        return actuales;
    }
}