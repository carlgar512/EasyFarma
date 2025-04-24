import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import { alertCircleOutline, arrowBackOutline, checkmarkOutline, close, listOutline, removeCircleOutline, searchOutline, trashOutline } from "ionicons/icons";
import SideMenu from "../sideMenu/SideMenu";
import { IonBadge, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonSearchbar, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import React from "react";
import MainFooter from "../mainFooter/MainFooter";
import NotificationToast from "../notification/NotificationToast";
import './BuscaMedico.css'
import { useHistory } from "react-router-dom";
import MedicoCard from "../medicoCard/MedicoCard";
import Paginacion from "../paginacion/Paginacion";
import { CentroDTO, EspecialidadDTO, MapaProvincias, MedicoDTO, ModalFiltrosProps, ProvinciaMapa } from "./BuscaMedicoInterfaces";
import { backendService } from "../../services/backendService";
import SelectConBuscador from "../selectConBuscador/SelectConBuscador";

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

    const [filtrosAplicados, setFiltrosAplicados] = useState({
        provincia: "EY",
        especialidad: "jose",
        centro: "pepe",
        nombre: "luis"
    });

    const [modalAbierto, setModalAbierto] = useState(false);

    const [mapa, setMapa] = useState<MapaProvincias>({});
    const [medicos, setMedicos] = useState<MedicoDTO[]>([]);
    const [centros, setCentros] = useState<CentroDTO[]>([]);
    const [especialidades, setEspecialidades] = useState<EspecialidadDTO[]>([]);
    const [provincias, setProvincias] = useState<ProvinciaMapa>({});


    useEffect(() => {
        const cargarDatos = async () => {
            try {
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

        cargarDatos();
    }, []);

    const [paginaActual, setPaginaActual] = useState(1);
    const medicosPorPagina = 5;

    const totalPaginas = Math.ceil(medicos.length / medicosPorPagina);
    const medicosPaginados = medicos.slice(
        (paginaActual - 1) * medicosPorPagina,
        paginaActual * medicosPorPagina
    );


    const handleVolver = () => {
        history.replace("/principal");
    };

    const aplicarFiltro = (clave, valor) => {
        setFiltrosAplicados(prev => ({ ...prev, [clave]: valor }));
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

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Búsqueda de Especialistas" />
                {userData && !loading && (
                    <IonContent fullscreen className="contentSD">
                        <div className="contentCentralSD">
                            <div className="filtrosIntroducidos">
                                <div className="filtrosTittle">
                                    <IonButton shape="round" size="large" className="filtroButtonSD" onClick={() => setModalAbierto(true)}>
                                        <IonIcon icon={listOutline} slot={"icon-only"} size="large" />
                                    </IonButton>
                                    <span>Filtros de Búsqueda</span>
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
                                                    {clave}: {valor}
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
                                        ? `${medicos.length} médico${medicos.length > 1 ? 's' : ''} encontrado${medicos.length > 1 ? 's' : ''}`
                                        : "No se han encontrado médicos con estos filtros"}
                                </h2>
                                <hr />
                            </div>
                            <div className="resultadosSD">
                                {medicosPaginados.map((medico, index) => {
                                    const especialidadNombre = especialidades.find(e => e.uid === medico.idEspecialidad)?.nombre || "Especialidad no disponible";
                                    const centro = centros.find(e => e.uid === medico.idCentro);

                                    return (
                                        <MedicoCard
                                            key={(paginaActual - 1) * medicosPorPagina + index}
                                            nombre={medico.nombreMedico}
                                            apellidos={medico.apellidosMedico}
                                            especialidad={especialidadNombre}
                                            centro={centro?.nombreCentro || "Centro no disponible"}
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
                    console.log("Filtros aplicados:", filtros);
                }}
                provincias={provincias}
                especialidades={especialidades}
                centros={centros}
                mapaFiltros={mapa}
                medicos={medicos}
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
    medicos
}) => {

    const [busquedaProvincia, setBusquedaProvincia] = useState("");
    const [busquedaEspecialidad, setBusquedaEspecialidad] = useState("");
    const [busquedaCentro, setBusquedaCentro] = useState("");
    const [loading, setLoading] = useState(false);
    const [filtrosLocales, setFiltrosLocales] = useState({
        provincia: "",
        especialidad: "",
        centro: "",
        nombre: ""
    });

    const handleChange = (key, value) => {
        setFiltrosLocales(prev => ({ ...prev, [key]: value }));
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
    const [busqueda, setBusqueda] = useState("");

    const quitarAcentos = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();


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
                    <div className="filtrosContainer">
                        {/* Provincia */}
                        <SelectConBuscador
                            label="Provincia"
                            placeholder="Selecciona una provincia"
                            items={Object.entries(provincias).map(([id, nombre]) => ({
                                value: nombre,
                                label: nombre,
                            }))}
                            value={filtrosLocales.provincia}
                            onChange={(val) => handleChange("provincia", val)}
                        />

                        {/* Especialidad */}
                        <SelectConBuscador
                            label="Especialidad"
                            placeholder="Selecciona una especialidad"
                            items={especialidades.map((e) => ({
                                value: e.nombre,
                                label: e.nombre,
                            }))}
                            value={filtrosLocales.especialidad}
                            onChange={(val) => handleChange("especialidad", val)}
                        />


                        {/* Centro */}
                         <SelectConBuscador
                            label="Centro"
                            placeholder="Selecciona un centro"
                            items={centros.map((e) => ({
                                value: e.nombreCentro,
                                label: e.nombreCentro,
                            }))}
                            value={filtrosLocales.centro}
                            onChange={(val) => handleChange("centro", val)}
                        />


                        {/* Nombre */}
                        <SelectConBuscador
                            label="Especialista"
                            placeholder="Selecciona un especialista"
                            items={medicos.map((e) => ({
                                value: e.nombreMedico + " " + e.apellidosMedico,
                                label: e.nombreMedico + " " + e.apellidosMedico,
                            }))}
                            value={filtrosLocales.nombre}
                            onChange={(val) => handleChange("nombre", val)}
                        />


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