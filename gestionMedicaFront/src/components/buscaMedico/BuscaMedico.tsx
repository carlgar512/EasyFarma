import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../context/UserContext";
import { alertCircleOutline, arrowBackOutline, checkmarkOutline, close, earthOutline, listOutline, removeCircleOutline, searchOutline, starOutline, trashOutline } from "ionicons/icons";
import SideMenu from "../sideMenu/SideMenu";
import { IonBadge, IonButton, IonContent, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonSegment, IonSegmentButton, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import React from "react";
import MainFooter from "../mainFooter/MainFooter";
import NotificationToast from "../notification/NotificationToast";
import './BuscaMedico.css'
import { useHistory, useLocation } from "react-router-dom";
import MedicoCard from "../medicoCard/MedicoCard";
import Paginacion from "../paginacion/Paginacion";
import { MapaProvincias, ModalFiltrosProps, ProvinciaMapa } from "./BuscaMedicoInterfaces";
import { backendService } from "../../services/backendService";
import SelectConBuscador from "../selectConBuscador/SelectConBuscador";
import { CentroDTO, EspecialidadDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";



/**
 * Componente: BuscaMedico
 * 
 * Descripción:
 * Este componente representa la vista de búsqueda de médicos. Permite al usuario aplicar filtros 
 * como provincia, especialidad, centro o nombre del médico para refinar los resultados. 
 * También ofrece modos de visualización específicos como "favoritos" o "recientes".
 * 
 * Funcionalidades:
 * - Carga inicial de filtros disponibles desde el backend.
 * - Aplicación dinámica de filtros y segmentación de búsqueda.
 * - Actualización de la URL según el modo de filtro seleccionado.
 * - Paginación de resultados.
 * - Eliminación visual de filtros aplicados mediante animación.
 * - Visualización condicional del contenido: resultados o spinner de carga.
 * - Modal para configurar filtros.
 * 
 * Dependencias:
 * - backendService: para obtener datos médicos, filtros y recientes.
 * - Ion components de Ionic para la interfaz visual.
 * - Componentes personalizados: SideMenu, MainHeader, MainFooter, MedicoCard, ModalFiltros, NotificationToast.
 */
const BuscaMedico: React.FC = () => {

    /**
     * VARIABLES
     */
    const history = useHistory();
    const { userData } = useUser();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const initialFiltro = searchParams.get("favoritos") === "true"
        ? "favoritos"
        : searchParams.get("recientes") === "true"
            ? "recientes"
            : "todos";

    const [modoFiltro, setModoFiltro] = useState<"todos" | "favoritos" | "recientes">(initialFiltro);

    const [filtrosAplicados, setFiltrosAplicados] = useState({
        provincia: "",
        especialidad: "",
        centro: "",
        nombre: "",
    });

    const [modalAbierto, setModalAbierto] = useState(false);
    const [mapa, setMapa] = useState<MapaProvincias>({});
    const [medicos, setMedicos] = useState<MedicoDTO[]>([]);
    const [centros, setCentros] = useState<CentroDTO[]>([]);
    const [especialidades, setEspecialidades] = useState<EspecialidadDTO[]>([]);
    const [provincias, setProvincias] = useState<ProvinciaMapa>({});
    const [recientes, setIdMedicosRecientes] = useState<any[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);

    /**
     * FUNCIONALIDAD
     */

    useEffect(() => {
        const path = "/search-doctor";
        const params = new URLSearchParams();

        if (modoFiltro === "favoritos") params.set("favoritos", "true");
        if (modoFiltro === "recientes") params.set("recientes", "true");

        const newUrl = params.toString() ? `${path}?${params.toString()}` : path;

        if (location.pathname + location.search !== newUrl) {
            history.replace(newUrl);
        }
    }, [modoFiltro]);

    useEffect(() => {
        if (userData?.uid) {
            cargarDatos();
        }
    }, [userData?.uid]);

    const cargarDatos = async () => {
        if (!userData?.uid) return;

        try {
            setLoading(true);
            const data = await backendService.obtenerMapaFiltros();
            const dataRecientes = await backendService.obtenerMedicosRecientes(userData.uid);

            setIdMedicosRecientes(dataRecientes);
            setMapa(data.mapa);
            setMedicos(data.medicos);
            setCentros(data.centros);
            setEspecialidades(data.especialidades);
            setProvincias(data.provincias);
            setToast({
                show: true,
                message: "Filtros cargados correctamente",
                color: "success",
                icon: checkmarkOutline,
            });
        } catch (err: any) {
            setToast({
                show: true,
                message: err.message || "Error inesperado al cargar los filtros",
                color: "danger",
                icon: alertCircleOutline,
            });
        } finally {
            setLoading(false);
        }
    };

    //PAGINACION
    const medicosPorPagina = 5;

    const soloFavoritos = modoFiltro === "favoritos";
    const soloRecientes = modoFiltro === "recientes";

    const medicosFiltrados = medicos.filter((medico) => {
        const { provincia, especialidad, centro, nombre } = filtrosAplicados;

        const cumpleProvincia = provincia === "" || (
            centros.find(c => c.uid === medico.idCentro)?.provincia === provincias[provincia]
        );

        const cumpleEspecialidad = especialidad === "" || medico.idEspecialidad === especialidad;
        const cumpleCentro = centro === "" || medico.idCentro === centro;
        const cumpleNombre = nombre === "" || medico.uid === nombre;
        const esFavorito = userData?.medicosFavoritos.includes(medico.uid) || false;
        const esReciente = recientes.includes(medico.uid);

        return (
            cumpleProvincia &&
            cumpleEspecialidad &&
            cumpleCentro &&
            cumpleNombre &&
            (!soloFavoritos || esFavorito) &&
            (!soloRecientes || esReciente)
        );
    });

    const totalPaginas = Math.ceil(medicosFiltrados.length / medicosPorPagina);
    const medicosPaginados = medicosFiltrados.slice(
        (paginaActual - 1) * medicosPorPagina,
        paginaActual * medicosPorPagina
    );

    const handleVolver = () => {
        history.replace("/principal");
    };

    const handleEliminarFiltro = (clave) => {
        const badge = document.getElementById(`filtro-${clave}`);
        if (badge) {
            badge.classList.add("fade-out");
            setTimeout(() => {
                setFiltrosAplicados(prev => ({ ...prev, [clave]: "" }));
            }, 200);
        } else {
            setFiltrosAplicados(prev => ({ ...prev, [clave]: "" }));
        }
    };

    const obtenerNombreFiltro = (clave: string, valor: string): string => {
        switch (clave) {
            case "provincia": return provincias[valor] || valor;
            case "especialidad": return especialidades.find((e) => e.uid === valor)?.nombre || valor;
            case "centro": return centros.find((c) => c.uid === valor)?.nombreCentro || valor;
            case "nombre":
                const medico = medicos.find((c) => c.uid === valor);
                return medico?.nombreMedico + " " + medico?.apellidosMedico || valor;
            default: return valor;
        }
    };

    const obtenerNombreClave = (clave: string): string => {
        switch (clave) {
            case "provincia": return "Provincia";
            case "especialidad": return "Especialidad";
            case "centro": return "Centro";
            case "nombre": return "Nombre del Médico";
            default: return clave.charAt(0).toUpperCase() + clave.slice(1);
        }
    };

    const obtenerTituloBusqueda = () => {
        if (modoFiltro === "favoritos") return "Médicos favoritos";
        if (modoFiltro === "recientes") return "Médicos recientes";
        return "Búsqueda de especialistas";
    };

    /**
     * RENDER
     */
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle={obtenerTituloBusqueda()} />
                {userData && !loading && (
                    <IonContent fullscreen className="contentSD">
                        <div className="contentCentralSD">
                            <div className="filtrosIntroducidos">
                                <div className="filtrosTittle">
                                    <div className="filtrosTittleContent">
                                        <IonButton shape="round" size="large" className="filtroButtonSD" onClick={() => setModalAbierto(true)}>
                                            <IonIcon icon={listOutline} slot="icon-only" size="large" />
                                        </IonButton>
                                        <span>Filtros de Búsqueda</span>
                                    </div>
                                    <IonSegment
                                        color={"success"}
                                        value={modoFiltro}
                                        onIonChange={(e) => setModoFiltro(e.detail.value as "todos" | "favoritos" | "recientes")}
                                        className="segmentFiltro"
                                    >
                                        <IonSegmentButton value="todos">
                                            <IonLabel>Ver Todos</IonLabel>
                                        </IonSegmentButton>
                                        <IonSegmentButton value="favoritos">
                                            <IonLabel>Favoritos</IonLabel>
                                        </IonSegmentButton>
                                        <IonSegmentButton value="recientes">
                                            <IonLabel>Recientes</IonLabel>
                                        </IonSegmentButton>
                                    </IonSegment>
                                </div>
                                <div className="filtrosActuales">
                                    {Object.entries(filtrosAplicados).some(([_, v]) => v !== "") ? (
                                        Object.entries(filtrosAplicados)
                                            .filter(([_, valor]) => valor !== "")
                                            .map(([clave, valor]) => (
                                                <IonBadge id={`filtro-${clave}`} key={clave} className="badgeFiltro">
                                                    {obtenerNombreClave(clave)}: {obtenerNombreFiltro(clave, valor)}
                                                    <IonIcon icon={close} style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={() => handleEliminarFiltro(clave)} />
                                                </IonBadge>
                                            ))
                                    ) : (
                                        <p className="sinFiltros">No se han aplicado filtros</p>
                                    )}
                                </div>
                            </div>
                            <div className="resultadosHeader">
                                <hr />
                                <h2>
                                    {medicosFiltrados.length > 0
                                        ? `${medicosFiltrados.length} médico${medicosFiltrados.length > 1 ? 's' : ''} encontrado${medicosFiltrados.length > 1 ? 's' : ''}`
                                        : "No se han encontrado médicos con estos filtros"}
                                </h2>
                                <hr />
                            </div>
                            <div className="resultadosSD">
                                {medicosPaginados.map((medico, index) => {
                                    const especialidad = especialidades.find(e => e.uid === medico.idEspecialidad);
                                    const centro = centros.find(e => e.uid === medico.idCentro);
                                    if (!especialidad || !centro) {
                                        console.log(medico.uid);
                                        return (
                                            <div className="medico-card-error" key={index}>
                                                <p>No se pudo mostrar este médico porque faltan datos de centro o especialidad.</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <MedicoCard
                                            key={(paginaActual - 1) * medicosPorPagina + index}
                                            medico={medico}
                                            especialidad={especialidad}
                                            centro={centro}
                                            provincia={centro?.provincia || "Provincia no disponible"}
                                        />
                                    );
                                })}

                                {totalPaginas > 1 && (
                                    <Paginacion
                                        paginaActual={paginaActual}
                                        totalPaginas={totalPaginas}
                                        onPageChange={setPaginaActual}
                                    />
                                )}
                            </div>
                            <div className="buttonContainerSD">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonVolverSD"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextSD">Volver</span>
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                )}
                {(loading || !userData) && (
                    <IonContent fullscreen className="contentSD">
                        <div className="contentCentralSDSpinner">
                            <div className="spinnerContainerSD">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerSD">Cargando su información. Un momento, por favor...</span>
                            </div>
                            {!loading && (
                                <div className="buttonContainerSD">
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="buttonVolverSD"
                                        onClick={handleVolver}
                                    >
                                        <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                        <span className="buttonTextSD">Volver</span>
                                    </IonButton>
                                </div>
                            )}
                        </div>
                    </IonContent>
                )}
                <MainFooter />
            </IonPage>
            <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
            <ModalFiltros
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onAplicarFiltros={(filtros) => {
                    setFiltrosAplicados(filtros);
                    setPaginaActual(1);
                }}
                provincias={provincias}
                especialidades={especialidades}
                centros={centros}
                mapaFiltros={mapa}
                medicos={medicos}
                filtrosAplicados={filtrosAplicados}
            />
        </>
    );
};

/**
 * Componente: ModalFiltros
 * 
 * Descripción:
 * Modal utilizado para aplicar filtros en la búsqueda de médicos. Permite seleccionar 
 * provincia, especialidad, centro y nombre del especialista a través de componentes de selección.
 * Los filtros se ajustan dinámicamente en función de las opciones ya seleccionadas.
 * 
 * Funcionalidades:
 * - Inicializa los filtros con los valores actuales aplicados.
 * - Filtra dinámicamente las opciones de provincia, centro y especialidad basándose en la selección del usuario.
 * - Permite buscar y aplicar los filtros, o bien descartarlos.
 * - Incluye un estado de carga simulado al aplicar los filtros.
 * 
 * Props:
 * - `isOpen`: controla la visibilidad del modal.
 * - `onClose`: función de cierre del modal.
 * - `onAplicarFiltros`: callback para aplicar los filtros seleccionados.
 * - `provincias`, `especialidades`, `centros`: datos disponibles para la selección.
 * - `mapaFiltros`: estructura jerárquica que relaciona provincias, centros y especialidades.
 * - `medicos`: listado de médicos utilizados para filtrar por nombre.
 * - `filtrosAplicados`: valores actuales de los filtros ya aplicados.
 */
const ModalFiltros: React.FC<ModalFiltrosProps> = ({
    isOpen,
    onClose,
    onAplicarFiltros,
    provincias,
    especialidades,
    centros,
    mapaFiltros,
    medicos,
    filtrosAplicados
}) => {

    /**
     * VARIABLES
     */

    const [loading, setLoading] = useState(false);
    const [filtrosLocales, setFiltrosLocales] = useState({
        provincia: "",
        especialidad: "",
        centro: "",
        nombre: ""
    });

    /**
     * FUNCIONALIDAD
     */
    useEffect(() => {
        setFiltrosLocales(filtrosAplicados);
    }, [filtrosAplicados]);

    const provinciasDisponibles = useMemo(() => {
        if (filtrosLocales.especialidad) {
            // Solo provincias con esa especialidad
            const provincias = new Set<string>();
            Object.entries(mapaFiltros).forEach(([provId, provData]) => {
                Object.values(provData.centros).forEach((centro: any) => {
                    if (centro.especialidades?.[filtrosLocales.especialidad]) {
                        provincias.add(provId);
                    }
                });
            });
            return Array.from(provincias);
        }
        return Object.keys(mapaFiltros);
    }, [filtrosLocales.especialidad, mapaFiltros]);

    const centrosDisponibles = useMemo(() => {
        const ids = new Set<string>();

        if (filtrosLocales.provincia && mapaFiltros[filtrosLocales.provincia]) {
            Object.entries(mapaFiltros[filtrosLocales.provincia].centros).forEach(([centroId, centroData]: any) => {
                if (!filtrosLocales.especialidad || centroData.especialidades?.[filtrosLocales.especialidad]) {
                    ids.add(centroId);
                }
            });
        } else if (filtrosLocales.especialidad) {
            Object.values(mapaFiltros).forEach((provData: any) => {
                Object.entries(provData.centros).forEach(([centroId, centroData]: any) => {
                    if (centroData.especialidades?.[filtrosLocales.especialidad]) {
                        ids.add(centroId);
                    }
                });
            });
        } else {
            Object.values(mapaFiltros).forEach((provData: any) => {
                Object.keys(provData.centros).forEach((centroId) => ids.add(centroId));
            });
        }

        return centros.filter(c => ids.has(c.uid));
    }, [filtrosLocales.provincia, filtrosLocales.especialidad, centros, mapaFiltros]);

    const especialidadesDisponibles = useMemo(() => {
        const ids = new Set<string>();

        if (filtrosLocales.provincia && mapaFiltros[filtrosLocales.provincia]) {
            Object.values(mapaFiltros[filtrosLocales.provincia].centros).forEach((centro: any) => {
                Object.keys(centro.especialidades).forEach((espId) => {
                    ids.add(espId);
                });
            });
        } else if (filtrosLocales.centro) {
            centros.forEach((c) => {
                if (c.uid === filtrosLocales.centro) {
                    const prov = Object.entries(mapaFiltros).find(([_, d]) => d.centros[filtrosLocales.centro]);
                    if (prov) {
                        const centroData = prov[1].centros[filtrosLocales.centro];
                        Object.keys(centroData.especialidades).forEach((espId) => {
                            ids.add(espId);
                        });
                    }
                }
            });
        } else {
            Object.values(mapaFiltros).forEach((provData: any) => {
                Object.values(provData.centros).forEach((centro: any) => {
                    Object.keys(centro.especialidades).forEach((espId) => ids.add(espId));
                });
            });
        }

        return especialidades.filter(e => ids.has(e.uid));
    }, [filtrosLocales.provincia, filtrosLocales.centro, especialidades, mapaFiltros]);

    const medicosDisponibles = useMemo(() => {
        return medicos.filter(m => {
            const cumpleProvincia = !filtrosLocales.provincia || (
                centros.find(c => c.uid === m.idCentro)?.provincia &&
                Object.keys(mapaFiltros[filtrosLocales.provincia]?.centros || {}).includes(m.idCentro)
            );
            const cumpleCentro = !filtrosLocales.centro || m.idCentro === filtrosLocales.centro;
            const cumpleEspecialidad = !filtrosLocales.especialidad || m.idEspecialidad === filtrosLocales.especialidad;
            return cumpleProvincia && cumpleCentro && cumpleEspecialidad;
        });
    }, [filtrosLocales, medicos, centros, mapaFiltros]);

    const handleChange = (key, value) => {
        setFiltrosLocales(prev => {
            if (key === "centro") {
                const provId = Object.entries(mapaFiltros).find(([_, data]) =>
                    Object.keys(data.centros).includes(value)
                )?.[0];

                return {
                    ...prev,
                    centro: value,
                    provincia: provId ?? prev.provincia
                };
            }

            return { ...prev, [key]: value };
        });
    };

    const handleBuscar = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simula búsqueda
        onAplicarFiltros(filtrosLocales);
        setLoading(false);
        onClose();
    };

    const handleDescartarFiltros = () => {
        setFiltrosLocales({
            provincia: "",
            especialidad: "",
            centro: "",
            nombre: ""
        });
    };

    /**
     * RENDER
     */
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <div className="headerContent">
                    <IonIcon icon={listOutline} size="large" slot="icon-only" />
                    <span className="modalFiltTitle">Filtros de Búsqueda</span>
                </div>
            </IonHeader>

            <IonContent className="ion-padding modalFiltrosContent">

                {loading ? (
                    <div className="modalSpinnerContainer">
                        <IonSpinner className="spinner" name="circular" />
                        <span className="spinnerTextModal">Procesando su búsqueda de especialistas según los filtros seleccionados. Un momento, por favor...</span>
                    </div>
                ) : (
                    <div className="filtrosContainerGrid">
                        <div className="filtrosContainer">


                            {/* Provincia */}
                            <SelectConBuscador
                                label="Provincia"
                                placeholder="Selecciona una provincia"
                                items={provinciasDisponibles
                                    .sort((a, b) => provincias[a].localeCompare(provincias[b], 'es', { sensitivity: 'base' }))
                                    .map(id => ({
                                        value: id,
                                        label: provincias[id]
                                    }))}
                                value={filtrosLocales.provincia}
                                onChange={(val) => handleChange("provincia", val)}
                            />

                            <SelectConBuscador
                                label="Especialidad"
                                placeholder="Selecciona una especialidad"
                                items={especialidadesDisponibles
                                    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }))
                                    .map((e) => ({
                                        value: e.uid,
                                        label: e.nombre,
                                    }))}
                                value={filtrosLocales.especialidad}
                                onChange={(val) => handleChange("especialidad", val)}
                            />

                            <SelectConBuscador
                                label="Centro"
                                placeholder="Selecciona un centro"
                                items={centrosDisponibles
                                    .sort((a, b) => a.nombreCentro.localeCompare(b.nombreCentro, 'es', { sensitivity: 'base' }))
                                    .map((e) => ({
                                        value: e.uid,
                                        label: e.nombreCentro,
                                    }))}
                                value={filtrosLocales.centro}
                                onChange={(val) => handleChange("centro", val)}
                            />

                            <SelectConBuscador
                                label="Especialista"
                                placeholder="Selecciona un especialista"
                                items={medicosDisponibles
                                    .sort((a, b) =>
                                        (a.nombreMedico + ' ' + a.apellidosMedico).localeCompare(
                                            b.nombreMedico + ' ' + b.apellidosMedico,
                                            'es',
                                            { sensitivity: 'base' }
                                        )
                                    )
                                    .map((e) => ({
                                        value: e.uid,
                                        label: e.nombreMedico + " " + e.apellidosMedico,
                                    }))}
                                value={filtrosLocales.nombre}
                                onChange={(val) => handleChange("nombre", val)}
                            />

                        </div>

                        {/* Botones */}
                        <div className="modalBotones">
                            <IonButton expand="block" shape="round" className="buttonBuscar" onClick={handleBuscar}>
                                <IonIcon icon={searchOutline} size="large" slot="icon-only" />
                                <span className="buttonModalText">
                                    Aplicar filtros
                                </span>
                            </IonButton>
                            <IonButton expand="block" shape="round" className="buttonVaciar" color={"medium"} onClick={handleDescartarFiltros}>
                                <IonIcon icon={removeCircleOutline} size="large" slot="icon-only" />
                                <span className="buttonModalText">
                                    Vaciar Filtros
                                </span>
                            </IonButton>
                            <IonButton expand="block" shape="round" className="buttonDescartar" onClick={onClose}>
                                <IonIcon icon={trashOutline} size="large" slot="icon-only" />
                                <span className="buttonModalText">
                                    Descartar
                                </span>
                            </IonButton>

                        </div>
                    </div>
                )}
            </IonContent>
        </IonModal>
    );
};


export default BuscaMedico;