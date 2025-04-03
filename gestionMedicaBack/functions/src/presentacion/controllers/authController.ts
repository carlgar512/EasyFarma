import { UsuarioDTO } from "../../negocio/dtos/UsuarioDTO";
import { generateVerificationCode, loginUserWithDNI, registerUser, searchUserByDNI } from "../../negocio/services/authService";
import { onRequest } from "firebase-functions/v2/https";
import { eventBus } from "../../serviciosComunes/event/event-emiter";


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

export const recoveryRequestHandler = onRequest(async (req, res) => {
  const { dni } = req.body;
  try {
    const userEmail = await searchUserByDNI(dni);
    if (!userEmail) {
      res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    const code = generateVerificationCode(); // ejemplo: 1234
    console.log(code);
    //await authService.saveCodeForUser(user.email, code);
    eventBus.emit('send.verification.code', { email: userEmail, code });

    //const maskedEmail = maskEmail(user.email); // ej: j***@gmail.com

    res.status(201).json({
      success: true,
      email: userEmail, // o solo algunos campos si prefieres
    });

  } catch (error) {
    console.error("Error en recoveryRequestHandler:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});


