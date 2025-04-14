// src/services/backendService.ts

import { LoginDTO, RegisterDTO } from "../shared/interfaces/frontDTO";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Asegúrate de que este path es correcto

const BASE_URL = "http://localhost:5001/easyfarma-5ead7/us-central1";


const register = async (userData: RegisterDTO) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
    }
    return data;
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

const recoveryRequest = async ( dni:string ) => {
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

const passwordReset = async ( dni: string, password: string ) => {
    const response = await fetch(`${BASE_URL}/passwordReset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni,password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al restablecer contraseña");
    }
    return data;
};

const checkCode = async ( dni:string, code: string ) => {
    const response = await fetch(`${BASE_URL}/checkCode`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({dni, code }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al verificar código");
    }
    return data;
};


export const backendService = {
    register,
    login,
    recoveryRequest,
    passwordReset,
    checkCode
};
