import { Redirect, useLocation } from "react-router-dom";
import { DetalleMedicoProps, ModalUbicacionProps } from "./DetalleMedicoInterfaces";
import React, { useState } from "react";
import { CentroDTO, EspecialidadDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";
import SideMenu from "../sideMenu/SideMenu";
import { IonBadge, IonButton, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonSpinner, IonTitle, IonToolbar } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { addCircleOutline, arrowBackOutline, businessOutline, callOutline, checkmarkOutline, closeOutline, locateOutline, locationOutline, mapOutline, pinOutline, schoolOutline, starOutline, warningOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import NotificationToast from "../notification/NotificationToast";
import './DetalleMedico.css'
import MapComponent from "../mapComponent/MapComponent";


const DetalleMedicoWrapper: React.FC = () => {
    const location = useLocation<{
        medico: MedicoDTO;
        centro: CentroDTO;
        especialidad: EspecialidadDTO;
        isFavorito: boolean;
    }>();

    const { medico, centro, especialidad, isFavorito } = location.state || {};

    return <DetalleMedico medico={medico} centro={centro} especialidad={especialidad} isFavorito={isFavorito} />;
};

const DetalleMedico: React.FC<DetalleMedicoProps> = ({ medico, centro, especialidad, isFavorito }) => {

    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);

    const handleNuevaCita = () => {
        window.history.back();
    };

    // TODO arrglar esto se va a otras paginas que no es la anterior
    const handleVolver = () => {
        window.history.back();
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

        if (centro.telefono) {
            window.location.href = `tel:${centro.telefono}`;
        }
    };

    const mostrarDato = (dato?: string | null) => (
        dato ? (
            <span>{dato}</span>
        ) : (
            <span style={{ fontStyle: "italic", color: "gray" }}>(Información no disponible)</span>
        )
    );

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle={"Detalle de Médico"} />
                {medico ? (
                    <IonContent fullscreen className="ion-padding contentDetalleMedico">
                        <div className="centralDetalleMedico">

                            <div className="topBarDetalleMedico">
                                <div className="avatarMedico">
                                    <span className="letrasAvatar">
                                        {medico.nombreMedico.charAt(0)}
                                        {medico.apellidosMedico.charAt(0)}
                                    </span>
                                </div>
                                <span className="nameTitleDM">{medico.nombreMedico + " " + medico.apellidosMedico}</span>
                                <IonIcon color="warning" icon={starOutline} size="large" slot="icon-only"></IonIcon>
                            </div>
                            <div className="contentDMDetalle">
                                <div className="detalleSectionContainer">
                                    <div className="detalleLineaTextContainerDM">
                                        <span className="detalleText">Detalle</span>
                                        {isFavorito && 
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
                                    <span>{mostrarDato(especialidad?.nombre)}</span>
                                </div>

                                <div className="contentItemDM">
                                    <IonIcon icon={businessOutline} size="large" slot="icon-only" />
                                    <span className="campoTitle">Centro: </span>
                                    <span>{mostrarDato(centro?.nombreCentro)}</span>
                                </div>
                                <div className="contentItemDM">
                                    <IonIcon icon={callOutline} size="large" slot="icon-only" />
                                    <span className="campoTitle">Teléfono: </span>
                                    <span>{mostrarDato(centro?.telefono)}</span>
                                    {centro?.telefono && (
                                        <IonButton className="buttonActionDM" onClick={() => handleLlamarCentro()}>
                                            <IonIcon icon={callOutline} size="large" slot="icon-only" />
                                            <span className="buttonTextDM">Llamar</span>
                                        </IonButton>
                                    )}
                                </div>
                                <div className="contentItemDM">
                                    <IonIcon icon={locationOutline} size="large" slot="icon-only" />
                                    <span className="campoTitle">Ubicación: </span>
                                    <span>{mostrarDato(centro?.ubicacion)}</span>
                                    {centro?.ubicacion && (
                                        <IonButton className="buttonActionDM" onClick={() => setModalUbicacionAbierto(true)}>
                                            <IonIcon icon={mapOutline} size="large" slot="icon-only" />
                                            <span className="buttonTextDM">Ver en el mapa</span>
                                        </IonButton>
                                    )}
                                </div>
                                <div className="contentItemDM">
                                    <IonIcon icon={pinOutline} size="large" slot="icon-only" />
                                    <span className="campoTitle">Provincia: </span>
                                    <span>{mostrarDato(centro?.provincia)}</span>
                                </div>

                            </div>
                            <div className="buttonContainerMedico">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonNuevaCita"
                                    onClick={handleNuevaCita}
                                >
                                    <IonIcon slot="start" icon={addCircleOutline}></IonIcon>
                                    <span className="buttonTextMedico">Agendar nueva cita</span>
                                </IonButton>
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
            <ModalUbicacion isOpen={modalUbicacionAbierto} ubicacion={centro.ubicacion!} onClose={() => setModalUbicacionAbierto(false)} />

        </>
    );
}


const ModalUbicacion: React.FC<ModalUbicacionProps> = ({
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

export default DetalleMedicoWrapper;