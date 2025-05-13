import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContextType } from "./ContextInterfaces";
import { AltaClienteDTO, InfoUserDTO } from "../shared/interfaces/frontDTO";
import { useAuth } from "./AuthContext";
import { backendService } from "../services/backendService";

/**
 * UserProvider — Gestión de sesión de usuario con soporte para cuentas infantiles por pestaña
 *
 * Este contexto gestiona los datos del usuario actual (userData) y su información de cliente (altaClienteData),
 * incluyendo soporte para sesiones especiales como "cuentas infantiles".
 *
 * FUNCIONALIDAD CLAVE:
 * - Carga `userData` desde `sessionStorage`, lo que permite que cada ventana/pestaña tenga su propia sesión independiente.
 * - Si `userData` ya existe y su UID no coincide con el usuario autenticado (`useAuth().user.uid`), se considera
 *   una sesión forzada (ej. cuenta infantil) y **no se sobreescribe al recargar**.
 * - Si el UID coincide, se actualiza desde el backend (`getUserInfo`) como comportamiento estándar.
 * - Cada vez que `userData` cambia, se actualiza automáticamente en `sessionStorage`.
 *
 * OBJETIVO:
 * Permitir el uso simultáneo de una cuenta infantil en una pestaña, mientras se mantiene la sesión
 * del tutor en otra, sin conflictos ni sobrescrituras accidentales.
 *
 * NOTAS:
 * - `sessionStorage` se borra al cerrar la pestaña, lo que mejora la seguridad de las sesiones temporales.
 * - `tutorData` (si se usa para volver atrás) puede mantenerse en `localStorage` como respaldo permanente.
 */

const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  /**
   * VARIABLES
   */
  const [userData, setUserData] = useState<InfoUserDTO | null>(() => {
    const stored = sessionStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  });

  const [altaClienteData, setAltaClienteData] = useState<AltaClienteDTO | null>(null);
  const { user, token } = useAuth();

  /**
   * FUNCIONALIDAD
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !token) return;

      const stored = sessionStorage.getItem('userData');
      const parsedStored = stored ? JSON.parse(stored) : null;

      // Si estamos en modo infantil (uid no coincide), usar userData del sessionStorage
      if (parsedStored && parsedStored.uid !== user.uid) {
        setUserData(parsedStored);

        // 🔄 Recuperar también altaCliente del menor
        try {
          const response = await backendService.getUserInfo(parsedStored.uid);
          if (response.success && response.data) {
            setAltaClienteData(response.data.altaCliente);
          }
        } catch (error) {
          console.error("❌ Error al cargar altaCliente en modo infantil:", error);
        }

        return;
      }

      // Si coincide o no hay userData, cargamos desde backend como normal
      try {
        const response = await backendService.getUserInfo(user.uid);
        if (response.success && response.data) {
          setUserData(response.data.userData);
          setAltaClienteData(response.data.altaCliente);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos de usuario en el contexto:", error);
      }
    };

    fetchData();
  }, [user, token]);

  // Persistencia en sessionStorage
  useEffect(() => {
    if (userData) {
      sessionStorage.setItem('userData', JSON.stringify(userData));
    } else {
      sessionStorage.removeItem('userData');
    }
  }, [userData]);

  /**
   * RENDER
   */
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

// Hook para acceder fácilmente
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un <UserProvider>');
  }
  return context;
};