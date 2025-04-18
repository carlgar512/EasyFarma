// src/services/backendService.ts

import { InfoUserDTO, LoginDTO, RegisterDTO } from "../shared/interfaces/frontDTO";
import { signInWithEmailAndPassword, updateEmail } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Asegúrate de que este path es correcto

const BASE_URL = "http://localhost:5001/easyfarma-5ead7/us-central1";


const register = async (userData: RegisterDTO) => {
    try {
        // 1. Registro en backend
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                error: data.error || "Error al registrar usuario",
            };
        }

        // 2. Autenticación automática
        const userCredential = await signInWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );

        // 3. Obtener token
        const token = await userCredential.user.getIdToken();

        // 4. Devolver info útil
        return {
            success: true,
            user: userCredential.user,
            token,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Error inesperado durante el registro",
        };
    }
};



export const login = async ({ dni, password }: LoginDTO) => {
    try {
        // 1. Obtener el email asociado al DNI
        const res = await fetch(`${BASE_URL}/getEmailByDni?dni=${dni}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                error: data.error || "No se pudo obtener el email asociado al DNI",
            };
        }
        const email = data.email;
        // 2. Hacer login con Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        // 3. Devolver la info relevante
        return {
            success: true,
            user: userCredential.user,
            token,
        };

    } catch (error: any) {
        return {
            success: false,
            error: error?.message || "Error al iniciar sesión",
        };
    }
};

const recoveryRequest = async (dni: string) => {
    const response = await fetch(`${BASE_URL}/recoveryRequest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error en la busqueda de cuenta");
    }
    return data;
};

const passwordReset = async (dni: string, password: string) => {
    const response = await fetch(`${BASE_URL}/passwordReset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al restablecer contraseña");
    }
    return data;
};

const checkCode = async (dni: string, code: string) => {
    const response = await fetch(`${BASE_URL}/checkCode`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni, code }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al verificar código");
    }
    return data;
};

const deactivateUser = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/bajaUsuario`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idUsuario }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al dar de baja");
    }
    return data;
};

const getUserInfo = async (idUsuario: string) => {
    try {
        const res = await fetch(`${BASE_URL}/getUserInfo?idUsuario=${idUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            return {
                success: false,
                error: data.error || "No se pudo obtener la información del usuario.",
            };
        }

        return {
            success: true,
            ...data,
        };

    } catch (error: any) {
        return {
            success: false,
            error: error?.message || "Error al obtener información del usuario.",
        };
    }
};

const updateUserInfo = async (updatedUser: InfoUserDTO) => {
    try {
        const res = await fetch(`${BASE_URL}/updateUserInfo`, {
            method: "PATCH", // sigue siendo PATCH, porque es una actualización
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser), // 👈 enviás el objeto completo
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            return {
                success: false,
                error: data.error || "No se pudo actualizar la información del usuario.",
            };
        }
        return {
            success: true,
            data: data.updatedUser, // opcional: lo que devuelva tu backend
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || "Error al actualizar información del usuario.",
        };
    }
};

const updateEmailFirebaseAuth = async (newEmail: string): Promise<void> => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No hay usuario autenticado.");
    }

    try {
        await updateEmail(user, newEmail);
        console.log("✅ Email actualizado correctamente.");
    } catch (error: any) {
        console.error("❌ Error al actualizar email:", error.message || error);
        throw new Error(error.message || "No se pudo actualizar el correo electrónico.");
    }
};


const getAlergias = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/getAlergias?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener alergias");
    }

    return data.alergias; // devolvemos directamente la lista
};

const getTratamientosArchivados = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/getTratamientosArchivados?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener tratamientos archivados");
    }

    return data.tratamientos;
};

const getTratamientosActivos = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/getTratamientosActivos?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener tratamientos activos");
    }

    return data.tratamientos;
};

const getTratamientosActuales = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/getTratamientosActuales?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener tratamientos actuales");
    }

    return data.tratamientos;
};

const updateArchivadoTratamiento = async (idTratamiento: string, nuevoEstado: boolean) => {
    const response = await fetch(`${BASE_URL}/updateArchivadoTratamiento`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idTratamiento, nuevoEstado }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al actualizar estado de archivado");
    }

    return data;
};



export const backendService = {
    register,
    login,
    recoveryRequest,
    passwordReset,
    checkCode,
    deactivateUser,
    getUserInfo,
    updateUserInfo,
    updateEmailFirebaseAuth,
    getAlergias,
    getTratamientosArchivados,
    getTratamientosActivos,
    getTratamientosActuales,
    updateArchivadoTratamiento
};
