import { GradoSeveridad } from "./enums/GradoSeveridad";
import { TipoAlergeno } from "./enums/TipoAlergeno";

export class Alergia {
    private uidUsuario: string;
    private titulo: string;
    private descripcion: string;
    private tipoAlergeno: TipoAlergeno;
    private gradoSeveridad: GradoSeveridad;
    private sintomas: string[];

    constructor(
        uidUsuario: string,
        titulo: string,
        descripcion: string,
        tipoAlergeno: TipoAlergeno,
        gradoSeveridad: GradoSeveridad,
        sintomas: string[]
    ) {
        this.uidUsuario = uidUsuario;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tipoAlergeno = tipoAlergeno;
        this.gradoSeveridad = gradoSeveridad;
        this.sintomas = sintomas;
    }

    // Getters
    public getUidUsuario(): string {
        return this.uidUsuario;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }

    public getTipoAlergeno(): TipoAlergeno {
        return this.tipoAlergeno;
    }

    public getGradoSeveridad(): GradoSeveridad {
        return this.gradoSeveridad;
    }

    public getSintomas(): string[] {
        return this.sintomas;
    }

    // Setters
    public setUidUsuario(uidUsuario: string): void {
        this.uidUsuario = uidUsuario;
    }

    public setTitulo(titulo: string): void {
        this.titulo = titulo;
    }

    public setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    public setTipoAlergeno(tipoAlergeno: TipoAlergeno): void {
        this.tipoAlergeno = tipoAlergeno;
    }

    public setGradoSeveridad(gradoSeveridad: GradoSeveridad): void {
        this.gradoSeveridad = gradoSeveridad;
    }

    public setSintomas(sintomas: string[]): void {
        this.sintomas = sintomas;
    }

    // Método estático para crear una instancia desde Firestore
    static fromFirestore(data: any): Alergia {
        return new Alergia(
            data.uidUsuario,
            data.titulo,
            data.descripcion,
            data.tipoAlergeno,
            data.gradoSeveridad,
            data.sintomas
        );
    }

    // Método para convertir a objeto Firestore
    toFirestoreObject(): Record<string, any> {
        return {
            uidUsuario: this.getUidUsuario(),
            titulo: this.getTitulo(),
            descripcion: this.getDescripcion(),
            tipoAlergeno: this.getTipoAlergeno(),
            gradoSeveridad: this.getGradoSeveridad(),
            sintomas: this.getSintomas(),
        };
    }

    public toFrontDTO() {
        return {
            titulo: this.getTitulo(),
            descripcion: this.getDescripcion(),
            tipoAlergeno: this.getTipoAlergeno(),
            gradoSeveridad: this.getGradoSeveridad(),
            sintomas: this.getSintomas(),
        };
    }
}

