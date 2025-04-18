import React, { useState } from "react";
import { DetalleTratamientoProps, LineaTratamientoDTO, MedicoCardProps } from "./DetalleTratamientoInterfaces";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import MainFooter from "../mainFooter/MainFooter";
import MainHeader from "../mainHeader/MainHeader";
import SideMenu from "../sideMenu/SideMenu";
import './DetalleTratamiento.css'
import { alertCircleOutline, archiveOutline, arrowBack, calendarNumberOutline, calendarOutline, checkmarkOutline, cubeOutline, documentTextOutline, eyeOutline, folderOpenOutline, locationOutline, medkitOutline, printOutline, star, starOutline, stopwatchOutline } from "ionicons/icons";
import { backendService } from "../../services/backendService";
import NotificationToast from "../notification/NotificationToast";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";


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

    const lineasTratamientoMock: LineaTratamientoDTO[] = [
        {
            medicamento: "Paracetamol",
            cantidad: "1",
            dosis: "500",
            unidad: "mg",
            frecuencia: "Cada 8 horas",
            duracion: "5 días",
            descripcion: "Tomar después de las comidas para evitar molestias estomacales.",
        },
        {
            medicamento: "Ibuprofeno",
            cantidad: "1",
            dosis: "400",
            unidad: "mg",
            frecuencia: "Cada 12 horas",
            duracion: "7 días",
            descripcion: "Indicado para dolor leve a moderado con inflamación.",
        },
        {
            medicamento: "Omeprazol",
            cantidad: "1",
            dosis: "20",
            unidad: "mg",
            frecuencia: "Antes del desayuno",
            duracion: "14 días",
            descripcion: "",
        },
        {
            medicamento: "Amoxicilina",
            cantidad: "2",
            dosis: "500",
            unidad: "mg",
            frecuencia: "Cada 8 horas",
            duracion: "10 días",
            descripcion: "Completar el tratamiento aunque los síntomas desaparezcan.",
        },
        {
            medicamento: "Salbutamol",
            cantidad: "2",
            dosis: "100",
            unidad: "mcg",
            frecuencia: "Cada 6 horas si hay dificultad respiratoria",
            duracion: "Según necesidad",
            descripcion: "Usar en caso de crisis asmática. Inhalar profundamente.",
        },
        {
            medicamento: "Ácido fólico",
            cantidad: "1",
            dosis: "5",
            unidad: "mg",
            frecuencia: "Una vez al día",
            duracion: "Durante todo el embarazo",
            descripcion: "Previene defectos congénitos. Suplemento esencial prenatal.",
        },
        {
            medicamento: "Loratadina",
            cantidad: "1",
            dosis: "10",
            unidad: "mg",
            frecuencia: "Una vez al día",
            duracion: "Mientras persistan los síntomas",
            descripcion: "Puede producir somnolencia. No conducir maquinaria pesada.",
        },
        {
            medicamento: "Metformina",
            cantidad: "1",
            dosis: "850",
            unidad: "mg",
            frecuencia: "Con desayuno y cena",
            duracion: "Tratamiento continuo",
            descripcion: "Para controlar glucosa en sangre en pacientes con diabetes tipo 2.",
        },
    ];

    const history = useHistory();
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

    const handleArchive = async () => {
        try {
            await backendService.updateArchivadoTratamiento(tratamiento.uid, true);
            setToast({
                show: true,
                message: "El tratamiento se ha activado correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });
            /*setTimeout(() => {
                onActualizar();
            }, 500); */// 👈 vuelve a cargar la lista actualizada
        } catch (error) {
            setToast({
                show: true,
                message: "Error al archivar tratamiento: " + error,
                color: "danger",
                icon: alertCircleOutline,
            });
        }
    };

    const handleUnArchive = async () => {
        try {
            await backendService.updateArchivadoTratamiento(tratamiento.uid, false);
            setToast({
                show: true,
                message: "Tratamiento devuelto al historial completo.",
                color: "success",
                icon: checkmarkOutline,
            });
            /*setTimeout(() => {
                onActualizar();
            }, 500); */// 👈 vuelve a cargar la lista actualizada
        } catch (error) {
            setToast({
                show: true,
                message: "Error al devolver el tratamiento al historial completo: " + error,
                color: "danger",
                icon: alertCircleOutline,
            });
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

    const medicoMock = {
        nombre: "Laura",
        apellidos: "Gómez Martínez",
        especialidad: "Cardiología",
        centro: "Hospital Universitario La Paz"
    };

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle={"Detalle de tratamiento"} />
                <IonContent fullscreen className="ion-padding contentDetalleTratamiento">
                    <div className="contenedorDeTratamiento">
                        <div className="cabeceraDT">
                            <span className="tituloDT">
                                Tratamiento 1
                            </span>
                            {!tratamiento.estado && !tratamiento.archivado && (
                                <IonButton
                                    shape="round"
                                    size="large"
                                    className="archiveButtonDT"
                                    onClick={() => solicitarConfirmacionArchivado()}
                                >
                                    <IonIcon icon={archiveOutline} slot="icon-only" size="large" />
                                </IonButton>
                            )}

                            {tratamiento.archivado && (
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
                                    className={`badgeEstado ${tratamiento.estado ? "activo" : "finalizado"}`}
                                >
                                    <span>
                                        {tratamiento.estado ? "Activo" : "Finalizado"}
                                    </span>
                                </div>
                            </div>
                            <hr className="lineaSep" />

                            <div className="fechasContainerDT">
                                <div className="fechaContentCont">
                                    <IonIcon icon={calendarNumberOutline} slot="icon-only" size="large" />
                                    <span className="fechaText">{`Inicio: ${tratamiento.fechaInicio}`}</span>
                                </div>
                                {
                                    !tratamiento.estado &&
                                    <div className="fechaContentCont">
                                        <IonIcon icon={calendarNumberOutline} slot="icon-only" size="large" />
                                        <span className="fechaText">{`Fin: ${tratamiento.fechaFin}`}</span>
                                    </div>
                                }
                            </div>
                            <div className="descContainer">

                                <span className="descTittle">
                                    Descripción:
                                </span>
                                <span className="descText">
                                    {tratamiento.descripcion}
                                </span>
                            </div>
                            <hr className="lineaSep" />
                        </div>
                        <div className="medicoAsociadoDT">
                            <span className="TextTittle">
                                Médico asociado
                            </span>
                            <hr className="lineaSep" />
                            <MedicoCard
                                nombre={medicoMock.nombre}
                                apellidos={medicoMock.apellidos}
                                especialidad={medicoMock.especialidad}
                                centro={medicoMock.centro}
                            />
                            <hr className="lineaSep" />
                        </div>
                        <div className="infoDT">
                            <span className="TextTittle">
                                Información
                            </span>
                            <hr className="lineaSep" />
                            <div className="infoContentDT">

                                {lineasTratamientoMock.map((linea, index) => (
                                    <div key={index} className="lineaTratamientoCard">
                                        <h3>{linea.medicamento}</h3>
                                        <p><IonIcon icon={cubeOutline} /> <strong>Cantidad:</strong> {linea.cantidad}</p>
                                        <p><IonIcon icon={medkitOutline} /> <strong>Dosis:</strong> {linea.dosis} {linea.unidad}</p>
                                        <p><IonIcon icon={stopwatchOutline} /> <strong>Frecuencia:</strong> {linea.frecuencia}</p>
                                        <p><IonIcon icon={calendarOutline} /> <strong>Duración:</strong> {linea.duracion}</p>
                                        <p>
                                            <IonIcon icon={documentTextOutline} />
                                            <strong> Descripción:</strong>{" "}
                                            {linea.descripcion?.trim()
                                                ? linea.descripcion
                                                : "Este medicamento no tiene descripción."}
                                        </p>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                            <hr className="lineaSep" />

                        </div>
                        <div className="buttonsContainerDT">
                            <IonButton
                                shape="round"
                                size="large"
                                className="exportButtonDT"
                                onClick={() => solicitarConfirmacionDesArchivado()}
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