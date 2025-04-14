
import { checkVerificationCodeService, generateVerificationCodeService, getEmailFromDNIService, maskEmailService, passwordResetService, registerUserService, saveCodeForUserService, searchUserByDNIService } from "../../negocio/services/authService";
import { onRequest } from "firebase-functions/v2/https";
import { eventBus } from "../../serviciosComunes/event/event-emiter";


export const getEmailByDniHandler = onRequest(async (req, res) => {
  try {
    const { dni } = req.query;
    if (!dni || typeof dni !== "string") {
      throw new Error("DNI no válido");
    }
    console.log(dni);
    const userEmail = await getEmailFromDNIService(dni);
    res.status(200).json({ success: true, email: userEmail });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});


export const registerHandler = onRequest(async (req, res) => {
  try {

    const data: JSON & { password: string } = req.body;
    const newUser = await registerUserService(data);

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

  try {
    const { dni } = req.body;
    const userEmail = await searchUserByDNIService(dni);
    if (!userEmail) {
      res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    const code = generateVerificationCodeService(); // ejemplo: 1234
    await saveCodeForUserService(dni, code);
    eventBus.emit('send.verification.code', { email: userEmail, code });
    const maskedEmail = maskEmailService(userEmail); // ej: j***@gmail.com

    res.status(201).json({
      success: true,
      email: maskedEmail, // o solo algunos campos si prefieres
    });

  } catch (error) {
    console.error("Error en recoveryRequestHandler:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});

export const checkCodeHandler = onRequest(async (req, res) => {
  try{
    const { dni, code } = req.body;

    const correcto= await checkVerificationCodeService(dni,code);

    res.status(200).json({
      success: correcto,
    });

  } catch (error) {
    console.error("Error en checkCodeHandler:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});


export const passwordResetHandler = onRequest(async (req, res) => {
  try{
    const { dni, password } = req.body;

    const correcto= await passwordResetService(dni,password);

    res.status(200).json({
      success: correcto,
    });

  } catch (error) {
    console.error("Error en checkCodeHandler:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});