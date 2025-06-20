import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import React from "react";
import { AuthContextType } from "./ContextInterfaces";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";


/**
 * Contexto de Autenticación (`AuthContext`)
 *
 * Este componente provee un contexto global para gestionar la autenticación de usuarios.
 *
 * Funcionalidades principales:
 * - Mantiene el usuario autenticado (`user`) y el token JWT (`token`).
 * - Recupera el token desde `localStorage` al iniciar.
 * - Escucha los cambios en el estado de autenticación usando Firebase (`onAuthStateChanged`).
 * - Cierra la sesión automáticamente tras 30 minutos de inactividad del usuario.
 * - Sincroniza el cierre de sesión entre pestañas mediante eventos de `localStorage`.
 * - Expone funciones `setAuth()` para iniciar sesión y `logout()` para cerrarla completamente.
 *
 * Hook personalizado:
 * - `useAuth()` permite acceder al contexto de autenticación desde cualquier componente hijo.
 *   Lanza un error si se usa fuera del `<AuthProvider>`.
 *
 * Uso:
 * Envuelve tu aplicación con `<AuthProvider>` para tener acceso global al contexto de autenticación.
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

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "token" && e.newValue === null) {
        logout();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
  
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.warn("🕒 Inactividad detectada, cerrando sesión...");
        logout();
        window.location.href = "/";
        signOut(auth).catch((e) => {
          console.warn("⚠️ Error al cerrar sesión de Firebase:", e);
        });
      
      }, 20 * 60 * 1000); // 20 minutos
    };
  
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
  
    resetTimer(); // inicializa
  
    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

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
