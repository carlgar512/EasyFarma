import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContextType } from "./ContextInterfaces";
import { AltaClienteDTO, InfoUserDTO } from "../shared/interfaces/frontDTO";
import { useAuth } from "./AuthContext";
import { backendService } from "../services/backendService";


// 2. Creamos el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<InfoUserDTO | null>(null);
    const [altaClienteData, setAltaClienteData] = useState<AltaClienteDTO | null>(null);
  
    const { user, token } = useAuth();
  
    useEffect(() => {
      if (!user || !token) return;
  
      const fetchData = async () => {
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
  
    return (
      <UserContext.Provider value={{ userData, setUserData, altaClienteData, setAltaClienteData }}>
        {children}
      </UserContext.Provider>
    );
  };
  

// 4. Hook para usar el contexto fácilmente
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un <UserProvider>");
  }
  return context;
};
