import { TipoTratamiento } from "./enums/TipoTratamiento";


export class Tratamiento {
  private fechaInicio: string;
  private fechaFin: string | null;
  private estado: boolean;
  private archivado: boolean;
  private idUsuario: string;
  private idMedico: string;
  private tipoTratamiento: TipoTratamiento;
  private descripcion: string; // 🔹 NUEVO CAMPO

  constructor(
    fechaInicio: string,
    fechaFin: string | null,
    estado: boolean,
    archivado: boolean,
    idUsuario: string,
    idMedico: string,
    tipoTratamiento: TipoTratamiento,
    descripcion: string // 🔹 NUEVO PARÁMETRO
  ) {
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.estado = estado;
    this.archivado = archivado;
    this.idUsuario = idUsuario;
    this.idMedico = idMedico;
    this.tipoTratamiento = tipoTratamiento;
    this.descripcion = descripcion; // 🔹 NUEVA ASIGNACIÓN
  }

  // 🔸 Getters
  public getFechaInicio(): string {
    return this.fechaInicio;
  }

  public getFechaFin(): string | null {
    return this.fechaFin;
  }

  public getEstado(): boolean {
    return this.estado;
  }

  public getArchivado(): boolean {
    return this.archivado;
  }

  public getIdUsuario(): string {
    return this.idUsuario;
  }

  public getIdMedico(): string {
    return this.idMedico;
  }

  public getTipoTratamiento(): TipoTratamiento {
    return this.tipoTratamiento;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  // 🔸 Setters
  public setFechaInicio(value: string): void {
    this.fechaInicio = value;
  }

  public setFechaFin(value: string | null): void {
    this.fechaFin = value;
  }

  public setEstado(value: boolean): void {
    this.estado = value;
  }

  public setArchivado(value: boolean): void {
    this.archivado = value;
  }

  public setIdUsuario(value: string): void {
    this.idUsuario = value;
  }

  public setIdMedico(value: string): void {
    this.idMedico = value;
  }

  public setTipoTratamiento(value: TipoTratamiento): void {
    this.tipoTratamiento = value;
  }

  public setDescripcion(value: string): void {
    this.descripcion = value;
  }

  // 🔸 Método estático para reconstruir desde Firestore
  public static fromFirestore(data: any): Tratamiento {
    return new Tratamiento(
      data.fechaInicio,
      data.fechaFin,
      data.estado,
      data.archivado,
      data.idUsuario,
      data.idMedico,
      data.tipoTratamiento,
      data.descripcion // 👈 Asegúrate de que esté en Firestore
    );
  }

  // 🔸 Convertir a objeto Firestore
  public toFirestoreObject(): Record<string, any> {
    return {
      fechaInicio: this.getFechaInicio(),
      fechaFin: this.getFechaFin(),
      estado: this.getEstado(),
      archivado: this.getArchivado(),
      idUsuario: this.getIdUsuario(),
      idMedico: this.getIdMedico(),
      tipoTratamiento: this.getTipoTratamiento(),
      descripcion: this.getDescripcion()
    };
  }

  // 🔸 Convertir a DTO para el frontend
  public toFrontDTO(idTratamiento: string): Record<string, any> {
    return {
      uid: idTratamiento,
      fechaInicio: this.getFechaInicio(),
      fechaFin: this.getFechaFin(),
      estado: this.getEstado(),
      archivado: this.getArchivado(),
      idUsuario: this.getIdUsuario(),
      idMedico: this.getIdMedico(),
      tipoTratamiento: this.getTipoTratamiento(),
      descripcion: this.getDescripcion()
    };
  }
}
