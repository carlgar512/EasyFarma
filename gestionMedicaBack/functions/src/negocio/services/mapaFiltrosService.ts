import { getAllCentrosFromFirestore } from "../../persistencia/repositorios/centroDAO";
import { getAllEspecialidadesFromFirestore } from "../../persistencia/repositorios/especialidadDAO";
import { getAllMedicosFromFirestore } from "../../persistencia/repositorios/medicoDAO";
import { Centro } from "../modelos/Centro";
import { mapaProvincias } from "../modelos/data/provincias";
import { Especialidad } from "../modelos/Especialidad";
import { Medico } from "../modelos/Medico";


export class MapaFiltrosService {
    public static async construirMapa(): Promise<{
        mapa: Record<string, any>,
        medicos: any[],
        centros: any[],
        especialidades: any[],
        provincias: any
    }> {
        // 🔸 Obtener los snapshots de Firestore
        const [medicosSnap, centrosSnap, especialidadesSnap] = await Promise.all([
            getAllMedicosFromFirestore(),
            getAllCentrosFromFirestore(),
            getAllEspecialidadesFromFirestore()
        ]);

        // 🔸 Convertir a instancias de modelo con fromFirestore
        const medicos: Medico[] = medicosSnap.map(doc =>
            Medico.fromFirestore(doc.id, doc)
        );

        const centros: Centro[] = centrosSnap.map(doc =>
            Centro.fromFirestore(doc.id, doc)
        );

        const especialidades: Especialidad[] = especialidadesSnap.map(doc =>
            Especialidad.fromFirestore(doc.id, doc)
        );

        const mapa: Record<string, any> = {};
        const centrosMap = new Map(centros.map(c => [c.getUid(), c]));

        for (const medico of medicos) {
            const centroId = medico.getIdCentro();
            const especialidadId = medico.getIdEspecialidad();
            const centro = centrosMap.get(centroId);

            if (!centro) continue;

            const provincia = centro.getProvincia();
            if (!provincia) continue;

            if (!mapa[provincia]) {
                mapa[provincia] = { centros: {} };
            }

            if (!mapa[provincia].centros[centroId]) {
                mapa[provincia].centros[centroId] = { especialidades: {} };
            }

            if (!mapa[provincia].centros[centroId].especialidades[especialidadId]) {
                mapa[provincia].centros[centroId].especialidades[especialidadId] = {
                    medicos: []
                };
            }

            mapa[provincia].centros[centroId].especialidades[especialidadId].medicos.push(medico.getUid());
        }
        return {
            mapa,
            medicos: medicos.map(m => m.toFrontDTO()),
            centros: centros.map(c => c.toFrontDTO()),
            especialidades: especialidades.map(e => e.toFrontDTO()),
            provincias: mapaProvincias
        };
    }
}

