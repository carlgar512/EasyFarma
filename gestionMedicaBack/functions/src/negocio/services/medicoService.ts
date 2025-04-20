import { getAllMedicosFromFirestore, getMedicoByIdFromFirestore, saveMedicoToFirestore } from "../../persistencia/repositorios/medicoDAO";
import { logger } from "../../presentacion/config/logger";
import { Medico } from "../modelos/Medico";

export class MedicoService {
    /**
     * Guarda una lista de médicos en Firestore
     */
    static async guardarMedicos(medicosData: any[]): Promise<void> {
      logger.info(`💾 Recibidos ${medicosData.length} médicos para guardar`);
  
      for (const data of medicosData) {
        const medico = new Medico(
          data.nombreMedico,
          data.apellidosMedico,
          data.idEspecialidad,
          data.idCentro
        );
  
        await saveMedicoToFirestore(medico.toFirestoreObject());
  
        logger.info(`✅ Médico "${medico.getNombreMedico()} ${medico.getApellidosMedico()}" guardado.`);
      }
    }
  
    /**
     * Obtiene todos los médicos desde Firestore
     */
    static async obtenerTodosLosMedicos(): Promise<any[]> {
      logger.info("📋 Obteniendo todos los médicos...");
  
      const rawData = await getAllMedicosFromFirestore();
  
      const medicos = rawData.map((m: any) =>
        Medico.fromFirestore(m.id, m).toFrontDTO()
      );
  
      logger.info(`✅ Se encontraron ${medicos.length} médicos.`);
      return medicos;
    }
  
    /**
     * Obtiene un médico por su ID
     */
    static async obtenerMedicoPorId(idMedico: string): Promise<any> {
      logger.info(`🔍 Obteniendo médico con ID: ${idMedico}`);
  
      const doc = await getMedicoByIdFromFirestore(idMedico);
  
      if (!doc) {
        logger.warn(`⚠️ No se encontró médico con ID ${idMedico}`);
        return null;
      }
  
      const medico = Medico.fromFirestore(doc.id, doc).toFrontDTO();
  
      logger.info(`✅ Médico "${medico.nombreMedico} ${medico.apellidosMedico}" encontrado.`);
      return medico;
    }
  }