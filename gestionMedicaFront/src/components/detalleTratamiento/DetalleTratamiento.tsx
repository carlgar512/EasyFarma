import React, { useEffect, useState } from "react";
import { DetalleTratamientoProps, LineaConMedicamento, MedicoCardProps, MedicoDTO, TratamientoCompletoResponse, TratamientoDTO } from "./DetalleTratamientoInterfaces";
import { Redirect, useLocation } from "react-router-dom";
import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import MainFooter from "../mainFooter/MainFooter";
import MainHeader from "../mainHeader/MainHeader";
import SideMenu from "../sideMenu/SideMenu";
import './DetalleTratamiento.css'
import { alertCircleOutline, archiveOutline, arrowBack, arrowBackOutline, calendarNumberOutline, calendarOutline, checkmarkOutline, cubeOutline, documentTextOutline, eyeOutline, folderOpenOutline, locationOutline, medkitOutline, printOutline, star, starOutline, stopwatchOutline } from "ionicons/icons";
import { backendService } from "../../services/backendService";
import NotificationToast from "../notification/NotificationToast";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { useUser } from "../../context/UserContext";



const DetalleTratamientoWrapper: React.FC = () => {
    const location = useLocation<{ tratamiento }>();
    const tratamiento = location.state?.tratamiento;

    if (!tratamiento) {
        // 🔙 Si se accede sin datos, redirige o muestra mensaje
        return <Redirect to="/treatment-history" />;
    }

    return <DetalleTratamiento tratamiento={tratamiento} />;
};

const DetalleTratamiento: React.FC<DetalleTratamientoProps> = ({ tratamiento }) => {
    const { userData } = useUser();

    const [tratamientoCompleto, setTratamiento] = useState<TratamientoDTO | null>(null);
    const [lineas, setLineas] = useState<LineaConMedicamento[]>([]);
    const [medico, setMedico] = useState<MedicoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    useEffect(() => {
        const fetchTratamientoCompleto = async () => {
            try {
                setLoading(true);

                const data: TratamientoCompletoResponse = await backendService.getTratamientoCompleto(tratamiento.uid);

                setTratamiento(data.tratamiento);
                setLineas(data.lineas);
                setMedico(data.medico);
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
    }, [tratamiento.uid, reloadTrigger]);


    const cerrarDialogo = () => {
        setDialogState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    };

    const [dialogState, setDialogState] = useState({
        isOpen: false,
        tittle: "",
        message: "",
        img: "",
        onConfirm: () => { },
    });

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
        window.history.back();
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
                {!loading && tratamientoCompleto ? (
                    <IonContent fullscreen className="ion-padding contentDetalleTratamiento">
                        <div className="contenedorDeTratamiento">
                            <div className="cabeceraDT">
                                <span className="tituloDT">
                                    Tratamiento 1
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
                                {medico ? (
                                    <MedicoCard
                                        nombre={medico.nombreMedico}
                                        apellidos={medico.apellidosMedico}
                                        especialidad={medico.especialidad?.nombre || "Especialidad no disponible"}
                                        centro={medico.centro?.nombreCentro || "Centro no disponible"}
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


const MedicoCard: React.FC<MedicoCardProps> = ({
    nombre,
    apellidos,
    especialidad,
    centro,
    esFavorito = false,
}) => {
    const onFavoritoClick = () => {
    };

    const onVerDetalleClick = () => {

    };


    return (
        <div className="medico-card">
            <div className="card-header">
                <div className="header-left">
                    <div className="avatarMedico">
                        <span className="letrasAvatar">
                            {nombre.charAt(0)}
                            {apellidos.charAt(0)}
                        </span>
                    </div>

                    <div>
                        <h3>{nombre} {apellidos}</h3>
                        <p className="especialidad">{especialidad}</p>
                        <hr className="separadorMedico" />
                        <IonIcon icon={locationOutline} slot="start" />
                        <span className="centro">{centro}</span>
                    </div>
                </div>

                <IonButton
                    fill="clear"
                    size="small"
                    onClick={onFavoritoClick}
                    className="favorito-boton"
                >
                    <IonIcon icon={esFavorito ? star : starOutline} />
                </IonButton>
            </div>

            <div className="card-footer">
                <IonButton
                    shape="round"
                    fill="outline"
                    color={"success"}
                    onClick={onVerDetalleClick}
                    className="ver-detalle-boton"
                >
                    <IonIcon icon={eyeOutline} slot="start" />
                    <span>Ver detalle</span>
                </IonButton>
            </div>
        </div>
    );
};


export default DetalleTratamientoWrapper;