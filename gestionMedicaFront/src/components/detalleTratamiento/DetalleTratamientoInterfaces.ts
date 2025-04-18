import { TratamientoDTO } from "../historialTratamientos/HistorialTratamientosInterfaces";

 export interface DetalleTratamientoProps {
    tratamiento:TratamientoDTO;
 }

 export interface LineaTratamientoDTO{
    medicamento:string;
    cantidad:string;
    dosis:string
    unidad:string;
    frecuencia:string;
    duracion:string;
    descripcion:string
 }

 export interface MedicoCardDTO {
    uid:string;
    nombre:string;
    apellidos:string;
    especialidad:string;
    centro:string;
 }

 export interface MedicoCardProps {
    nombre: string;
    apellidos: string;
    especialidad: string;
    centro: string;
    esFavorito?: boolean;
  }