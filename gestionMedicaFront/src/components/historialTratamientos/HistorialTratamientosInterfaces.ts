export interface TratamientoDTO {
    uid: string;
    fechaInicio: string;     // Formato legible: "15/04/2025"
    fechaFin: string | null; // null si no ha terminado
    estado: boolean;         // true = activo, false = finalizado
    archivado: boolean;
    idUsuario: string;
    idMedico: string;
    tipoTratamiento: TipoTratamiento;
  }
  
  export enum TipoTratamiento {
    GENERAL = "General",
    CARDIOLOGIA = "Cardiología",
    DERMATOLOGIA = "Dermatología",
    TRAUMATOLOGIA = "Traumatología",
    PSIQUIATRIA = "Psiquiatría",
    DIGESTIVO = "Digestivo",
    ENDOCRINOLOGIA = "Endocrinología",
    PEDIATRIA = "Pediatría",
    NEUMOLOGIA = "Neumología",
    NEUROLOGIA = "Neurología",
    ONCOLOGIA = "Oncología",
    UROLOGIA = "Urología",
    GINECOLOGIA = "Ginecología",
    REUMATOLOGIA = "Reumatología",
    INFECTOLOGIA = "Infectología",
    NUTRICION = "Nutrición",
    REHABILITACION = "Rehabilitación",
    OTROS = "Otros"
  }

export interface  TratamientoCardProps{
    tratamiento: TratamientoDTO,
    index: number
}