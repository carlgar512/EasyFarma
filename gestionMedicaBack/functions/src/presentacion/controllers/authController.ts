
import { onRequest } from "firebase-functions/v2/https";
import { eventBus } from "../../serviciosComunes/event/event-emiter";
import { AuthService } from "../../negocio/services/authService";
import { Usuario } from "../../negocio/modelos/Usuario";


export const getEmailByDniHandler = onRequest(async (req, res) => {
  try {
    const { dni } = req.query;
    if (!dni || typeof dni !== "string") {
      throw new Error("DNI no válido");
    }

    const userEmail = await AuthService.getEmailFromDNI(dni);
    res.status(200).json({ success: true, email: userEmail });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});


export const registerHandler = onRequest(async (req, res) => {
  try {

    const data: JSON & { password: string } = req.body;
    const newUser = await AuthService.registerUser(data);

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
    const userEmail = await AuthService.searchUserByDNI(dni);
    if (!userEmail) {
      res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    const code = AuthService.generateVerificationCode(); // ejemplo: 1234
    await AuthService.saveCodeForUser(dni, code);
    eventBus.emit('send.verification.code', { email: userEmail, code });
    const maskedEmail = AuthService.maskEmail(userEmail); // ej: j***@gmail.com

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

    const correcto = await AuthService.checkVerificationCode(dni, code);

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

    const correcto = await AuthService.passwordReset(dni, password);

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
    const correcto = await AuthService.bajaUsuario(idUsuario);
    res.status(200).json({
      success: correcto,
    });

  } catch (error) {
    console.error("Error en bajaUsuarioHandler:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});


export const bajaUsuarioComoTuteladoHandler = onRequest(async (req, res) => {
  try {
    const idUsuario = req.query.idUsuario as string;

    if (!idUsuario) {
      res.status(400).json({
        success: false,
        error: "Falta el parámetro 'idUsuario'",
      });
      return;
    }

    await AuthService.bajaUsuarioComoTutelado(idUsuario);

    res.status(200).json({
      success: true,
      message: `El usuario ${idUsuario} ha sido dado de baja correctamente como tutelado.`,
    });
  } catch (error: any) {
    console.error("❌ Error en bajaUsuarioComoTuteladoHandler:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error al dar de baja al usuario como tutelado.",
    });
  }
});

export const getUserInfoHandler = onRequest(async (req, res) => {
  try {
    const { idUsuario } = req.query;
    if (!idUsuario || typeof idUsuario !== "string") {
      throw new Error("idUsuario no válido");
    }

    const userData = await AuthService.getCurrentUser(idUsuario);
    const altaCliente = await AuthService.getCurrentUserLastAlta(idUsuario);
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

    await AuthService.updateUser(userData);

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

export const registerChildHandler = onRequest(async (req, res) => {
  try {
    const data = req.body;

    if (!data.idTutor) {
      res.status(400).json({
        success: false,
        error: "Falta el ID del tutor (idTutor).",
      });
    }

    const newChild = await AuthService.saveUsuarioInfantil(data);

    res.status(201).json({
      success: true,
      message: "Cuenta infantil y vínculo de tutela registrados correctamente.",
      user: newChild.toFirestoreObject(),
    });
  } catch (error) {
    console.error("❌ Error en registerChildHandler:", error);
    res.status(500).json({
      success: false,
      error: "Error al registrar cuenta infantil.",
    });
  }
});

export const comprobarNuevoTutorHandler = onRequest(async (req, res) => {
  try {
    const { dni, tarjeta } = req.body;

    if (!dni || !tarjeta) {
      res.status(400).json({
        success: false,
        message: "Faltan los campos 'dni' o 'tarjeta' en la solicitud.",
      });
    }

    const usuario = await AuthService.compruebaNuevoTutor(dni, tarjeta);

    res.status(200).json({
      success: true,
      data: usuario,
    });

  } catch (error: any) {
    console.error("❌ Error en comprobarNuevoTutorHandler:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Error al comprobar tutor.",
    });
  }
});


export const existeDNIRegistradoHandler = onRequest(async (req, res) => {
  try {
    const { dni } = req.body;

    if (!dni) {
      res.status(400).json({
        success: false,
        message: "DNI no proporcionado.",
      });
      return;
    }

    const existe = await AuthService.existeDNIRegistrado(dni);

    res.status(200).json({
      success: true,
      existe, // booleano: true si está registrado
    });
  } catch (error) {
    console.error("❌ Error en existeDNIRegistradoHandler:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
});

export const sendTransitionEmailHandler = onRequest(async (req, res) => {
  try {
    const { usuario, usuarioTutelado } = req.body;

    if (!usuario || !usuarioTutelado) {
      throw new Error("Faltan datos de usuario o usuario tutelado");
    }

    // 🔧 Reconstruir instancias válidas
    const tutor = new Usuario(
      usuario.dni,
      usuario.email,
      usuario.nombreUsuario,
      usuario.apellidosUsuario,
      usuario.fechaNacimiento,
      usuario.telefono,
      usuario.numTarjeta,
      usuario.direccion,
      usuario.modoAccesibilidad,
      usuario.medicosFavoritos,
      usuario.operacionesFavoritas,
      usuario.tipoUsuario
    );
    tutor.setIdUsuario(usuario.uid); // si aplica

    const tutelado = new Usuario(
      usuarioTutelado.dni,
      usuarioTutelado.email,
      usuarioTutelado.nombreUsuario,
      usuarioTutelado.apellidosUsuario,
      usuarioTutelado.fechaNacimiento,
      usuarioTutelado.telefono,
      usuarioTutelado.numTarjeta,
      usuarioTutelado.direccion,
      usuarioTutelado.modoAccesibilidad,
      usuarioTutelado.medicosFavoritos,
      usuarioTutelado.operacionesFavoritas,
      usuarioTutelado.tipoUsuario
    );
    tutelado.setIdUsuario(usuarioTutelado.uid);

    // 📤 Emitir evento con objetos bien formados
    eventBus.emit("send.cuenta.transicion", {
      usuarioTutelado: tutelado,
      tutor,
    });

    res.status(200).json({ success: true, message: "Correo de transición enviado correctamente" });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const nuevaCuentaDesdeInfantilHandler = onRequest(async (req, res) => {
  try {
    const { usuarioTutelado, email, dni, password } = req.body;

    if (!usuarioTutelado || !email || !dni || !password) {
      throw new Error("Faltan datos obligatorios para crear la cuenta.");
    }

    const result = await AuthService.registerAccountDesdeInfantil({
      usuarioTutelado,
      email,
      dni,
      password,
    });

    res.status(200).json({
      success: true,
      uid: result.getIdUsuario(),
      message: "Cuenta registrada exitosamente.",
    });
  } catch (error: any) {
    console.error("❌ Error en nuevaCuentaDesdeInfantil:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error al registrar nueva cuenta.",
    });
  }
});