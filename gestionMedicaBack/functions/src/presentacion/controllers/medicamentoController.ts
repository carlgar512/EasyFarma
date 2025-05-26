import { onRequest } from "firebase-functions/https";
import { MedicamentoService } from "../../negocio/services/medicamentoService";

/**
 * 🔹 Guardar lista de medicamentos
 */
export const guardarMedicamentosHandler = onRequest(async (req, res) => {
    try {
        const medicamentosData = req.body;

        if (!Array.isArray(medicamentosData)) {
            throw new Error("El cuerpo debe ser un array de medicamentos");
        }

        await MedicamentoService.guardarMedicamentos(medicamentosData);

        res.status(201).json({
            success: true,
            message: "Medicamentos guardados correctamente"
        });
    } catch (error: any) {
        console.error("❌ Error en guardarMedicamentosHandler:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
* 🔹 Obtener todos los medicamentos
*/
export const obtenerMedicamentosHandler = onRequest(async (_req, res) => {
    try {
        const medicamentos = await MedicamentoService.obtenerTodosLosMedicamentos();

        res.status(200).json({
            success: true,
            medicamentos
        });
    } catch (error: any) {
        console.error("❌ Error en obtenerMedicamentosHandler:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
* 🔹 Obtener un medicamento por ID
*/
export const obtenerMedicamentoPorIdHandler = onRequest(async (req, res) => {
    try {
        const { idMedicamento } = req.query;

        if (!idMedicamento || typeof idMedicamento !== "string") {
            throw new Error("idMedicamento no válido");
        }

        const medicamento = await MedicamentoService.obtenerMedicamentoPorId(idMedicamento);

        if (!medicamento) {
            res.status(404).json({
                success: false,
                message: "Medicamento no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            medicamento
        });
    } catch (error: any) {
        console.error("❌ Error en obtenerMedicamentoPorIdHandler:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
