import { mapaProvincias } from "./data/provincias";

export class Centro {
  private uid: string | null = null;
  private nombreCentro: string;
  private ubicacion: string | null;
  private telefono: string | null;
  private provincia: number | null;

  constructor(nombreCentro: string, ubicacion: string | null, telefono: string | null, provincia: number) {

    this.nombreCentro = nombreCentro;
    this.ubicacion = ubicacion;
    this.telefono = telefono;
    this.provincia = provincia;
  }

  // 🔸 Getters
  public getUid(): string | null {
    return this.uid;
  }

  public getNombreCentro(): string {
    return this.nombreCentro;
  }

  public getUbicacion(): string | null {
    return this.ubicacion;
  }

  public getTelefono(): string | null {
    return this.telefono;
  }

  public getProvincia(): number | null {
    return this.provincia;
  }

  // 🔸 Setters
  public setUid(value: string): void {
    this.uid = value;
  }

  public setNombreCentro(value: string): void {
    this.nombreCentro = value;
  }

  public setUbicacion(value: string | null): void {
    this.ubicacion = value;
  }

  public setTelefono(value: string | null): void {
    this.telefono = value;
  }

  public setProvincia(value: number ): void {
    this.provincia = value;
  }

  // 🔸 Método estático para reconstruir desde Firestore
  public static fromFirestore(uid: string, data: any): Centro {

    const centro = new Centro(
      data.nombreCentro,
      data.ubicacion ?? null,
      data.telefono ?? null,
      data.provincia ?? null,
    );
    centro.setUid(uid);
    return centro;
  }

  // 🔸 Convertir a objeto Firestore
  public toFirestoreObject(): Record<string, any> {

    return {
      nombreCentro: this.getNombreCentro(),
      ubicacion: this.getUbicacion(),
      telefono: this.getTelefono(),
      provincia: this.getProvincia(),
    };
  }

  // 🔸 Convertir a DTO para el frontend
  public toFrontDTO(): Record<string, any> {
    return {
      uid: this.getUid(),
      nombreCentro: this.getNombreCentro(),
      ubicacion: this.getUbicacion(),
      telefono: this.getTelefono(),
      provincia: this.provincia !== null ? mapaProvincias[this.provincia] : null
    };
  }
}
