import { getAllMedicamentosFromFirestore, getMedicamentoByIdFromFirestore, saveMedicamentoToFirestore } from "../../persistencia/repositorios/medicamentoDAO";
import { logger } from "../../presentacion/config/logger";
import { Medicamento } from "../modelos/Medicamento";

export class MedicamentoService {
    /**
     * Guarda una lista de medicamentos en Firestore
     */
    static async guardarMedicamentos(medicamentosData: any[]): Promise<void> {
      logger.info(`💾 Recibidos ${medicamentosData.length} medicamentos para guardar`);
  
      for (const data of medicamentosData) {
        const medicamento = new Medicamento(data.nombre, data.marca ?? null);
        await saveMedicamentoToFirestore(medicamento.toFirestoreObject());
  
        logger.info(`✅ Medicamento "${medicamento.getNombre()}" guardado.`);
      }
    }
  
    /**
     * Obtiene todos los medicamentos desde Firestore
     */
    static async obtenerTodosLosMedicamentos(): Promise<any[]> {
      logger.info("📦 Obteniendo todos los medicamentos...");
  
      const rawData = await getAllMedicamentosFromFirestore();
  
      const medicamentos = rawData.map((m: any) =>
        Medicamento.fromFirestore(m.id, m).toFrontDTO()
      );
  
      logger.info(`✅ Se encontraron ${medicamentos.length} medicamentos.`);
      return medicamentos;
    }
  
    /**
     * Obtiene un medicamento por su ID
     */
    static async obtenerMedicamentoPorId(idMedicamento: string): Promise<any> {
      logger.info(`🔍 Obteniendo medicamento con ID: ${idMedicamento}`);
  
      const doc = await getMedicamentoByIdFromFirestore(idMedicamento);
  
      if (!doc) {
        logger.warn(`⚠️ No se encontró medicamento con ID ${idMedicamento}`);
        return null;
      }
  
      const medicamento = Medicamento.fromFirestore(doc.id, doc).toFrontDTO();
  
      logger.info(`✅ Medicamento "${medicamento.nombre}" encontrado.`);
      return medicamento;
    }
  }