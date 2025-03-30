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

    const { name, lastName, dni, email, dateNac, password } = req.body;

    const newUser = await registerUser(
      { name, lastName, dni, email, dateNac },
      password
    );

    console.log("✅ [registerHandler] Usuario registrado correctamente:", newUser.uid);
    res.status(201).json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("❌ [registerHandler] Error:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

