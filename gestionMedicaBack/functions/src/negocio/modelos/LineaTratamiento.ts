export class LineaTratamiento {
    private uid: string;
    private cantidad: number;
    private unidad: number;
    private medida: string;
    private duracion: string;
    private descripcion: string;
    private idTratamiento: string;
    private idMedicamento: string;

    constructor(
        uid: string,
        cantidad: number,
        unidad: number,
        medida: string,
        duracion: string,
        descripcion: string,
        idTratamiento: string,
        idMedicamento: string
    ) {
        this.uid = uid;
        this.cantidad = cantidad;
        this.unidad = unidad;
        this.medida = medida;
        this.duracion = duracion;
        this.descripcion = descripcion;
        this.idTratamiento = idTratamiento;
        this.idMedicamento = idMedicamento;
    }

    // 🔸 Getters
    public getUid(): string {
        return this.uid;
    }

    public getCantidad(): number {
        return this.cantidad;
    }

    public getUnidad(): number {
        return this.unidad;
    }

    public getMedida(): string {
        return this.medida;
    }

    public getDuracion(): string {
        return this.duracion;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }

    public getIdTratamiento(): string {
        return this.idTratamiento;
    }

    public getIdMedicamento(): string {
        return this.idMedicamento;
    }

    // 🔸 Setters
    public setUid(value: string): void {
        this.uid = value;
    }

    public setCantidad(value: number): void {
        this.cantidad = value;
    }

    public setUnidad(value: number): void {
        this.unidad = value;
    }

    public setMedida(value: string): void {
        this.medida = value;
    }

    public setDuracion(value: string): void {
        this.duracion = value;
    }

    public setDescripcion(value: string): void {
        this.descripcion = value;
    }

    public setIdTratamiento(value: string): void {
        this.idTratamiento = value;
    }

    public setIdMedicamento(value: string): void {
        this.idMedicamento = value;
    }

    // 🔸 Método estático para reconstruir desde Firestore
    public static fromFirestore(uid: string, data: any): LineaTratamiento {
        return new LineaTratamiento(
            uid,
            data.cantidad,
            data.unidad,
            data.medida,
            data.duracion,
            data.descripcion,
            data.idTratamiento,
            data.idMedicamento
        );
    }

    // 🔸 Convertir a objeto Firestore
    public toFirestoreObject(): Record<string, any> {
        return {
            cantidad: this.getCantidad(),
            unidad: this.getUnidad(),
            medida: this.getMedida(),
            duracion: this.getDuracion(),
            descripcion: this.getDescripcion(),
            idTratamiento: this.getIdTratamiento(),
            idMedicamento: this.getIdMedicamento()
        };
    }

    // 🔸 Convertir a DTO para el frontend (todo como string)
    public toFrontDTO(): Record<string, string> {
        return {
            uid: String(this.getUid()),
            cantidad: String(this.getCantidad()),
            unidad: String(this.getUnidad()),
            medida: String(this.getMedida()),
            duracion: String(this.getDuracion()),
            descripcion: String(this.getDescripcion()),
            idTratamiento: String(this.getIdTratamiento()),
            idMedicamento: String(this.getIdMedicamento())
        };
    }
}
