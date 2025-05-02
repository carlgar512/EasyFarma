import { Redirect, useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { DetalleCitaProps } from "./DetalleCitaInterfaces";
import { AgendaMedicaDTO, CentroDTO, CitaDTO, EspecialidadDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { useUser } from "../../context/UserContext";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import NotificationToast from "../notification/NotificationToast";
import { alertCircleOutline, archiveOutline, arrowBackOutline, businessOutline, calendarNumberOutline, checkmarkOutline, closeCircleOutline, createOutline, folderOpenOutline, location, locationOutline, mapOutline, timeOutline, trashOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './DetalleCita.css'
import MedicoCard from "../medicoCard/MedicoCard";
import { AgendaCita, ModalUbicacion } from "../detalleMedico/DetalleMedico";
import { backendService } from "../../services/backendService";

const DetalleCitaWrapper: React.FC = () => {
    const location = useLocation<{ cita }>();
    const cita: CitaDTO = location.state?.cita;

    return <DetalleCita cita={cita} />;
};

const DetalleCita: React.FC<DetalleCitaProps> = ({ cita }) => {
    const { userData } = useUser();
    const [loading, setLoading] = useState(true);
    const [citaActual, setcitaActual] = useState(cita);
    const [medico, setMedico] = useState<MedicoDTO | null>(null);
    const [centro, setCentro] = useState<CentroDTO | null>(null);
    const [especialidad, setEspecialidad] = useState<EspecialidadDTO | null>(null);
    const history = useHistory();
    const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);
    const [seccionAgendarCitaState, setSeccionAgendarCita] = useState(false);
    const [agendas, setAgendas] = useState<AgendaMedicaDTO[]>([]);
    const agendaRef = useRef<HTMLDivElement>(null);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

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

    useEffect(() => {
        if (seccionAgendarCitaState && agendaRef.current) {
            agendaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [seccionAgendarCitaState]);

    useEffect(() => {
        const fetchCitaCompleta = async () => {
            try {
                setLoading(true);
                const data = await backendService.obtenerInfoMedicoPorId(citaActual.idMedico);
                setMedico(data.medico);
                setCentro(data.centro);
                setEspecialidad(data.especialidad);


            } catch (err: any) {
                setToast(
                    {
                        show: true,
                        message: "Error al encontrar el detalle de esta cita.",
                        color: "danger",
                        icon: alertCircleOutline,
                    }
                );
            } finally {
                setLoading(false);
            }
        };

        if (cita.uid) {
            fetchCitaCompleta();
        }
    }, []);


    const handleVolver = () => {
        history.replace('./appointment-history?tipo=todos');
        window.location.reload();
    };

    function obtenerAntesDelGuion(horario: string): string {
        const partes = horario.split("-");
        return partes[0].trim();
    }

    const handleModificarCita = async () => {
        try {
            setLoading(true);
            if (medico && medico.uid) {
                const agendasData = await backendService.obtenerAgendasMedico(medico.uid);
                setAgendas(agendasData);
            }
        } catch (error: any) {
            setToast({
                show: true,
                message: "Error al cargar agendas médicas",
                color: "danger",
                icon: alertCircleOutline,
            });
        } finally {
            setLoading(false);
            sessionStorage.setItem("citaOriginal", JSON.stringify(citaActual));
            setSeccionAgendarCita(true);
        }
    };


    const handleOnCancelarDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Cancelar cita",
            message: `¿Estás seguro de que deseas cancelar la cita del día ${citaActual.fechaCita} a las ${obtenerAntesDelGuion(citaActual.horaCita)}? Esta acción no es recuperable. Si deseas tener una nueva cita, deberás solicitarla nuevamente.`,
            img: "cancelar.svg",
            onConfirm: () => handleOnCancelar(),
        });
    };

    const handleOnEliminarDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Eliminar cita del historial",
            message: `¿Deseas eliminar esta cita cancelada de tu historial? Los datos de esta cita y la información relacionada se perderán, ya que esta acción no es recuperable.`,
            img: "bajaCuenta.svg",
            onConfirm: () => handleOnEliminar(),
        });
    };

    const handleOnDesarchivarDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Desarchivar cita",
            message: `¿Deseas desarchivar esta cita completada? Esta acción es recuperable y devolverá la cita a tu historial principal.`,
            img: "desarchivar.svg",
            onConfirm: () => handleOnDesarchivar(),
        });
    };

    const handleOnArchivarDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Archivar cita",
            message: `¿Deseas archivar esta cita completada? Esta acción es recuperable y te ayudará a mantener un historial más limpio.`,
            img: "archivar.svg",
            onConfirm: () => handleOnArchivar(),
        });
    };
    const handleOnCancelar = async () => {
        setLoading(true);
        cerrarDialogo();
        try {
            const citaActualizada: CitaDTO = {
                ...citaActual,
                estadoCita: "Cancelada",
            };

            await backendService.actualizarCita(citaActualizada);
            if (medico) {
                await backendService.liberarHorario(medico?.uid, citaActualizada.fechaCita, citaActualizada.horaCita);
            }
            setcitaActual(citaActualizada);
            setToast({
                show: true,
                message: "Cita cancelada correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });
        } catch (error) {

            setToast({
                show: true,
                message: "Error al cancelar la cita.",
                color: "danger",
                icon: alertCircleOutline,
            });
        }
        finally {
            setLoading(false);
        }

    };

    const handleOnEliminar = async () => {
        setLoading(true);
        cerrarDialogo();
        try {
            await backendService.eliminarCitaPorId(citaActual.uid);
            setToast({
                show: true,
                message: "Cita eliminada correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });
        } catch (error) {

            setToast({
                show: true,
                message: "Error al eliminar la cita.",
                color: "danger",
                icon: alertCircleOutline,
            });
        }
        finally {
            setLoading(false);
            history.replace('./appointment-history?tipo=todos');
            window.location.reload();
        }
    };

    const handleOnDesarchivar = async () => {
        setLoading(true);
        cerrarDialogo();
        try {
            const citaActualizada: CitaDTO = {
                ...citaActual,
                archivado: false,
            };

            await backendService.actualizarCita(citaActualizada);
            setcitaActual(citaActualizada);
            setToast({
                show: true,
                message: "Cita devuelta al historal correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });
        } catch (error) {

            setToast({
                show: true,
                message: "Error al devolver la cita al historial principal.",
                color: "danger",
                icon: alertCircleOutline,
            });
        }
        finally {
            setLoading(false);
        }
    };

    const handleOnArchivar = async () => {
        setLoading(true);
        cerrarDialogo();
        try {
            const citaActualizada: CitaDTO = {
                ...citaActual,
                archivado: true,
            };

            await backendService.actualizarCita(citaActualizada);
            setcitaActual(citaActualizada);
            setToast({
                show: true,
                message: "Cita archivada correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });
        } catch (error) {

            setToast({
                show: true,
                message: "Error al archivar la cita.",
                color: "danger",
                icon: alertCircleOutline,
            });

        }
        finally {
            setLoading(false);
        }
    };


    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle={"Detalle de cita"} />
                {!loading ? (
                    <IonContent fullscreen className="ion-padding contentDetalleCita">
                        <div className="contenedorDeCita">
                            <div className="cabeceraDC">
                                <span className="tituloDC">
                                    Cita
                                </span>
                                <div className="botonesDC">
                                    {citaActual.estadoCita === 'Pendiente' && (
                                        <IonButton onClick={() => handleOnCancelarDobleCheck()} className="btnDC cancelar" shape="round" size="large">
                                            <IonIcon icon={closeCircleOutline} slot="icon-only" size="large" />
                                            <span className="buttonTextDC">Cancelar cita</span>
                                        </IonButton>
                                    )}
                                    {citaActual.estadoCita === 'Cancelada' && (
                                        <IonButton onClick={() => handleOnEliminarDobleCheck()} className="btnDC eliminar" shape="round" size="large">
                                            <IonIcon icon={trashOutline} slot="icon-only" size="large" />
                                        </IonButton>
                                    )}
                                    {citaActual.estadoCita !== "Pendiente" && (
                                        citaActual.archivado ? (
                                            <IonButton
                                                onClick={() => handleOnDesarchivarDobleCheck()}
                                                className="btnDC desarchivar"
                                                shape="round"
                                                size="large"
                                            >
                                                <IonIcon icon={folderOpenOutline} slot="icon-only" size="large" />
                                            </IonButton>
                                        ) : (
                                            <IonButton
                                                onClick={() => handleOnArchivarDobleCheck()}
                                                className="btnDC archivar"
                                                shape="round"
                                                size="large"
                                            >
                                                <IonIcon icon={archiveOutline} slot="icon-only" size="large" />
                                            </IonButton>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="detalleContainerDC">
                                <div className="detalleContainerDCTop">
                                    <span className="detalleContainerTextDC">Detalle</span>
                                    <div className={`badgeEstadoDC ${citaActual.estadoCita}DC`}>
                                        <span>
                                            {citaActual.estadoCita}
                                        </span>
                                    </div>

                                    {citaActual.archivado && (
                                        <div className="badgeEstadoDC archivado">
                                            <span>Archivado</span>
                                        </div>
                                    )}

                                </div>
                                <hr className="lineaSepDC" />

                                <div className="fechasContainerDC">
                                    <div className="fechaContentContDC">
                                        <IonIcon icon={calendarNumberOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Fecha: ${citaActual.fechaCita}`}</span>
                                    </div>

                                    <div className="fechaContentContDC">
                                        <IonIcon icon={timeOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Hora: ${obtenerAntesDelGuion(citaActual.horaCita)}`}</span>
                                    </div>

                                    <div className="fechaContentContDC">
                                        <IonIcon icon={businessOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Centro: ${centro?.nombreCentro || "(Nombre del centro no disponible)"}`}</span>
                                    </div>

                                    <div className="fechaContentContDC">
                                        <IonIcon icon={locationOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Ubicación: ${centro?.ubicacion || "(Ubicación del centro no disponible)"}`}</span>
                                        <IonButton className="buttonActionDC" onClick={() => setModalUbicacionAbierto(true)}>
                                            <IonIcon icon={mapOutline} size="large" slot="icon-only" />
                                            <span className="buttonTextDC">Ver en el mapa</span>
                                        </IonButton>
                                    </div>

                                </div>

                            </div>
                            <div className="medicoAsociadoDC">
                                <hr className="lineaSep" />
                                <span className="TextTittleDC">
                                    Médico asociado
                                </span>
                                <hr className="lineaSepDC" />
                                {medico && especialidad && centro && userData ? (
                                    <MedicoCard
                                        medico={medico}
                                        especialidad={especialidad}
                                        centro={centro}
                                        provincia={centro.provincia || "Provincia no disponible"}
                                        esFavorito={userData!.medicosFavoritos.includes(medico.uid) || false} />
                                ) : (
                                    <span className="text-notFoundInfoDC">No existe un médico asignado</span>
                                )}

                                <hr className="lineaSepDC" />
                            </div>
                            {
                                seccionAgendarCitaState && medico &&
                                <div ref={agendaRef} className="agendaContainerScroll">
                                <AgendaCita
                                    setSeccionAgendarCita={setSeccionAgendarCita}
                                    agendas={agendas}
                                    medico={medico}
                                    setLoading={() => setLoading}
                                />
                                </div>
                            }
                            <div className="buttonsContainerDC">

                                {!seccionAgendarCitaState && citaActual.estadoCita === "Pendiente" &&
                                    <IonButton
                                        shape="round"
                                        size="large"
                                        className="modifyButtonDC"
                                        onClick={() => handleModificarCita()}
                                    >
                                        <IonIcon icon={createOutline} size="large" />
                                        <span className="buttonTextDCMain">Modificar cita</span>
                                    </IonButton>

                                }
                                <IonButton
                                    shape="round"
                                    size="large"
                                    className="volverButtonDC"
                                    onClick={() => handleVolver()}
                                >
                                    <IonIcon icon={arrowBackOutline} size="large" />
                                    <span className="buttonTextDCMain">Volver</span>
                                </IonButton>
                            </div>
                        </div>

                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentDetalleCita">
                        <div className="contenedorDeCitaSpinner">
                            <div className="spinnerContainerDC">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerCita">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonsContainerDC">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="volverButtonDC"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextDC">Volver</span>
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                )}
                <MainFooter />
            </IonPage>
            <ModalUbicacion
                isOpen={modalUbicacionAbierto}
                ubicacion={centro?.ubicacion || "Madrid"}
                onClose={() => setModalUbicacionAbierto(false)}
            />

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
}

export default DetalleCitaWrapper;