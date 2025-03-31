import { UsuarioDTO } from "../../negocio/dtos/UsuarioDTO";
import { loginUserWithDNI, registerUser } from "../../negocio/services/authService";
import { onRequest } from "firebase-functions/v2/https";


export const loginHandler = onRequest(async (req, res) => {
  try {
    const { dni, password } = req.body;
    const user = await loginUserWithDNI(dni, password);
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});


export const registerHandler = onRequest(async (req, res) => {
  try {
    console.log("📩 [registerHandler] Request recibida:", req.body);

    const data: UsuarioDTO & { password: string } = req.body;

    // Validación mínima manual
    if (!data.name || !data.lastName || !data.dni || !data.email || !data.dateNac || !data.password) {
      res.status(400).json({
        success: false,
        error: "Faltan campos obligatorios.",
      });
    }

    const newUser = await registerUser(data);

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente.",
      user: newUser.toFirestoreObject(), // o solo algunos campos si prefieres
    });
  } catch (error) {
    console.error("❌ Error en registerHandler:", error);
    res.status(500).json({
      success: false,
      error: "Error al registrar usuario.",
    });
  }
});


