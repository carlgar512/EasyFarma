import { CentroDTO, CitaDTO, EspecialidadDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";
import { Operation } from "../../shared/interfaces/Operation";

export interface OperationCardProps {
    operation: Operation;
}

export interface SoporteTelefonicoCard {
    icon: string;
    title: string;
    phone: string;
    description?: string;
}

export interface CarouselSectionProps {
    data: any[];
    CardComponent: React.FC<any>;
    propMapper?: (item: any) => any;
    loading?: boolean;
}

export interface MedicoCardSimplifiedProps {
    medico: MedicoDTO
    especialidad: EspecialidadDTO;
    centro: CentroDTO;
}

export interface AgendaPacienteProps {
    citas: CitaDTO[];
    onActualizar: () => void;
    loading: boolean;
}

export interface ModoAccesibilidadProps {
    setPantallaActiva: (valor: "operaciones" | "medicos" | "asistencia") => void;
  }
  