import React, { useEffect, useState } from "react";
import { DetalleTratamientoProps, LineaConMedicamento, MedicoCompletoDTO, TratamientoDTO } from "./DetalleTratamientoInterfaces";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import MainFooter from "../mainFooter/MainFooter";
import MainHeader from "../mainHeader/MainHeader";
import SideMenu from "../sideMenu/SideMenu";
import './DetalleTratamiento.css'
import { alertCircleOutline, archiveOutline, arrowBack, arrowBackOutline, calendarNumberOutline, calendarOutline, checkmarkOutline, cubeOutline, documentTextOutline, folderOpenOutline, medkitOutline, printOutline, stopwatchOutline } from "ionicons/icons";
import { backendService } from "../../services/backendService";
import NotificationToast from "../notification/NotificationToast";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { useUser } from "../../context/UserContext";
import MedicoCard from "../medicoCard/MedicoCard";



/**
 * Componente `DetalleTratamientoWrapper`
 * 
 * Actúa como contenedor de enrutamiento para el componente `DetalleTratamiento`.
 * Extrae el objeto `tratamiento` desde el estado de navegación (history.state)
 * y lo pasa como prop al componente de detalle.
 * 
 * Esto permite mantener la navegación limpia y desacoplar la lógica de obtención del tratamiento
 * del propio componente de detalle.
 */
const DetalleTratamientoWrapper: React.FC = () => {
    /**
     * VARIABLES
     */
    const location = useLocation<{ tratamiento }>();
    const tratamiento = location.state?.tratamiento;

    /**
     * RENDER
     */
    return <DetalleTratamiento tratamiento={tratamiento} />;
};

/**
 * Componente `DetalleTratamiento`
 *
 * Este componente muestra la información detallada de un tratamiento médico específico.
 * Incluye:
 *  - Información general del tratamiento (estado, fechas, descripción)
 *  - Médico asociado y detalles del centro
 *  - Líneas del tratamiento (medicamentos, dosis, frecuencia, duración, etc.)
 *  - Opciones para archivar/restaurar el tratamiento
 *  - Funcionalidad para exportar el tratamiento como PDF cifrado
 *
 * El componente realiza una llamada al backend para obtener toda la información completa
 * y permite gestionar acciones como archivado y exportación con confirmación previa.
 */
