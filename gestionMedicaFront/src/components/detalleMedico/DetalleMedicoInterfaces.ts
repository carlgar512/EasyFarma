import { CentroDTO, EspecialidadDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";


export interface DetalleMedicoProps {
    medico: MedicoDTO,
    centro: CentroDTO,
    especialidad: EspecialidadDTO,
}
