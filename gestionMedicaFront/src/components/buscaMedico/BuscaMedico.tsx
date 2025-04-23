import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { arrowBackOutline, checkmarkOutline, close, listOutline } from "ionicons/icons";
import SideMenu from "../sideMenu/SideMenu";
import { IonBadge, IonButton, IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import React from "react";
import MainFooter from "../mainFooter/MainFooter";
import NotificationToast from "../notification/NotificationToast";
import './BuscaMedico.css'
import { useHistory } from "react-router-dom";
import MedicoCard from "../medicoCard/MedicoCard";
import Paginacion from "../paginacion/Paginacion";

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

    const medicosMock = [
        {
            nombreMedico: "Laura",
            apellidosMedico: "Gómez Ramírez",
            especialidad: { nombre: "Cardiología" },
            centro: { nombreCentro: "Clínica Santa Fe" }
        },
        {
            nombreMedico: "Carlos",
            apellidosMedico: "Martínez López",
            especialidad: { nombre: "Dermatología" },
            centro: { nombreCentro: "Hospital Central" }
        },
        {
            nombreMedico: "Sofía",
            apellidosMedico: "Pérez Torres",
            especialidad: null, // Especialidad no disponible
            centro: { nombreCentro: "Centro Médico del Sur" }
        },
        {
            nombreMedico: "Andrés",
            apellidosMedico: "Fernández Ruiz",
            especialidad: { nombre: "Neurología" },
            centro: null // Centro no disponible
        },
        {
            nombreMedico: "Laura",
            apellidosMedico: "Gómez Ramírez",
            especialidad: { nombre: "Cardiología" },
            centro: { nombreCentro: "Clínica Santa Fe" }
        },
        {
            nombreMedico: "Carlos",
            apellidosMedico: "Martínez López",
            especialidad: { nombre: "Dermatología" },
            centro: { nombreCentro: "Hospital Central" }
        },
        {
            nombreMedico: "Sofía",
            apellidosMedico: "Pérez Torres",
            especialidad: null, // Especialidad no disponible
            centro: { nombreCentro: "Centro Médico del Sur" }
        },
        {
            nombreMedico: "Andrés",
            apellidosMedico: "Fernández Ruiz",
            especialidad: { nombre: "Neurología" },
            centro: null // Centro no disponible
        },
        {
            nombreMedico: "Laura",
            apellidosMedico: "Gómez Ramírez",
            especialidad: { nombre: "Cardiología" },
            centro: { nombreCentro: "Clínica Santa Fe" }
        },
        {
            nombreMedico: "Carlos",
            apellidosMedico: "Martínez López",
            especialidad: { nombre: "Dermatología" },
            centro: { nombreCentro: "Hospital Central" }
        },
        {
            nombreMedico: "Sofía",
            apellidosMedico: "Pérez Torres",
            especialidad: null, // Especialidad no disponible
            centro: { nombreCentro: "Centro Médico del Sur" }
        },
        {
            nombreMedico: "Andrés",
            apellidosMedico: "Fernández Ruiz",
            especialidad: { nombre: "Neurología" },
            centro: null // Centro no disponible
        }
    ];

    const [paginaActual, setPaginaActual] = useState(1);
    const medicosPorPagina = 5;

    const totalPaginas = Math.ceil(medicosMock.length / medicosPorPagina);
    const medicosPaginados = medicosMock.slice(
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
                {!userData && !loading && (
                    <IonContent fullscreen className="contentSD">
                        <div className="contentCentralSD">
                            <div className="filtrosIntroducidos">
                                <div className="filtrosTittle">
                                    <IonButton shape="round" size="large" className="filtroButtonSD">
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
                                    {medicosMock.length > 0
                                        ? `${medicosMock.length} médico${medicosMock.length > 1 ? 's' : ''} encontrado${medicosMock.length > 1 ? 's' : ''}`
                                        : "No se han encontrado médicos con estos filtros"}
                                </h2>
                                <hr />
                            </div>
                            <div className="resultadosSD">
                                {medicosPaginados.map((medico, index) => (
                                    <MedicoCard
                                        key={(paginaActual - 1) * medicosPorPagina + index}
                                        nombre={medico.nombreMedico}
                                        apellidos={medico.apellidosMedico}
                                        especialidad={medico.especialidad?.nombre || "Especialidad no disponible"}
                                        centro={medico.centro?.nombreCentro || "Centro no disponible"}
                                    />
                                ))}

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
                {(loading || userData) &&
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
        </>
    );
}

export default BuscaMedico;