

 export interface DetalleTratamientoProps {
    tratamiento:TratamientoDTO;

 }

 export interface TratamientoDTO {
    uid: string;
    fechaInicio: string;
    fechaFin: string | null;
    estado: boolean;
    archivado: boolean;
    idUsuario: string;
    idMedico: string;
    tipoTratamiento: string;
    descripcion: string;
  }
  
  export interface LineaTratamientoDTO {
    uid: string;
    cantidad: string;
    unidad: string;
    medida: string;
    frecuencia:string;
    duracion: string;
    descripcion: string;
    idTratamiento: string;
    idMedicamento: string;
  }
  
  export interface MedicamentoDTO {
    uid: string;
    nombre: string;
    marca: string | null;
  }
  
  export interface LineaConMedicamento {
    linea: LineaTratamientoDTO;
    medicamento: MedicamentoDTO | null;
  }
  
  export interface CentroDTO {
    uid: string;
    nombreCentro: string;
    ubicacion: string | null;
    telefono: string | null;
  }
  
  export interface EspecialidadDTO {
    uid: string;
    nombre: string;
  }
  
  export interface MedicoDTO {
    uid: string;
    nombreMedico: string;
    apellidosMedico: string;
    idEspecialidad: string;
    idCentro: string;
    centro: CentroDTO | null;
    especialidad: EspecialidadDTO | null;
  }
  
  export interface TratamientoCompletoResponse {
    tratamiento: TratamientoDTO;
    lineas: LineaConMedicamento[];
    medico: MedicoDTO;
  }
