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
    campo: keyof FormularioUsuario | null; // nombre del campo a editar
    valor: string; // valor actual del campo
    onGuardar: (nuevoValor: string) => void; // función que actualiza el estado
  }

  export interface FormularioUsuario {
    name: string;
    lastName: string;
    dni: string;
    dateNac: string;
    email: string;
    direccion: string;
    tlf: string;
    password: string;
    confirmPassword: string;
    tipoUsuario: string;
  }