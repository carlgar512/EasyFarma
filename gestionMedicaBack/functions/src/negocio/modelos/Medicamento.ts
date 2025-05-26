export class Medicamento {
  private uid: string | null = null;
  private nombre: string;
  private marca: string | null;

  constructor(nombre: string, marca: string | null) {
    this.nombre = nombre;
    this.marca = marca;
  }

  // 🔸 Getters
  public getUid(): string | null {
    return this.uid;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getMarca(): string | null {
    return this.marca;
  }

  // 🔸 Setters
  public setUid(value: string): void {
    this.uid = value;
  }

  public setNombre(value: string): void {
    this.nombre = value;
  }

  public setMarca(value: string | null): void {
    this.marca = value;
  }

  // 🔸 Método estático para reconstruir desde Firestore
  public static fromFirestore(uid: string, data: any): Medicamento {
    const medicamento = new Medicamento(
      data.nombre,
      data.marca ?? null
    );
    medicamento.setUid(uid);
    return medicamento;
  }

  // 🔸 Convertir a objeto Firestore
  public toFirestoreObject(): Record<string, any> {
    return {
      nombre: this.getNombre(),
      marca: this.getMarca()
    };
  }

  // 🔸 Convertir a DTO para el frontend
  public toFrontDTO(): Record<string, any> {
    return {
      uid: this.getUid(),
      nombre: this.getNombre(),
      marca: this.getMarca()
    };
  }
}
