// src/services/backendService.ts

import { LoginDTO, RegisterDTO } from "../shared/interfaces/frontDTO";

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

const login = async ({ dni, password }: LoginDTO) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni, password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
    }
    return data;
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

const checkCode = async ( code: string ) => {
    const response = await fetch(`${BASE_URL}/checkCode`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
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
