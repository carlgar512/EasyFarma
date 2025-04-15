import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import React from "react";
import { AuthContextType } from "./ContextInterfaces";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

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

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
};
