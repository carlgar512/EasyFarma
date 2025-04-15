
import { bajaUserService, checkVerificationCodeService, generateVerificationCodeService, getCurrentUserLastAltaClienteService, getCurrentUserService, getEmailFromDNIService, maskEmailService, passwordResetService, registerUserService, saveCodeForUserService, searchUserByDNIService, updateUserService } from "../../negocio/services/authService";
import { onRequest } from "firebase-functions/v2/https";
import { eventBus } from "../../serviciosComunes/event/event-emiter";


export const getEmailByDniHandler = onRequest(async (req, res) => {
  try {
    const { dni } = req.query;
    if (!dni || typeof dni !== "string") {
      throw new Error("DNI no válido");
    }

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
  try {
    const { dni, code } = req.body;

    const correcto = await checkVerificationCodeService(dni, code);

    res.status(200).json({
      success: correcto,
    });

  } catch (error) {
    console.error("Error en checkCodeHandler:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});


export const passwordResetHandler = onRequest(async (req, res) => {
  try {
    const { dni, password } = req.body;

    const correcto = await passwordResetService(dni, password);

    res.status(200).json({
      success: correcto,
    });

  } catch (error) {
    console.error("Error en passwordResetHandler:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});

export const bajaUsuarioHandler = onRequest(async (req, res) => {
  try {
    const { idUsuario } = req.body;
    const correcto = await bajaUserService(idUsuario);
    res.status(200).json({
      success: correcto,
    });

  } catch (error) {
    console.error("Error en bajaUsuarioHandler:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});


export const getUserInfoHandler = onRequest(async (req, res) => {
  try {
    const { idUsuario } = req.query;
    if (!idUsuario || typeof idUsuario !== "string") {
      throw new Error("idUsuario no válido");
    }

    const userData = await getCurrentUserService(idUsuario);
    const altaCliente = await getCurrentUserLastAltaClienteService(idUsuario);
    res.status(200).json({
      success: true, data: {
        userData,
        altaCliente
      }
    });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

export const updateUserInfoHandler = onRequest(async (req, res) => {
  try {
    const userData = req.body; // 👈 Aquí asumimos que ya es el objeto completo

    if (!userData || !userData.uid) {
      res.status(400).json({
        success: false,
        message: "Datos de usuario inválidos o incompletos.",
      });
    }

    await updateUserService(userData);

    res.status(200).json({
      success: true,
    });

  } catch (error: any) {
    console.error("❌ Error en updateUserInfoHandler:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error?.message || error,
    });
  }
});