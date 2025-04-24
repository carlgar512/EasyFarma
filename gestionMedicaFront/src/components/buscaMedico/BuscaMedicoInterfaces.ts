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
    
  }
  

  export interface MedicoDTO {
    uid: string;
    nombreMedico: string;
    apellidosMedico: string;
    idEspecialidad: string;
    idCentro: string;
  }
  
  export interface CentroDTO {
    uid: string;
    nombreCentro: string;
    ubicacion: string | null;
    telefono: string | null;
    provincia: string; // Nombre de la provincia
  }
  
  export interface EspecialidadDTO {
    uid: string;
    nombre: string;
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
  