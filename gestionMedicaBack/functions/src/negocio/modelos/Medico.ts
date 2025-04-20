export class Medico {
  private uid: string | null = null;
  private nombreMedico: string;
  private apellidosMedico: string;
  private idEspecialidad: string;
  private idCentro: string;

  constructor(
    nombreMedico: string,
    apellidosMedico: string,
    idEspecialidad: string,
    idCentro: string
  ) {
    this.nombreMedico = nombreMedico;
    this.apellidosMedico = apellidosMedico;
    this.idEspecialidad = idEspecialidad;
    this.idCentro = idCentro;
  }

  // 🔸 Getters
  public getUid(): string | null {
    return this.uid;
  }

  public getNombreMedico(): string {
    return this.nombreMedico;
  }

  public getApellidosMedico(): string {
    return this.apellidosMedico;
  }

  public getIdEspecialidad(): string {
    return this.idEspecialidad;
  }

  public getIdCentro(): string {
    return this.idCentro;
  }

  // 🔸 Setters
  public setUid(value: string): void {
    this.uid = value;
  }

  public setNombreMedico(value: string): void {
    this.nombreMedico = value;
  }

  public setApellidosMedico(value: string): void {
    this.apellidosMedico = value;
  }

  public setIdEspecialidad(value: string): void {
    this.idEspecialidad = value;
  }

  public setIdCentro(value: string): void {
    this.idCentro = value;
  }

  // 🔸 Método estático para reconstruir desde Firestore
  public static fromFirestore(uid: string, data: any): Medico {
    const medico = new Medico(
      data.nombreMedico,
      data.apellidosMedico,
      data.idEspecialidad,
      data.idCentro
    );
    medico.setUid(uid);
    return medico;
  }

  // 🔸 Convertir a objeto Firestore
  public toFirestoreObject(): Record<string, any> {
    return {
      nombreMedico: this.getNombreMedico(),
      apellidosMedico: this.getApellidosMedico(),
      idEspecialidad: this.getIdEspecialidad(),
      idCentro: this.getIdCentro()
    };
  }

  // 🔸 Convertir a DTO para el frontend
  public toFrontDTO(): Record<string, any> {
    return {
      uid: this.getUid(),
      nombreMedico: this.getNombreMedico(),
      apellidosMedico: this.getApellidosMedico(),
      idEspecialidad: this.getIdEspecialidad(),
      idCentro: this.getIdCentro()
    };
  }
}
