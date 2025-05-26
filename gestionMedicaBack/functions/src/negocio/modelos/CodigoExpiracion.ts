import { Timestamp } from "firebase-admin/firestore";


export class CodigoExpiracion {
    // Atributos
    private dni: string;
    private code: string;
    private expiresAt: Date;

    // Constructor
    constructor(dni: string, code: string, expiresAt: Date) {
        this.dni = dni;
        this.code = code;
        this.expiresAt = expiresAt;
    }

    // Getters
    public getDni(): string {
        return this.dni;
    }

    public getCode(): string {
        return this.code;
    }

    public getExpiresAt(): Date {
        return this.expiresAt;
    }

    public toFirestoreObject() {
        return {
            dni: this.dni,
            code: this.code,
            expiresAt: Timestamp.fromDate(this.expiresAt)// Convierte expiresAt a Timestamp
        };
    }

    // Método para convertir de modelo de Firebase a objeto
    public static fromFirestoreObject(firebaseModel: any):CodigoExpiracion {
        const dni = firebaseModel.dni;
        const code = firebaseModel.code;
        const expiresAt = new Date(firebaseModel.expiresAt); // Convierte el timestamp a Date
        return new CodigoExpiracion(dni, code, expiresAt);
    }

    // Método para comparar la fecha de expiración
    public compareExpireDate(currentDate: Date): boolean {
        return currentDate <= this.expiresAt;
    }
}
