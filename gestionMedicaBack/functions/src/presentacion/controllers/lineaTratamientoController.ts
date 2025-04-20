import { onRequest } from "firebase-functions/https";
import { LineaTratamientoService } from "../../negocio/services/lineaTratamientoService";

/**
 * 🔹 Guardar lista de líneas de tratamiento
 */
export const guardarLineasTratamientoHandler = onRequest(async (req, res) => {
    try {
        const lineasData = req.body;

        if (!Array.isArray(lineasData)) {
            throw new Error("El cuerpo debe ser un array de líneas de tratamiento");
        }

        await LineaTratamientoService.guardarLineasTratamiento(lineasData);

        res.status(201).json({
            success: true,
            message: "Líneas de tratamiento guardadas correctamente"
        });
    } catch (error: any) {
        console.error("❌ Error en guardarLineasTratamientoHandler:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
* 🔹 Obtener todas las líneas de tratamiento
*/
export const obtenerTodasLasLineasHandler = onRequest(async (_req, res) => {
    try {
        const lineas = await LineaTratamientoService.obtenerTodasLasLineasTratamiento();

        res.status(200).json({
            success: true,
            lineas
        });
    } catch (error: any) {
        console.error("❌ Error en obtenerTodasLasLineasHandler:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
* 🔹 Obtener una línea de tratamiento por ID
*/
export const obtenerLineaTratamientoPorIdHandler = onRequest(async (req, res) => {
    try {
        const { idLinea } = req.query;

        if (!idLinea || typeof idLinea !== "string") {
            throw new Error("idLinea no válido");
        }

        const linea = await LineaTratamientoService.obtenerLineaTratamientoPorId(idLinea);

        if (!linea) {
            res.status(404).json({
                success: false,
                message: "Línea de tratamiento no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            linea
        });
    } catch (error: any) {
        console.error("❌ Error en obtenerLineaTratamientoPorIdHandler:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
* 🔹 Obtener líneas de tratamiento por ID de tratamiento
*/
export const obtenerLineasPorIdTratamientoHandler = onRequest(async (req, res) => {
    try {
        const { idTratamiento } = req.query;

        if (!idTratamiento || typeof idTratamiento !== "string") {
            throw new Error("idTratamiento no válido");
        }

        const lineas = await LineaTratamientoService.obtenerLineasPorIdTratamiento(idTratamiento);

        res.status(200).json({
            success: true,
            lineas
        });
    } catch (error: any) {
        console.error("❌ Error en obtenerLineasPorIdTratamientoHandler:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
