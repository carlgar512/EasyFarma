import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import React from "react";
import { AuthContextType } from "./ContextInterfaces";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";


/**
 * Contexto de Autenticación (`AuthContext`)
 *
 * Este componente provee un contexto global para gestionar la autenticación de usuarios.
 * Se encarga de:
 * - Mantener el usuario autenticado (`user`) y el token JWT (`token`).
 * - Recuperar el token desde `localStorage` al iniciar.
 * - Escuchar los cambios en el estado de autenticación con Firebase.
 * - Exponer funciones para establecer (`setAuth`) o cerrar sesión (`logout`).
 *
 * Hook personalizado:
 * - `useAuth()` permite acceder al contexto de autenticación desde cualquier componente hijo.
 *   Lanza un error si se usa fuera del `AuthProvider`.
 *
 * Uso:
 * Envuelve tu aplicación con `<AuthProvider>` para tener acceso al contexto.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  /**
   * VARIABLES
   */
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  /**
   * FUNCIONALIDAD
   */
  useEffect(() => {
    // Recuperar token guardado en localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    // Escuchar si Firebase tiene un usuario logueado
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar
  }, []);

  const setAuth = (user: any, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  /**
   * RENDER
   */
  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 *  HOOK
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
};
