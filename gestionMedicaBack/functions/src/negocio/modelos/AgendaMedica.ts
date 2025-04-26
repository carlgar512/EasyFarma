export class AgendaMedica {
    private uid: string | null = null;
    private fecha: string;
    private idMedico: string;
    private horarios: Record<string, boolean>;
  
    constructor(fecha: string, idMedico: string, horarios: Record<string, boolean>) {
      this.fecha = fecha;
      this.idMedico = idMedico;
      this.horarios = horarios;
    }
  
    // 🔸 Getters
    public getUid(): string | null {
      return this.uid;
    }
  
    public getFecha(): string {
      return this.fecha;
    }
  
    public getIdMedico(): string {
      return this.idMedico;
    }
  
    public getHorarios(): Record<string, boolean> {
      return this.horarios;
    }
  
    // 🔸 Setters
    public setUid(value: string): void {
      this.uid = value;
    }
  
    public setFecha(value: string): void {
      this.fecha = value;
    }
  
    public setIdMedico(value: string): void {
      this.idMedico = value;
    }
  
    public setHorarios(value: Record<string, boolean>): void {
      this.horarios = value;
    }
  
    // 🔸 Método estático para reconstruir desde Firestore
    public static fromFirestore(uid: string, data: any): AgendaMedica {
      const agenda = new AgendaMedica(
        data.fecha,
        data.idMedico,
        data.horarios ?? {}
      );
      agenda.setUid(uid);
      return agenda;
    }
  
    // 🔸 Convertir a objeto Firestore
    public toFirestoreObject(): Record<string, any> {
      return {
        fecha: this.getFecha(),
        idMedico: this.getIdMedico(),
        horarios: this.getHorarios()
      };
    }
  
    // 🔸 Convertir a DTO para el frontend
    public toFrontDTO(): Record<string, any> {
      return {
        uid: this.getUid(),
        fecha: this.getFecha(),
        idMedico: this.getIdMedico(),
        horarios: this.getHorarios()
      };
    }
  }
  