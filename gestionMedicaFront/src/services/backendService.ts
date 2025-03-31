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

export const backendService = {
  register,
  login,
};
