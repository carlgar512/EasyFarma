import { Redirect, useHistory, useLocation } from "react-router-dom";
import { AgendaCitaProps, DetalleMedicoProps, ModalUbicacionProps } from "./DetalleMedicoInterfaces";
import React, { useEffect, useRef, useState } from "react";
import { AgendaMedicaDTO, CentroDTO, CitaDTO, EspecialidadDTO, InfoUserDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";
import SideMenu from "../sideMenu/SideMenu";
import { IonBadge, IonButton, IonContent, IonDatetime, IonHeader, IonIcon, IonModal, IonPage, IonSpinner, IonTitle } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { addCircleOutline, alertCircleOutline, arrowBackOutline, businessOutline, calendarNumberOutline, callOutline, checkmarkOutline, closeCircleOutline, closeOutline, locateOutline, locationOutline, mapOutline, pinOutline, schoolOutline, star, starOutline, warningOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import NotificationToast from "../notification/NotificationToast";
import './DetalleMedico.css'
import MapComponent from "../mapComponent/MapComponent";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { useUser } from "../../context/UserContext";
import { backendService } from "../../services/backendService";


const DetalleMedicoWrapper: React.FC = () => {
    const location = useLocation<{
        medico: MedicoDTO;
        centro: CentroDTO;
        especialidad: EspecialidadDTO;
        seccionAgendarCita: boolean;
    }>();

    const { medico, centro, especialidad, seccionAgendarCita } = location.state || {};

    return <DetalleMedico medico={medico} centro={centro} especialidad={especialidad} seccionAgendarCita={seccionAgendarCita} />;
};

const DetalleMedico: React.FC<DetalleMedicoProps> = ({ medico, centro, especialidad, seccionAgendarCita }) => {

    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [agendas, setAgendas] = useState<AgendaMedicaDTO[]>([]);
    const [medicoState, setMedico] = useState<MedicoDTO>(medico);
    const [centroState, setCentro] = useState<CentroDTO>(centro);
    const [especialidadState, setEspecialidad] = useState<EspecialidadDTO>(especialidad);

    const { userData, setUserData } = useUser();
    const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);
    const [seccionAgendarCitaState, setSeccionAgendarCita] = useState(seccionAgendarCita);

    const [isFavoritoState, setIsFavorito] = useState<boolean>();

    const [dialogState, setDialogState] = useState({
        isOpen: false,
        tittle: "",
        message: "",
        img: "",
        onConfirm: () => { },
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
    const agendaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (seccionAgendarCitaState && agendaRef.current) {
            agendaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [seccionAgendarCitaState]);

    useEffect(() => {
        if (userData?.medicosFavoritos && medicoState?.uid) {
            setIsFavorito(userData.medicosFavoritos.includes(medicoState.uid));
        }
    }, [userData, medicoState]);

    useEffect(() => {
        if (!medicoState?.uid) return;
        const cargarAgendas = async () => {
            try {
                setLoading(true);
                if (medicoState && medicoState.uid) {
                    const agendasData = await backendService.obtenerAgendasMedico(medicoState.uid);
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
            }
        };

        if (medicoState && medicoState.uid) {  // 🔥 Nuevo chequeo aquí también
            cargarAgendas();
        }

    }, []);

    useEffect(() => {
        if (seccionAgendarCitaState) {
            // Esperamos al próximo ciclo para asegurarnos que agendaRef ya está en el DOM
            const scrollTimeout = setTimeout(() => {
                if (agendaRef.current) {
                    agendaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100); // ajustable, pero 100ms suele bastar
    
            return () => clearTimeout(scrollTimeout);
        }
    }, [seccionAgendarCitaState, agendas]);

    const history = useHistory();

    const handleVolver = () => {
        history.replace("./search-doctor");
        window.location.reload();

    };

    const handleLlamarCentro = () => {
        const esMovil = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

        if (!esMovil) {
            setToast({
                show: true,
                message: "Esta función solo está disponible en dispositivos móviles.",
                color: "warning",
                icon: warningOutline,
            });
            return;
        }

        if (centroState.telefono) {
            window.location.href = `tel:${centroState.telefono}`;
        }
    };

    const mostrarDato = (dato?: string | null) => (
        dato ? (
            <span>{dato}</span>
        ) : (
            <span style={{ fontStyle: "italic", color: "gray" }}>(Información no disponible)</span>
        )
    );

    const onFavoritoDobleCheck = () => {
        if (!userData || !userData.medicosFavoritos) return;

        const yaEsFavorito = userData.medicosFavoritos.includes(medico.uid);

        if (yaEsFavorito) {
            // Si ya es favorito, pedimos confirmación para eliminar
            setDialogState({
                isOpen: true,
                tittle: "Eliminar médico de favoritos",
                message: `¿Está seguro de que desea eliminar a ${medicoState.nombreMedico} ${medicoState.apellidosMedico} de sus médicos favoritos? Podrá volver a agregarlo en cualquier momento.`,
                img: "moveCollection.svg",
                onConfirm: () => {
                    onFavoritoClick();
                    cerrarDialogo();
                }
            });

        } else {
            // Si no es favorito, lo añadimos directamente
            onFavoritoClick();
        }
    };

    const onFavoritoClick = async () => {
        if (!userData || !userData.medicosFavoritos) return;

        let nuevosFavoritos: string[];
        let mensajeToast = "";

        if (userData.medicosFavoritos.includes(medicoState.uid)) {
            mensajeToast = `${medicoState.nombreMedico} ${medicoState.apellidosMedico} eliminado de favoritos`;
            // Si ya es favorito, lo quitamos
            nuevosFavoritos = userData.medicosFavoritos.filter(uid => uid !== medicoState.uid);
            setIsFavorito(false);
        } else {
            mensajeToast = `${medicoState.nombreMedico} ${medicoState.apellidosMedico} añadido a favoritos`;
            // Si no es favorito, lo agregamos
            nuevosFavoritos = [...userData.medicosFavoritos, medicoState.uid];
            setIsFavorito(true);
        }

        const updatedUser: InfoUserDTO = {
            ...userData,
            medicosFavoritos: nuevosFavoritos,
        };

        try {
            setLoading(true);
            await backendService.updateUserInfo(updatedUser);

            setUserData(updatedUser);
            setToast({
                show: true,
                message: mensajeToast,
                color: "success",
                icon: checkmarkOutline,
            });

        } catch (error) {

            setToast({
                show: true,
                message: "Error al actualizar favorito",
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
                <MainHeader tittle={"Detalle de Médico"} />
                {!loading ? (
                    <IonContent fullscreen className="ion-padding contentDetalleMedico">
                        <div className="centralDetalleMedico">

                            <div className="topBarDetalleMedico">
                                <div className="avatarMedico">
                                    <span className="letrasAvatar">
                                        {medicoState.nombreMedico.charAt(0)}
                                        {medicoState.apellidosMedico.charAt(0)}
                                    </span>
                                </div>
                                <span className="nameTitleDM">{medicoState.nombreMedico + " " + medicoState.apellidosMedico}</span>
                                <IonButton
                                    fill="clear"
                                    onClick={onFavoritoDobleCheck}
                                >
                                    <IonIcon
                                        color={"warning"}
                                        icon={isFavoritoState ? star : starOutline}
                                        size="large"
                                        slot="icon-only"
                                    />
                                </IonButton>
                            </div>
                            <div className="contentDMDetalle">
                                <div className="detalleSectionContainer">
                                    <div className="detalleLineaTextContainerDM">
                                        <span className="detalleText">Detalle</span>
                                        {isFavoritoState &&
                                            <IonBadge color="warning" style={{ color: "#000", fontWeight: "bold" }}>
                                                Favorito
                                            </IonBadge>
                                        }
                                    </div>

                                    <hr className="barraSeparacion" />
                                </div>

                                <div className="contentItemDM">
                                    <IonIcon icon={schoolOutline} size="large" slot="icon-only" />
                                    <span className="campoTitle">Especialidad: </span>
                                    <span>{mostrarDato(especialidadState?.nombre)}</span>
                                </div>

                                <div className="contentItemDM">
                                    <IonIcon icon={businessOutline} size="large" slot="icon-only" />
                                    <span className="campoTitle">Centro: </span>
                                    <span>{mostrarDato(centroState?.nombreCentro)}</span>
                                </div>
                                <div className="contentItemDM">
                                    <IonIcon icon={callOutline} size="large" slot="icon-only" />
                                    <span className="campoTitle">Teléfono: </span>
                                    <span>{mostrarDato(centroState?.telefono)}</span>
                                    {centroState?.telefono && (
                                        <IonButton className="buttonActionDM" onClick={() => handleLlamarCentro()}>
                                            <IonIcon icon={callOutline} size="large" slot="icon-only" />
                                            <span className="buttonTextDM">Llamar</span>
                                        </IonButton>
                                    )}
                                </div>
                                <div className="contentItemDM">
                                    <IonIcon icon={locationOutline} size="large" slot="icon-only" />
                                    <span className="campoTitle">Ubicación: </span>
                                    <span>{mostrarDato(centroState?.ubicacion)}</span>
                                    {centroState?.ubicacion && (
                                        <IonButton className="buttonActionDM" onClick={() => setModalUbicacionAbierto(true)}>
                                            <IonIcon icon={mapOutline} size="large" slot="icon-only" />
                                            <span className="buttonTextDM">Ver en el mapa</span>
                                        </IonButton>
                                    )}
                                </div>
                                <div className="contentItemDM">
                                    <IonIcon icon={pinOutline} size="large" slot="icon-only" />
                                    <span className="campoTitle">Provincia: </span>
                                    <span>{mostrarDato(centroState?.provincia)}</span>
                                </div>

                            </div>
                            {
                                seccionAgendarCitaState &&
                                <div ref={agendaRef} className="agendaContainerScroll">
                                    <AgendaCita
                                        setSeccionAgendarCita={setSeccionAgendarCita}
                                        agendas={agendas}
                                        medico={medicoState}
                                        setLoading={() => setLoading} />
                                </div>
                            }

                            <div className="buttonContainerMedico">
                                {
                                    !seccionAgendarCitaState &&
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="buttonNuevaCita"
                                        onClick={() => setSeccionAgendarCita(true)}
                                    >
                                        <IonIcon slot="start" icon={addCircleOutline}></IonIcon>
                                        <span className="buttonTextMedico">Agendar nueva cita</span>
                                    </IonButton>
                                }

                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonVolverMedico"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextMedico">Volver</span>
                                </IonButton>
                            </div>
                        </div>

                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentDetalleMedico">
                        <div className="contenedorDeMedicoSpinner">
                            <div className="spinnerContainerDT">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerMedico">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonContainerMedico">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonVolverMedico"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextMedico">Volver</span>
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
            {centroState && centroState.ubicacion &&
                <ModalUbicacion isOpen={modalUbicacionAbierto} ubicacion={centroState.ubicacion} onClose={() => setModalUbicacionAbierto(false)} />
            }
        </>
    );
}


export const ModalUbicacion: React.FC<ModalUbicacionProps> = ({
    isOpen,
    onClose,
    ubicacion,
}) => {
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader className="modalUbicacionHeader">
                <IonIcon icon={locationOutline} slot="start" className="iconUbicacion" size="large" />
                <IonTitle className="titleUbicacion">Ubicación: {ubicacion}</IonTitle>

            </IonHeader>
            <IonContent className="contentModalMap">
                <div className="contentModalCentralMap">
                    <div className="mapContainerModal" style={{ height: "400px" }}>
                        <MapComponent direccionInicial={ubicacion} onSelect={() => { }} />
                    </div>
                    <IonButton className="botonCerrarModalMap" onClick={onClose} color="danger" shape="round" expand="full">
                        <IonIcon icon={closeOutline} />
                        <span>Cerrar</span>
                    </IonButton>
                </div>

            </IonContent>
        </IonModal>
    );
};


export const AgendaCita: React.FC<AgendaCitaProps> = ({ setSeccionAgendarCita, agendas, medico,
    setLoading
}) => {
    const [diasDisponibles, setDiasDisponibles] = useState<string[]>([]);

    useEffect(() => {
        if (agendas.length > 0) {
            const fechas = agendas
                .filter((agenda) =>
                    Object.values(agenda.horarios).some((disponible) => disponible)
                )
                .map((agenda) => {
                    const [day, month, year] = agenda.fecha.split("-");
                    return `${year}-${month}-${day}`; // Convertimos a YYYY-MM-DD
                });

            setDiasDisponibles(fechas);
        } else {
            setDiasDisponibles([]);
        }
    }, [agendas]);

    const [fechaCita, setFechaCita] = useState<string>("");
    const [agendaSeleccionada, setAgendaSeleccionada] = useState<AgendaMedicaDTO | null>(null);
    const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState<string>("");
    const { userData, setUserData } = useUser();

    const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);

    const [dialogState, setDialogState] = useState({
        isOpen: false,
        tittle: "",
        message: "",
        img: "",
        onConfirm: () => { },
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

    const [citaOriginal, setCitaOriginal] = useState<CitaDTO>();

    useEffect(() => {
        const citaGuardada = sessionStorage.getItem("citaOriginal");
        if (citaGuardada) {
            try {
                setCitaOriginal(JSON.parse(citaGuardada));
            } catch {
                setCitaOriginal(undefined);
            }
            sessionStorage.removeItem("citaOriginal"); // Limpieza para evitar efectos secundarios
        }
    }, []);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });


    const today = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(today.getMonth() + 2);

    // Formateamos las fechas al formato que espera IonDatetime (YYYY-MM-DD)
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const minDate = formatDate(today);
    const maxDate = formatDate(twoMonthsLater);

    const highlightedDates = diasDisponibles.map(date => ({
        date,
        textColor: '#ffffff',         // Texto blanco
        backgroundColor: '#28a745',    // Fondo verde
    }));

    //FUNCIONES

    const handleChangeDate = (e: CustomEvent) => {
        const selectedDate = e.detail.value;

        if (typeof selectedDate === "string") {
            const selectedDay = selectedDate.split("T")[0]; // YYYY-MM-DD

            // Solo aceptar si la fecha está en los días habilitados
            if (diasDisponibles.includes(selectedDay)) {
                setFechaCita(selectedDay);
                setHorarioSeleccionado(""); // Limpia horario
                setIsOpenCalendar(false);    // Cierra el modal

                //  convertir selectedDay a formato agenda (DD-MM-YYYY) para buscar
                const [year, month, day] = selectedDay.split("-");
                const formattedSelectedDay = `${day}-${month}-${year}`;

                const agendaDelDia = agendas.find((agenda) => agenda.fecha === formattedSelectedDay);

                if (agendaDelDia) {
                    setAgendaSeleccionada(agendaDelDia);

                    const horariosDisponiblesDelDia = Object.entries(agendaDelDia.horarios)
                        .filter(([_, disponible]) => disponible)
                        .map(([horario]) => horario);

                    setHorariosDisponibles(horariosDisponiblesDelDia);
                } else {
                    setAgendaSeleccionada(null);
                    setHorariosDisponibles([]);
                }
            }
        }
    };

    const openCalendar = () => setIsOpenCalendar(true);
    const closeCalendar = () => setIsOpenCalendar(false);

    const agendarNuevaCitaDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Agendar cita",
            message: `¿Desea confirmar la creación de una cita con el Dr./Dra. ${medico.nombreMedico} ${medico.apellidosMedico} el día ${agendaSeleccionada?.fecha} a las ${horarioSeleccionado}? La cita quedará registrada en su historial médico.`,
            img: "nuevaCita.svg",
            onConfirm: () => {
                onAgendarNuevaCita();
                cerrarDialogo();
            }
        });
    }
    const resetearFormulario = () => {
        setFechaCita("");
        setHorarioSeleccionado("");
        setAgendaSeleccionada(null);
        setHorariosDisponibles([]);
    };
    const history = useHistory();

    const onAgendarNuevaCita = async () => {
        if (!agendaSeleccionada || !horarioSeleccionado) {
            setToast({
                show: true,
                message: "Debe seleccionar una fecha y un horario antes de agendar la cita.",
                color: "danger",
                icon: alertCircleOutline,
            });
            return;
        }
        try {
            setLoading(true);

            await backendService.actualizarHorariosAgenda(agendaSeleccionada.uid, false, horarioSeleccionado);

            // 🔹 Luego guardar la cita
            await backendService.guardarCita(userData!.uid, agendaSeleccionada.idMedico, agendaSeleccionada.fecha, horarioSeleccionado);

            // 🔹 Si hay una cita anterior, eliminarla
            if (citaOriginal?.uid) {
                try {
                    await backendService.eliminarCitaPorId(citaOriginal.uid);
                    console.log(citaOriginal);
                    await backendService.liberarHorario(medico.uid, citaOriginal.fechaCita, citaOriginal.horaCita);
                } catch (err) {
                    console.warn("No se pudo eliminar la cita anterior", err);
                    setToast({
                        show: true,
                        message: "La nueva cita fue creada, pero no se pudo eliminar la anterior.",
                        color: "warning",
                        icon: alertCircleOutline,
                    });
                }
            }
            // 🔹 Mostrar toast de éxito
            setToast({
                show: true,
                message: "Cita agendada correctamente",
                color: "success",
                icon: checkmarkOutline,
            });

            // Opcional: podrías resetear estados o volver a otra vista si quieres aquí
            resetearFormulario();
            setTimeout(() => {
                setSeccionAgendarCita(false);
            }, 2000); // Espera 2 segundos (2000 ms)


        } catch (error: any) {
            const mensaje = error.message || "";
            const esConflicto = mensaje.includes("ya no está disponible");

            setToast({
                show: true,
                message: esConflicto
                    ? "Este horario ya ha sido reservado por otro usuario. Recarga la página para ver los horarios disponibles actualizados."
                    : mensaje || "Error inesperado al agendar cita.",
                color: "danger",
                icon: alertCircleOutline,
            });

            return;

        }
        finally {
            setLoading(false);
            if (citaOriginal?.uid) {
                history.replace('./appointment-history?tipo=todos');
            }
            window.location.reload();
        }
    }

    const cancelarAgendarCita = () => {
        setSeccionAgendarCita(false);
    }

    const formatFechaCita = (fecha: string) => {
        if (!fecha) return "";

        const dateObj = new Date(fecha);
        const opciones: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };

        return dateObj.toLocaleDateString('es-ES', opciones);
    };

    return (
        <div className="agendaCitaContainer">
            <div className="titleContainerAC">
                <h2 className="agendaCitaTitle">Agendar cita</h2>
                <hr className="barraSeparacionAC" />
            </div>
            {citaOriginal && (
                <div className="modificacionBanner">
                    <IonIcon icon={alertCircleOutline} style={{ marginRight: 8 }} />
                    Estás modificando una cita existente. La anterior será eliminada al confirmar esta nueva.
                </div>
            )}

            <div className="form-itemAC">
                <label className="form-labelAC">Fecha:</label>
                <span
                    className="inputFechaCita"
                    onClick={openCalendar}
                >
                    {fechaCita !== "" ? formatFechaCita(fechaCita) : "Seleccione una fecha disponible"}
                </span>

                <IonButton onClick={openCalendar} className="calendarButtonAC" disabled={diasDisponibles.length === 0}>
                    <IonIcon icon={calendarNumberOutline} size="large" slot="icon-only" />
                </IonButton>
                {diasDisponibles.length > 0 && (
                    <IonModal isOpen={isOpenCalendar} onDidDismiss={closeCalendar}>
                        <IonHeader>
                            <div className="topBarModalAC">
                                <div className="left-contentAC">
                                    <IonIcon
                                        icon={calendarNumberOutline}
                                        size="large"
                                        slot="icon-only"
                                    />
                                    <span className="modalTitleAC">Calendario</span>
                                </div>
                                <IonButton className="leaveCalendarButtonAC" onClick={closeCalendar}>
                                    Cerrar
                                </IonButton>
                            </div>
                        </IonHeader>
                        <div className="contentAC">
                            <IonDatetime
                                className="calendarCitas"
                                color={"success"}
                                size="fixed"
                                name="fechaCita"
                                presentation="date"
                                value={fechaCita}
                                onIonChange={(e) => handleChangeDate(e)}
                                min={minDate}
                                max={maxDate}
                                isDateEnabled={(dateString) => diasDisponibles.includes(dateString)}
                                highlightedDates={highlightedDates}
                            >

                            </IonDatetime>
                        </div>
                    </IonModal>
                )}

            </div>
            {diasDisponibles.length === 0 && (
                <div className="noDisponibilidadMensaje">
                    <IonIcon icon={warningOutline} className="warningIcon" />
                    <span>
                        Este médico no dispone de agenda para los próximos 2 meses. Si desea una cita, busque otro especialista con disponibilidad.
                    </span>
                </div>
            )}

            <div className="horariosDisponiblesContainerAC">
                <div className="titleContainerAC">
                    {/* Título */}
                    <h3 className="agendaCitaTitleHorarios">Horarios disponibles</h3>
                    <hr className="barraSeparacionACHorarios" />
                </div>

                {/* Contenido dinámico */}
                {fechaCita === "" ? (
                    <p className="seleccionaFechaAC">(Primero selecciona una fecha)</p>
                ) : (
                    <div className="horariosDisponiblesAC">
                        {horariosDisponibles.map((horario, index) => (
                            <button
                                key={index}
                                className={`horarioItemAC ${horarioSeleccionado === horario ? "selected" : ""}`}
                                onClick={() => setHorarioSeleccionado(horario)}
                            >
                                {horario}
                            </button>
                        ))}
                    </div>

                )}
                <div className="titleContainerAC">
                    <hr className="barraSeparacionACHorarios" />
                </div>

                <div className="agendaCitaButtonsContainer">
                    <IonButton
                        expand="full"
                        shape="round"
                        className="buttonNuevaCita"
                        onClick={() => agendarNuevaCitaDobleCheck()}
                        disabled={fechaCita === "" || horarioSeleccionado === ""}
                    >
                        <IonIcon slot="start" icon={addCircleOutline}></IonIcon>
                        <span className="buttonTextMedico">Agendar cita</span>
                    </IonButton>
                    <IonButton

                        expand="full"
                        shape="round"
                        className="buttonVolverMedico"
                        onClick={() => cancelarAgendarCita()}
                    >
                        <IonIcon slot="start" icon={closeCircleOutline}></IonIcon>
                        <span className="buttonTextMedico">Cancelar</span>
                    </IonButton>

                </div>

            </div>

            <DobleConfirmacion
                isOpen={dialogState.isOpen}
                tittle={dialogState.tittle}
                message={dialogState.message}
                img={dialogState.img}
                onConfirm={dialogState.onConfirm}
                onCancel={() => cerrarDialogo()}
            />
            <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
        </div >

    );
};

export default DetalleMedicoWrapper;
