export class Medicamento {
    private uid: string;
    private nombre: string;
    private marca: string | null;
  
    constructor(uid: string, nombre: string, marca: string | null) {
      this.uid = uid;
      this.nombre = nombre;
      this.marca = marca;
    }
  
    // 🔸 Getters
    public getUid(): string {
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
    public static fromFirestore(uid:string, data: any): Medicamento {
      return new Medicamento(
        uid,
        data.nombre,
        data.marca ?? null
      );
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
  