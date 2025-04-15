import { Timestamp } from "firebase-admin/firestore";

export class AltaCliente {

    private fechaAlta: Date;
    private fechaBaja: Date | null;
    private idUsuario: string;

    constructor(idUsuario: string, fechaAlta: Date, fechaBaja: Date | null = null) {
        if (!idUsuario || !fechaAlta) {
            throw new Error("El campo idUsuario y fechaAlta son obligatorios.");
        }

        this.fechaAlta = fechaAlta;
        this.fechaBaja = fechaBaja;
        this.idUsuario = idUsuario;
    }

    // 🔁 Para subir a Firestore
    public toFirestoreObject() {
        return {
            fechaAlta: Timestamp.fromDate(this.fechaAlta),
            fechaBaja: this.fechaBaja ? Timestamp.fromDate(this.fechaBaja) : null,
            idUsuario: this.idUsuario,
        };
    }

    public toFrontendObject(){
        return {
          fechaAlta: this.fechaAlta.toString(),
          fechaBaja: this.fechaBaja ? this.fechaBaja.toString() : "",
          idUsuario: this.idUsuario,
        };
      }

    // 🔁 Para reconstruir desde Firestore
    public static fromFirestoreObject(firebaseData: any): AltaCliente {

        const fechaAlta = firebaseData.fechaAlta?.toDate?.() ?? new Date();
        const fechaBaja = firebaseData.fechaBaja?.toDate?.() ?? null;
        const idUsuario = firebaseData.idUsuario;

        return new AltaCliente(idUsuario, fechaAlta, fechaBaja);
    }

    public getFechaAlta(): Date {
        return this.fechaAlta;
    }

    public setFechaAlta(fecha: Date): void {
        this.fechaAlta = fecha;
    }

    public getFechaBaja(): Date | null {
        return this.fechaBaja;
    }

    public setFechaBaja(fecha: Date | null): void {
        this.fechaBaja = fecha;
    }

    public getIdUsuario(): string {
        return this.idUsuario;
    }

    public setIdUsuario(id: string): void {
        this.idUsuario = id;
    }
}
