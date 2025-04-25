import { CentroDTO, EspecialidadDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";


export interface MedicoCardProps {
    medico: MedicoDTO;
    especialidad: EspecialidadDTO;
    centro: CentroDTO;
    provincia:string;
    esFavorito?: boolean;
  }