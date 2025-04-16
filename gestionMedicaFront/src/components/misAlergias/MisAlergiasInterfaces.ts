export interface Alergia {
    titulo: string
    descripcion: string
    tipoAlergeno: TipoAlergeno,
    gradoSeveridad: GradoSeveridad,
    sintomas: string[];
}

export enum TipoAlergeno {
    ALIMENTOS = "Alimentos",
    FARMACOS = "Fármacos",
    AMBIENTALES = "Ambientales",
    ANIMALES = "Animales",
    INSECTOS = "Insectos",
    QUIMICOS = "Químicos",
    OTROS = "Otros / Desconocidos"
}

export enum GradoSeveridad {
    LEVE = "Leve",
    MODERADA = "Moderada",
    GRAVE = "Grave"
}

export interface AlergiaCardProps {
    alergia: Alergia
}

