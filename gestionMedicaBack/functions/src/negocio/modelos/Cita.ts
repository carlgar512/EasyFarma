import { EstadoCita } from "./enums/EstadoCita";

export class Cita {
    private uid: string | null = null;
    private fechaCita: string;
    private horaCita: string;
    private estadoCita: EstadoCita;
    private archivado: boolean;
    private idUsuario: string;
    private idMedico: string;
  
    constructor(
      fechaCita: string,
      horaCita: string,
      estadoCita: EstadoCita,
      archivado: boolean,
      idUsuario: string,
      idMedico: string
    ) {
      this.fechaCita = fechaCita;
      this.horaCita = horaCita;
      this.estadoCita = estadoCita;
      this.archivado = archivado;
      this.idUsuario = idUsuario;
      this.idMedico = idMedico;
    }
  
    // 🔹 Getters
    public getUid(): string | null {
      return this.uid;
    }
  
    public getFechaCita(): string {
      return this.fechaCita;
    }
  
    public getHoraCita(): string {
      return this.horaCita;
    }
  
    public getEstadoCita(): EstadoCita {
      return this.estadoCita;
    }
  
    public isArchivado(): boolean {
      return this.archivado;
    }
  
    public getIdUsuario(): string {
      return this.idUsuario;
    }
  
    public getIdMedico(): string {
      return this.idMedico;
    }
  
    // 🔹 Setters
    public setUid(value: string): void {
      this.uid = value;
    }
  
    public setFechaCita(value: string): void {
      this.fechaCita = value;
    }
  
    public setHoraCita(value: string): void {
      this.horaCita = value;
    }
  
    public setEstadoCita(value: EstadoCita): void {
      this.estadoCita = value;
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
  
    // 🔹 Método para reconstruir desde Firestore
    public static fromFirestore(uid: string, data: any): Cita {
      const cita = new Cita(
        data.fechaCita,
        data.horaCita,
        data.estadoCita as EstadoCita,
        data.archivado,
        data.idUsuario,
        data.idMedico
      );
      cita.setUid(uid);
      return cita;
    }
  
    // 🔹 Convertir a objeto Firestore
    public toFirestoreObject(): Record<string, any> {
      return {
        fechaCita: this.getFechaCita(),
        horaCita: this.getHoraCita(),
        estadoCita: this.getEstadoCita(),
        archivado: this.isArchivado(),
        idUsuario: this.getIdUsuario(),
        idMedico: this.getIdMedico()
      };
    }
  
    // 🔹 Convertir a DTO para el Frontend
    public toFrontDTO(): Record<string, any> {
      return {
        uid: this.getUid(),
        fechaCita: this.getFechaCita(),
        horaCita: this.getHoraCita(),
        estadoCita: this.getEstadoCita(),
        archivado: this.isArchivado(),
        idUsuario: this.getIdUsuario(),
        idMedico: this.getIdMedico()
      };
    }
  }