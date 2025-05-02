import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../context/UserContext";
import { alertCircleOutline, arrowBackOutline, checkmarkOutline, close, earthOutline, listOutline, removeCircleOutline, searchOutline, starOutline, trashOutline } from "ionicons/icons";
import SideMenu from "../sideMenu/SideMenu";
import { IonBadge, IonButton, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonSpinner } from "@ionic/react";
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




const BuscaMedico: React.FC = () => {

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

    const [soloFavoritos, setSoloFavoritos] = useState(searchParams.get("favoritos") === "true");

    const [soloRecientes, setsoloRecientes] = useState(searchParams.get("recientes") === "true");

    useEffect(() => {
        if (!soloFavoritos && !soloRecientes && location.search !== "") {
            history.replace("/search-doctor");
        }
    }, [soloFavoritos, soloRecientes, location.search]);

    useEffect(() => {
        let path = "/search-doctor";
        const params = new URLSearchParams();

        if (soloFavoritos) params.set("favoritos", "true");
        if (soloRecientes) params.set("recientes", "true");

        const newUrl = params.toString() ? `${path}?${params.toString()}` : path;

        // Solo actualiza si es diferente
        if (location.pathname + location.search !== newUrl) {
            history.replace(newUrl);
        }
    }, [soloFavoritos, soloRecientes]);

    const [filtrosAplicados, setFiltrosAplicados] = useState({
        provincia: "",
        especialidad: "",
        centro: "",
        nombre: ""
    });

    const [modalAbierto, setModalAbierto] = useState(false);

    const [mapa, setMapa] = useState<MapaProvincias>({});
    const [medicos, setMedicos] = useState<MedicoDTO[]>([]);
    const [centros, setCentros] = useState<CentroDTO[]>([]);
    const [especialidades, setEspecialidades] = useState<EspecialidadDTO[]>([]);
    const [provincias, setProvincias] = useState<ProvinciaMapa>({});


    const cargarDatos = async () => {
        try {
            setLoading(true);
            const data = await backendService.obtenerMapaFiltros();

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

    useEffect(() => {
        cargarDatos();

    }, []);


    const [paginaActual, setPaginaActual] = useState(1);
    const medicosPorPagina = 5;

    const medicosFiltrados = medicos.filter((medico) => {
        const { provincia, especialidad, centro, nombre } = filtrosAplicados;

        const cumpleProvincia = provincia === "" || (
            centros.find(c => c.uid === medico.idCentro)?.provincia === provincias[provincia]
        );

        const cumpleEspecialidad = especialidad === "" || medico.idEspecialidad === especialidad;
        const cumpleCentro = centro === "" || medico.idCentro === centro;
        const cumpleNombre = nombre === "" || medico.uid === nombre;
        let esFavorito = false;
        if (userData) {
            esFavorito = userData.medicosFavoritos.includes(medico.uid);
        }

        //const esReciente = userData?.medicosVistosRecientemente?.includes(medico.uid) || false;
        return (
            cumpleProvincia &&
            cumpleEspecialidad &&
            cumpleCentro &&
            cumpleNombre &&
            (!soloFavoritos || esFavorito)
            // &&(!soloRecientes || esReciente)
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
            }, 200); // Coincide con la duración del animation
        } else {
            setFiltrosAplicados(prev => ({ ...prev, [clave]: "" }));
        }
    };

    const obtenerNombreFiltro = (clave: string, valor: string): string => {

        switch (clave) {
            case "provincia":
                return provincias[valor] || valor;
            case "especialidad":
                const especialidad = especialidades.find((e) => e.uid === valor);
                return especialidad?.nombre || valor;
            case "centro":
                const centro = centros.find((c) => c.uid === valor);
                return centro?.nombreCentro || valor;
            case "nombre":
                const medico = medicos.find((c) => c.uid === valor);
                return medico?.nombreMedico + " " + medico?.apellidosMedico || valor;

            default:
                return valor; // Capitaliza si no está en la lista
        }
    }

    const obtenerNombreClave = (clave: string): string => {
        switch (clave) {
            case "provincia":
                return "Provincia";
            case "especialidad":
                return "Especialidad";
            case "centro":
                return "Centro";
            case "nombre":
                return "Nombre del Médico";
            default:
                return clave.charAt(0).toUpperCase() + clave.slice(1); // Capitaliza si no está en la lista
        }
    };

    const obtenerTituloBusqueda = () => {
        if (soloFavoritos) return "Médicos favoritos";
        if (soloRecientes) return "Médicos visitados recientemente";
        return "Búsqueda de especialistas";
    };

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
                                            <IonIcon icon={listOutline} slot={"icon-only"} size="large" />
                                        </IonButton>
                                        <span>Filtros de Búsqueda</span>
                                    </div>
                                    <IonButton
                                        className={soloFavoritos ? "buttonFiltroFav-on" : "buttonFiltroFav-off"}
                                        shape="round"
                                        size="default"
                                        onClick={() => setSoloFavoritos(prev => !prev)}
                                    >
                                        <IonIcon icon={soloFavoritos ? earthOutline : starOutline} slot="icon-only" />
                                        <span className="buttonTextFavButton">{soloFavoritos ? "Ver Todos" : "Solo Favoritos"}</span>
                                    </IonButton>
                                </div>
                                <div className="filtrosActuales">
                                    {Object.entries(filtrosAplicados).filter(([_, v]) => v !== "").length > 0 ? (
                                        Object.entries(filtrosAplicados)
                                            .filter(([_, valor]) => valor !== "") // ¡Filtra primero!
                                            .map(([clave, valor]) => (
                                                <IonBadge
                                                    id={`filtro-${clave}`}
                                                    key={clave}
                                                    className="badgeFiltro"
                                                >
                                                    {obtenerNombreClave(clave)}: {obtenerNombreFiltro(clave, valor)}
                                                    <IonIcon
                                                        icon={close}
                                                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                                                        onClick={() => handleEliminarFiltro(clave)}
                                                    />
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
                                    {medicos.length > 0
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
                                        return (
                                            <div className="medico-card-error">
                                                <p>⚠️ No se pudo mostrar este médico porque faltan datos de centro o especialidad.</p>
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
                {(loading || !userData) &&
                    <IonContent fullscreen className="contentSD">
                        <div className="contentCentralSDSpinner">
                            <div className="spinnerContainerSD">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerSD">Cargando su información. Un momento, por favor...</span>
                            </div>
                            {!loading &&
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
                            }
                        </div>
                    </IonContent>
                }
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
}

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

    useEffect(() => {
        setFiltrosLocales(filtrosAplicados);
    }, [filtrosAplicados]);

    const [loading, setLoading] = useState(false);
    const [filtrosLocales, setFiltrosLocales] = useState({
        provincia: "",
        especialidad: "",
        centro: "",
        nombre: ""
    });

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
                                items={provinciasDisponibles.map(id => ({
                                    value: id,
                                    label: provincias[id]
                                }))}
                                value={filtrosLocales.provincia}
                                onChange={(val) => handleChange("provincia", val)}
                            />

                            <SelectConBuscador
                                label="Especialidad"
                                placeholder="Selecciona una especialidad"
                                items={especialidadesDisponibles.map((e) => ({
                                    value: e.uid,
                                    label: e.nombre,
                                }))}
                                value={filtrosLocales.especialidad}
                                onChange={(val) => handleChange("especialidad", val)}
                            />

                            <SelectConBuscador
                                label="Centro"
                                placeholder="Selecciona un centro"
                                items={centrosDisponibles.map((e) => ({
                                    value: e.uid,
                                    label: e.nombreCentro,
                                }))}
                                value={filtrosLocales.centro}
                                onChange={(val) => handleChange("centro", val)}
                            />

                            <SelectConBuscador
                                label="Especialista"
                                placeholder="Selecciona un especialista"
                                items={medicosDisponibles.map((e) => ({
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