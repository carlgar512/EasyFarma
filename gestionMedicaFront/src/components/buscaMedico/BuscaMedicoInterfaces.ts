import { CentroDTO, EspecialidadDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";

export interface ModalFiltrosProps {
    isOpen: boolean;
    onClose: () => void;
    onAplicarFiltros: (filtros: {
      provincia: string;
      especialidad: string;
      centro: string;
      nombre: string;
    }) => void;
    provincias: ProvinciaMapa;
    especialidades: EspecialidadDTO[];
    centros: CentroDTO[];
    mapaFiltros: MapaProvincias;
    medicos: MedicoDTO[];
    filtrosAplicados: {
      provincia: string;
      especialidad: string;
      centro: string;
      nombre: string;
  };
    
  }

  export interface ProvinciaMapa {
    [provinciaId: string]: string; // Ej: { "28": "Madrid" }
  }
  
  export interface MapaMedico {
    medicos: string[]; // array de uid de médicos
  }
  
  export interface MapaEspecialidades {
    [idEspecialidad: string]: MapaMedico;
  }
  
  export interface MapaCentros {
    [idCentro: string]: {
      especialidades: MapaEspecialidades;
    };
  }
  
  export interface MapaProvincias {
    [idProvincia: string]: {
      centros: MapaCentros;
    };
  }
  
  export interface MapaFiltrosResponse {
    mapa: MapaProvincias;
    medicos: MedicoDTO[];
    centros: CentroDTO[];
    especialidades: EspecialidadDTO[];
    provincias: ProvinciaMapa;
  }
  