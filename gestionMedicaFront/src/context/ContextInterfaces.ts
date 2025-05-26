import { AltaClienteDTO, InfoUserDTO } from "../shared/interfaces/frontDTO";

export type AuthContextType = {
    user: any;
    token: string | null;
    setAuth: (user: any, token: string) => void;
    logout: () => void;
  };

export type UserContextType = {
    userData: InfoUserDTO | null;
    setUserData: (data: InfoUserDTO) => void;
    altaClienteData: AltaClienteDTO | null;
    setAltaClienteData: (data: AltaClienteDTO) => void;
  };