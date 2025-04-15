import { InfoUserDTO } from "../../shared/interfaces/frontDTO";

export interface DatoUsuarioProps {
    label: string;
    value: string;
    editable?: boolean;
    setIsModalOpen?: () => void;
  }

  export interface ModalCambioDatoRegularProps {
    isOpen: boolean
    setIsModalOpen: (open: boolean) => void;
  }

  export interface ModalCambioDatoRegularProps {
    isOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    campo: CampoFormularioEditable|null;
    valor: string; // valor actual del campo
    onGuardar: (nuevoValor: string , campo: string) =>Promise<boolean>; // función que actualiza el estado
  }
  export type CampoFormularioEditable = keyof InfoUserDTO | "password";