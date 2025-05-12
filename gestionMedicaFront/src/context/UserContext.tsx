import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContextType } from "./ContextInterfaces";
import { AltaClienteDTO, InfoUserDTO } from "../shared/interfaces/frontDTO";
import { useAuth } from "./AuthContext";
import { backendService } from "../services/backendService";

// 1. Define el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<InfoUserDTO | null>(() => {
    // Carga inicial desde localStorage si existe
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  });

  const [altaClienteData, setAltaClienteData] = useState<AltaClienteDTO | null>(null);

  const { user, token } = useAuth();

  useEffect(() => {
    // Si ya hay userData en localStorage, no sobreescribimos con el backend
    const hasStoredUser = localStorage.getItem('userData');
    if (hasStoredUser) return;

    if (!user || !token) return;

    const fetchData = async () => {
      try {
        const response = await backendService.getUserInfo(user.uid);
        if (response.success && response.data) {
          setUserData(response.data.userData);
          setAltaClienteData(response.data.altaCliente);
        }
      } catch (error) {
        console.error('❌ Error al cargar datos de usuario en el contexto:', error);
      }
    };

    fetchData();
  }, [user, token]);

  // Sincroniza automáticamente userData con localStorage
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        altaClienteData,
        setAltaClienteData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// 2. Hook para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un <UserProvider>');
  }
  return context;
};