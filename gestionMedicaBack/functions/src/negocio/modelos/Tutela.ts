export class Tutela {
    private idTutela: string | null = null;
    private fechaVinculacion: string;
    private fechaDesvinculacion: string | null;
    private idTutor: string;
    private idTutelado: string;
  
    constructor(
      fechaVinculacion: string,
      fechaDesvinculacion: string | null,
      idTutor: string,
      idTutelado: string
    ) {
      this.fechaVinculacion = fechaVinculacion;
      this.fechaDesvinculacion = fechaDesvinculacion;
      this.idTutor = idTutor;
      this.idTutelado = idTutelado;
    }
  
    // 🔹 Getters
    public getIdTutela(): string | null {
      return this.idTutela;
    }
  
    public getFechaVinculacion(): string {
      return this.fechaVinculacion;
    }
  
    public getFechaDesvinculacion(): string | null {
      return this.fechaDesvinculacion;
    }
  
    public getIdTutor(): string {
      return this.idTutor;
    }
  
    public getIdTutelado(): string {
      return this.idTutelado;
    }
  
    // 🔹 Setters
    public setIdTutela(value: string): void {
      this.idTutela = value;
    }
  
    public setFechaVinculacion(value: string): void {
      this.fechaVinculacion = value;
    }
  
    public setFechaDesvinculacion(value: string | null): void {
      this.fechaDesvinculacion = value;
    }
  
    public setIdTutor(value: string): void {
      this.idTutor = value;
    }
  
    public setIdTutelado(value: string): void {
      this.idTutelado = value;
    }
  
    // 🔹 Método para reconstruir desde Firestore
    public static fromFirestore(idTutela: string, data: any): Tutela {
      const tutela = new Tutela(
        data.fechaVinculacion,
        data.fechaDesvinculacion ?? null,
        data.idTutor,
        data.idTutelado
      );
      tutela.setIdTutela(idTutela);
      return tutela;
    }
  
    // 🔹 Convertir a objeto Firestore
    public toFirestoreObject(): Record<string, any> {
      return {
        fechaVinculacion: this.getFechaVinculacion(),
        fechaDesvinculacion: this.getFechaDesvinculacion(),
        idTutor: this.getIdTutor(),
        idTutelado: this.getIdTutelado()
      };
    }
  
    // 🔹 Convertir a DTO para el Frontend
    public toFrontDTO(): Record<string, any> {
      return {
        idTutela: this.getIdTutela(),
        fechaVinculacion: this.getFechaVinculacion(),
        fechaDesvinculacion: this.getFechaDesvinculacion(),
        idTutor: this.getIdTutor(),
        idTutelado: this.getIdTutelado()
      };
    }
  }
  