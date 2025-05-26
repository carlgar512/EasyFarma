import { InfoUserDTO } from "../../shared/interfaces/frontDTO";

export interface CuentaInfantilCardProps {
    usuario: InfoUserDTO;
    setLoading: (value: boolean) => void;
  }

 export interface ModalTransitionAccProps {
    isOpen: boolean;
    onConfirm: (data: {
      email: string;
      dni: string;
      password: string;
      confirmPassword: string;
    }) => void;
    onCancel: () => void;
    usuarioTutelado:InfoUserDTO;
  }