const DetalleTratamiento: React.FC<DetalleTratamientoProps> = ({ tratamiento }) => {

    /**
     * VARIABLES
     */
    const history = useHistory();
    const { userData } = useUser();
    const [tratamientoCompleto, setTratamiento] = useState<TratamientoDTO | null>(null);
    const [lineas, setLineas] = useState<LineaConMedicamento[]>([]);
    const [medico, setMedico] = useState<MedicoCompletoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        tittle: "",
        message: "",
        img: "",
        onConfirm: () => { },
    });

    /**
     * FUNCIONALIDAD
     */
    useEffect(() => {
        const fetchTratamientoCompleto = async () => {
            try {
                setLoading(true);

                const data = await backendService.getTratamientoCompleto(tratamiento.uid);

                if (data.success) {
                    setTratamiento(data.tratamientoCompleto.tratamiento);
                    setLineas(data.tratamientoCompleto.lineas);
                    setMedico(data.tratamientoCompleto.medico);
                }

            } catch (err: any) {
                setToast(
                    {
                        show: true,
                        message: "Error al encontrar el detalle de este tratamiento.",
                        color: "danger",
                        icon: alertCircleOutline,
                    }
                );
            } finally {
                setLoading(false);
            }
        };

        if (tratamiento.uid) {
            fetchTratamientoCompleto();
        }
    }, [reloadTrigger]);

    const cerrarDialogo = () => {
        setDialogState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    };

    const handleArchive = async () => {
        try {
            cerrarDialogo();

            await backendService.updateArchivadoTratamiento(tratamiento.uid, true);
            setToast({
                show: true,
                message: "El tratamiento se ha archivado correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });
            setTimeout(() => {
                setReloadTrigger(prev => prev + 1); // 🔁 esto vuelve a ejecutar el useEffect
            }, 500);

        } catch (error) {
            setToast({
                show: true,
                message: "Error al archivar tratamiento: " + error,
                color: "danger",
                icon: alertCircleOutline,
            });
            cerrarDialogo();

        }
    };

    const handleUnArchive = async () => {
        try {
            cerrarDialogo();

            await backendService.updateArchivadoTratamiento(tratamiento.uid, false);
            setToast({
                show: true,
                message: "Tratamiento devuelto al historial completo.",
                color: "success",
                icon: checkmarkOutline,
            });
            setTimeout(() => {
                setReloadTrigger(prev => prev + 1); // 🔁 esto vuelve a ejecutar el useEffect
            }, 500);

        } catch (error) {
            setToast({
                show: true,
                message: "Error al devolver el tratamiento al historial completo: " + error,
                color: "danger",
                icon: alertCircleOutline,
            });
            cerrarDialogo();

        }
    };

    const solicitarConfirmacionArchivado = () => {
        setDialogState({
            isOpen: true,
            tittle: "¿Archivar tratamiento?",
            message: "Este tratamiento pasará al historial de archivados. Podrás recuperarlo más adelante si lo necesitas.",
            img: "archivar.svg",
            onConfirm: () => handleArchive(),
        });
    };

    const solicitarConfirmacionDesArchivado = () => {
        setDialogState({
            isOpen: true,
            tittle: "¿Restaurar tratamiento?",
            message: "Este tratamiento volverá al historial completo. Se mostrará junto a los demás tratamientos finalizados.",
            img: "desarchivar.svg",
            onConfirm: () => handleUnArchive(),
        });
    };

    const handleVolver = () => {
        history.goBack()
    };

    const handleGeneraPDFConfirmacion = () => {
        setDialogState({
            isOpen: true,
            tittle: "¿Generar PDF cifrado del tratamiento?",
            message: "Se generará un archivo PDF cifrado con los datos del tratamiento y será enviado al correo electrónico registrado en su cuenta. Solo podrá acceder al archivo utilizando su DNI como contraseña.",
            img: "createPDF.svg",
            onConfirm: () => handleGeneraPDF(),
        });
    }

    const handleGeneraPDF = async () => {
        try {
            if (userData && tratamiento) {
                cerrarDialogo();
                setLoading(true);
                const response = await backendService.generarPdfCifradoTratamiento(userData?.dni, tratamiento.uid);
                if (response.success) {
                    setToast({
                        show: true,
                        message: "Tratamiento exportado a formato PDF y enviado correctamente.",
                        color: "success",
                        icon: checkmarkOutline,
                    });
                }
                else {
                    setToast({
                        show: true,
                        message: "Error al exportar el tratamiento a formato PDF.",
                        color: "danger",
                        icon: alertCircleOutline,
                    });
                }
                setLoading(false);
            }
        } catch (error: any) {
            setToast({
                show: true,
                message: "Error generarl el PDF sobre el tratamiento.",
                color: "danger",
                icon: alertCircleOutline,
            });
            cerrarDialogo();
            setLoading(false);
        }
    }

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle={"Detalle de tratamiento"} />
                {!loading && tratamientoCompleto && userData ? (
                    <IonContent fullscreen className="ion-padding contentDetalleTratamiento">
                        <div className="contenedorDeTratamiento">
                            <div className="cabeceraDT">
                                <span className="tituloDT">
                                    Tratamiento
                                </span>
                                {!tratamientoCompleto.estado && !tratamientoCompleto.archivado && (
                                    <IonButton
                                        shape="round"
                                        size="large"
                                        className="archiveButtonDT"
                                        onClick={() => solicitarConfirmacionArchivado()}
                                    >
                                        <IonIcon icon={archiveOutline} slot="icon-only" size="large" />
                                    </IonButton>
                                )}

                                {tratamientoCompleto.archivado && (
                                    <IonButton
                                        shape="round"
                                        size="large"
                                        className="archiveButtonDT"
                                        onClick={() => solicitarConfirmacionDesArchivado()}
                                    >
                                        <IonIcon icon={folderOpenOutline} slot="icon-only" size="large" />
                                    </IonButton>
                                )}
                            </div>
                            <div className="descyFechDT">
                                <div className="descyFechTop">
                                    <span className="detalleContainerText">Detalle</span>
                                    <div
                                        className={`badgeEstado ${tratamientoCompleto.estado ? "activo" : "finalizado"}`}
                                    >
                                        <span>
                                            {tratamientoCompleto.estado ? "Activo" : "Finalizado"}
                                        </span>
                                    </div>

                                    {tratamientoCompleto.archivado && (
                                        <div className="badgeEstado archivado">
                                            <span>Archivado</span>
                                        </div>
                                    )}
                                </div>
                                <hr className="lineaSep" />

                                <div className="fechasContainerDT">
                                    <div className="fechaContentCont">
                                        <IonIcon icon={calendarNumberOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Inicio: ${tratamientoCompleto.fechaInicio}`}</span>
                                    </div>
                                    {
                                        !tratamientoCompleto.estado &&
                                        <div className="fechaContentCont">
                                            <IonIcon icon={calendarNumberOutline} slot="icon-only" size="large" />
                                            <span className="fechaText">{`Fin: ${tratamientoCompleto.fechaFin}`}</span>
                                        </div>
                                    }
                                </div>
                                <div className="descContainer">

                                    <span className="descTittle">
                                        Descripción:
                                    </span>
                                    <span className="descText">
                                        {tratamientoCompleto.descripcion}
                                    </span>
                                </div>
                                <hr className="lineaSep" />
                            </div>
                            <div className="medicoAsociadoDT">
                                <span className="TextTittle">
                                    Médico asociado
                                </span>
                                <hr className="lineaSep" />
                                {medico && medico.especialidad && medico.centro ? (
                                    <MedicoCard
                                        medico={medico}
                                        especialidad={medico.especialidad}
                                        centro={medico.centro}
                                        provincia={medico.centro.provincia || "Provincia no disponible"}
                                    />
                                ) : (
                                    <span className="text-notFoundInfo">No existe un médico asignado</span>
                                )}

                                <hr className="lineaSep" />
                            </div>
                            <div className="infoDT">
                                <span className="TextTittle">
                                    Información
                                </span>
                                <hr className="lineaSep" />
                                <div className="infoContentDT">
                                    {lineas && lineas.length > 0 ? (
                                        lineas.map((linea, index) => (
                                            <div key={index} className="lineaTratamientoCard">
                                                <h3>{linea.medicamento?.nombre || "Medicamento no disponible"}</h3>
                                                <p><IonIcon icon={cubeOutline} /> <strong>Cantidad:</strong> {linea.linea.cantidad}</p>
                                                <p><IonIcon icon={medkitOutline} /> <strong>Dosis:</strong> {linea.linea.unidad} {linea.linea.medida}</p>
                                                <p><IonIcon icon={stopwatchOutline} /> <strong>Frecuencia:</strong> {linea.linea.frecuencia}</p>
                                                <p><IonIcon icon={calendarOutline} /> <strong>Duración:</strong> {linea.linea.duracion}</p>
                                                <p>
                                                    <IonIcon icon={documentTextOutline} />
                                                    <strong> Descripción:</strong>{" "}
                                                    {linea.linea.descripcion?.trim()
                                                        ? linea.linea.descripcion
                                                        : "Este medicamento no tiene descripción."}
                                                </p>
                                                <hr />
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-notFoundInfo">No hay líneas de tratamiento asignadas</span>
                                    )}

                                </div>
                                <hr className="lineaSep" />

                            </div>
                            <div className="buttonsContainerDT">
                                <IonButton
                                    shape="round"
                                    size="large"
                                    className="exportButtonDT"
                                    onClick={() => handleGeneraPDFConfirmacion()}
                                >
                                    <IonIcon icon={printOutline} size="large" />
                                    <span className="buttonTextDT">Exportar a formato PDF</span>
                                </IonButton>
                                <IonButton
                                    shape="round"
                                    size="large"
                                    className="volverButtonDT"
                                    onClick={() => handleVolver()}
                                >
                                    <IonIcon icon={arrowBack} size="large" />
                                    <span className="buttonTextDT">Volver</span>
                                </IonButton>
                            </div>
                        </div>

                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentDetalleTratamiento">
                        <div className="contenedorDeTratamientoSpinner">
                            <div className="spinnerContainerDT">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerTratamientos">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonContainerTratamientos">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonVolverTratamientos"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextTratamientos">Volver</span>
                                </IonButton>
                            </div>
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
            <DobleConfirmacion
                isOpen={dialogState.isOpen}
                tittle={dialogState.tittle}
                message={dialogState.message}
                img={dialogState.img}
                onConfirm={dialogState.onConfirm}
                onCancel={() => cerrarDialogo()}
            />
        </>
    );
};

export default DetalleTratamientoWrapper;