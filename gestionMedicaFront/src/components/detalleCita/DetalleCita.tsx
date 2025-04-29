import { Redirect, useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { DetalleCitaProps } from "./DetalleCitaInterfaces";
import { CitaDTO } from "../../shared/interfaces/frontDTO";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { useUser } from "../../context/UserContext";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import NotificationToast from "../notification/NotificationToast";
import { alertCircleOutline, archiveOutline, arrowBackOutline, businessOutline, calendarNumberOutline, checkmarkOutline, closeCircleOutline, createOutline, folderOpenOutline, location, locationOutline, mapOutline, timeOutline, trashOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './DetalleCita.css'
import { MedicoCompletoDTO } from "../detalleTratamiento/DetalleTratamientoInterfaces";
import MedicoCard from "../medicoCard/MedicoCard";
import { ModalUbicacion } from "../detalleMedico/DetalleMedico";

const DetalleCitaWrapper: React.FC = () => {
    const location = useLocation<{ cita }>();
    const cita: CitaDTO = location.state?.cita;

    /*if (!cita) {
        // 🔙 Si se accede sin datos, redirige o muestra mensaje
        return <Redirect to="/appointment-history?tipo=todos" />;
    }*/
    const mockCita: CitaDTO = {
        uid: "cita123",
        fechaCita: "15-06-2025", // Formato: DD-MM-YYYY
        horaCita: "10:00-10:30",
        estadoCita: "Cancelada", // "Pendiente" | "Cancelada" | "Completada"
        archivado: true,
        idUsuario: "usuario001",
        idMedico: "medico001"
    };


    return <DetalleCita cita={mockCita} />;
};

const DetalleCita: React.FC<DetalleCitaProps> = ({ cita }) => {
    const { userData } = useUser();
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [medico, setMedico] = useState<MedicoCompletoDTO | null>(null);
    const history = useHistory();
    const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);

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
        const fetchCitaCompleta = async () => {
            try {
                setLoading(true);


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
    }, [cita.uid, reloadTrigger]);


    const handleVolver = () => {
        history.goBack()
    };

    function obtenerAntesDelGuion(horario: string): string {
        const partes = horario.split("-");
        return partes[0].trim();
    }

    const handleModificarCita = () => {

    };


    const handleOnCancelarDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Cancelar cita",
            message: `¿Estás seguro de que deseas cancelar la cita del día ${cita.fechaCita} a las ${obtenerAntesDelGuion(cita.horaCita)}? Esta acción no es recuperable. Si deseas tener una nueva cita, deberás solicitarla nuevamente.`,
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
            message:`¿Deseas desarchivar esta cita completada? Esta acción es recuperable y devolverá la cita a tu historial principal.`,
            img: "desarchivar.svg",
            onConfirm: () => handleOnDesarchivar(),
        });
    };

    const handleOnArchivarDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Archivar cita",
            message:`¿Deseas archivar esta cita completada? Esta acción es recuperable y te ayudará a mantener un historial más limpio.`,
            img: "archivar.svg",
            onConfirm: () => handleOnArchivar(),
        });
    };
    const handleOnCancelar = () => {

    };

    const handleOnEliminar = () => {

    };

    const handleOnDesarchivar = () => {

    };

    const handleOnArchivar = () => {

    };


    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle={"Detalle de tratamiento"} />
                {!loading ? (
                    <IonContent fullscreen className="ion-padding contentDetalleTCita">
                        <div className="contenedorDeCita">
                            <div className="cabeceraDC">
                                <span className="tituloDC">
                                    Cita
                                </span>
                                <div className="botonesDC">
                                    {cita.estadoCita === 'Pendiente' && (
                                        <IonButton onClick={() => handleOnCancelarDobleCheck()} className="btnDC cancelar" shape="round" size="large">
                                            <IonIcon icon={closeCircleOutline} slot="icon-only" size="large" />
                                            <span className="buttonTextDC">Cancelar cita</span>
                                        </IonButton>
                                    )}
                                    {cita.estadoCita === 'Cancelada' && (
                                        <IonButton onClick={() => handleOnEliminarDobleCheck()} className="btnDC eliminar" shape="round" size="large">
                                            <IonIcon icon={trashOutline} slot="icon-only" size="large" />
                                        </IonButton>
                                    )}
                                    {cita.estadoCita !== "Pendiente" && (
                                        cita.archivado ? (
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
                                    <div className={`badgeEstadoDC ${cita.estadoCita}DC`}>
                                        <span>
                                            {cita.estadoCita}
                                        </span>
                                    </div>

                                    {cita.archivado && (
                                        <div className="badgeEstadoDC archivado">
                                            <span>Archivado</span>
                                        </div>
                                    )}

                                </div>
                                <hr className="lineaSepDC" />

                                <div className="fechasContainerDC">
                                    <div className="fechaContentContDC">
                                        <IonIcon icon={calendarNumberOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Fecha: ${cita.fechaCita}`}</span>
                                    </div>

                                    <div className="fechaContentContDC">
                                        <IonIcon icon={timeOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Hora: ${obtenerAntesDelGuion(cita.horaCita)}`}</span>
                                    </div>

                                    <div className="fechaContentContDC">
                                        <IonIcon icon={businessOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Centro: ${obtenerAntesDelGuion(cita.horaCita)}`}</span>
                                    </div>

                                    <div className="fechaContentContDC">
                                        <IonIcon icon={locationOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Ubicación: ${obtenerAntesDelGuion(cita.horaCita)}`}</span>
                                        <IonButton className="buttonActionDC" onClick={() => setModalUbicacionAbierto(true)}>
                                            <IonIcon icon={mapOutline} size="large" slot="icon-only" />
                                            <span className="buttonTextDC">Ver en el mapa</span>
                                        </IonButton>
                                    </div>

                                </div>
                                <hr className="lineaSep" />
                            </div>
                            <div className="medicoAsociadoDC">
                                <span className="TextTittleDC">
                                    Médico asociado
                                </span>
                                <hr className="lineaSepDC" />
                                {medico && medico.especialidad && medico.centro ? (
                                    <MedicoCard
                                        medico={medico}
                                        especialidad={medico.especialidad}
                                        centro={medico.centro}
                                        provincia={medico.centro.provincia || "Provincia no disponible"}
                                        esFavorito={userData!.medicosFavoritos.includes(medico.uid)} />
                                ) : (
                                    <span className="text-notFoundInfoDC">No existe un médico asignado</span>
                                )}

                                <hr className="lineaSepDC" />
                            </div>
                            <div className="buttonsContainerDC">
                                <IonButton
                                    shape="round"
                                    size="large"
                                    className="modifyButtonDC"
                                    onClick={() => handleModificarCita()}
                                >
                                    <IonIcon icon={createOutline} size="large" />
                                    <span className="buttonTextDCMain">Modificar cita</span>
                                </IonButton>
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
                ubicacion={"Tordesillas"}
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