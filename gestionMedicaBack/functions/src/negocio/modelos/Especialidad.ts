export class Especialidad {
  private uid: string | null = null;
  private nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  // 🔸 Getters
  public getUid(): string | null {
    return this.uid;
  }

  public getNombre(): string {
    return this.nombre;
  }

  // 🔸 Setters
  public setUid(value: string): void {
    this.uid = value;
  }

  public setNombre(value: string): void {
    this.nombre = value;
  }

  // 🔸 Método estático para reconstruir desde Firestore con el ID del documento
  public static fromFirestore(uid: string, data: any): Especialidad {
    const especialidad = new Especialidad(data.nombre);
    especialidad.setUid(uid);
    return especialidad;
  }

  // 🔸 Convertir a objeto Firestore (sin UID)
  public toFirestoreObject(): Record<string, any> {
    return {
      nombre: this.getNombre()
    };
  }

  // 🔸 Convertir a DTO para el frontend (incluye UID si existe)
  public toFrontDTO(): Record<string, any> {
    return {
      uid: this.getUid(),
      nombre: this.getNombre()
    };
  }
}
