import { CentroDTO, EspecialidadDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";


export interface DetalleMedicoProps {
    medico: MedicoDTO,
    centro: CentroDTO,
    especialidad: EspecialidadDTO,
    isFavorito:boolean,
    seccionAgendarCita:boolean
}

export interface ModalUbicacionProps {
    isOpen: boolean;
    onClose: () => void;
    ubicacion: string;
  }

export  interface AgendaCitaProps {
    setSeccionAgendarCita: (value: boolean) => void;
}