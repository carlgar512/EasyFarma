import React, { useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { useUser } from "../../context/UserContext";
import { archiveOutline, arrowBackOutline, calendarNumberOutline, checkmarkOutline, documentTextOutline, medkitOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './HistorialTratamientos.css'
import { TipoTratamiento, TratamientoCardProps, TratamientoDTO } from "./HistorialTratamientosInterfaces";
import NotificationToast from "../notification/NotificationToast";

const HistorialTratamientos: React.FC = () => {

    const { userData } = useUser();

    //TODO state para archivados
    const parseFecha = (fechaStr: string): Date => {
        const [dia, mes, anio] = fechaStr.split("/").map(Number);
        return new Date(anio, mes - 1, dia); // mes - 1 porque en JS enero = 0
      };
      
      const ordenarTratamientos = (tratamientos: TratamientoDTO[]): TratamientoDTO[] => {
        return tratamientos.slice().sort((a, b) => {
          // 1️⃣ Activos primero
          if (a.estado !== b.estado) {
            return a.estado ? -1 : 1;
          }
      
          // 2️⃣ Si ambos son activos → por fechaInicio más reciente primero
          if (a.estado && b.estado) {
            const fechaA = parseFecha(a.fechaInicio);
            const fechaB = parseFecha(b.fechaInicio);
            return fechaB.getTime() - fechaA.getTime(); // Más reciente arriba
          }
      
          // 3️⃣ Si ambos son finalizados → por fechaFin más reciente primero
          if (!a.estado && !b.estado && a.fechaFin && b.fechaFin) {
            const fechaA = parseFecha(a.fechaFin);
            const fechaB = parseFecha(b.fechaFin);
            return fechaB.getTime() - fechaA.getTime();
          }
      
          return 0;
        });
      };
      

    const mockTratamientos: TratamientoDTO[] = [
        {
            uid: "t001",
            fechaInicio: "01/04/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med001",
            tipoTratamiento: TipoTratamiento.GENERAL,
        },
        {
            uid: "t002",
            fechaInicio: "15/03/2025",
            fechaFin: "29/03/2025",
            estado: false,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med002",
            tipoTratamiento: TipoTratamiento.CARDIOLOGIA,
        },
        {
            uid: "t003",
            fechaInicio: "10/04/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med003",
            tipoTratamiento: TipoTratamiento.DERMATOLOGIA,
        },
        {
            uid: "t004",
            fechaInicio: "05/04/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med004",
            tipoTratamiento: TipoTratamiento.TRAUMATOLOGIA,
        },
        {
            uid: "t005",
            fechaInicio: "01/02/2025",
            fechaFin: "15/03/2025",
            estado: false,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med005",
            tipoTratamiento: TipoTratamiento.PSIQUIATRIA,
        },
        {
            uid: "t006",
            fechaInicio: "20/03/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med006",
            tipoTratamiento: TipoTratamiento.DIGESTIVO,
        },
        {
            uid: "t007",
            fechaInicio: "12/03/2025",
            fechaFin: "12/04/2025",
            estado: false,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med007",
            tipoTratamiento: TipoTratamiento.ENDOCRINOLOGIA,
        },
        {
            uid: "t008",
            fechaInicio: "05/03/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med008",
            tipoTratamiento: TipoTratamiento.PEDIATRIA,
        },
        {
            uid: "t009",
            fechaInicio: "10/04/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med009",
            tipoTratamiento: TipoTratamiento.NEUMOLOGIA,
        },
        {
            uid: "t010",
            fechaInicio: "01/01/2025",
            fechaFin: "15/01/2025",
            estado: false,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med010",
            tipoTratamiento: TipoTratamiento.NEUROLOGIA,
        },
        {
            uid: "t011",
            fechaInicio: "05/04/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med011",
            tipoTratamiento: TipoTratamiento.ONCOLOGIA,
        },
        {
            uid: "t012",
            fechaInicio: "02/03/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med012",
            tipoTratamiento: TipoTratamiento.UROLOGIA,
        },
        {
            uid: "t013",
            fechaInicio: "10/02/2025",
            fechaFin: "10/03/2025",
            estado: false,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med013",
            tipoTratamiento: TipoTratamiento.GINECOLOGIA,
        },
        {
            uid: "t014",
            fechaInicio: "01/04/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med014",
            tipoTratamiento: TipoTratamiento.REUMATOLOGIA,
        },
        {
            uid: "t015",
            fechaInicio: "01/03/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med015",
            tipoTratamiento: TipoTratamiento.INFECTOLOGIA,
        },
        {
            uid: "t016",
            fechaInicio: "25/03/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med016",
            tipoTratamiento: TipoTratamiento.NUTRICION,
        },
        {
            uid: "t017",
            fechaInicio: "20/02/2025",
            fechaFin: "05/04/2025",
            estado: false,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med017",
            tipoTratamiento: TipoTratamiento.REHABILITACION,
        },
        {
            uid: "t018",
            fechaInicio: "10/04/2025",
            fechaFin: null,
            estado: true,
            archivado: false,
            idUsuario: "user001",
            idMedico: "med018",
            tipoTratamiento: TipoTratamiento.OTROS,
        }
    ];

    const handleVolver = () => {
        window.history.back();
    };

    const handleArchivados = () => {

    }


    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mis Tratamientos" />
                {userData ? (
                    <IonContent fullscreen className="contentTratamientos">
                        <div className="contentCentralTratamientos">
                        <div className="buttonContainerTratamientos">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonArchivadosTratamientos"
                                    onClick={handleArchivados}
                                >
                                    <IonIcon slot="start" size="large" icon={archiveOutline}></IonIcon>
                                    <span className="buttonTextTratamientosArchivados">Archivados</span>
                                </IonButton>
                            </div>
                            <div className="TratamientosContainer">
                                {ordenarTratamientos(mockTratamientos).map((tratamiento, index) => (
                                    <TratamientoCard key={index} tratamiento={tratamiento} index={index +1}/>
                                ))}
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
                ) : (
                    <IonContent fullscreen className="contentTratamientos">
                        <div className="contentTratamientosCentralSpinner">
                            <div className="spinnerContainerAlergias">
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
        </>
    );
};

const TratamientoCard: React.FC<TratamientoCardProps> = ({ tratamiento, index }) => {
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });


    const handleArchive = () => {
    };


    return (
        <>
            <div className="tratamientoCard">
                <div className="tratamientoCardContent">
                    <div className="topSection">
                        <div className="badgeIndex">
                            <span>{index}</span>
                        </div>

                        <div className="topSectRight">
                            <div
                                className={`badgeEstado ${tratamiento.estado ? "activo" : "finalizado"}`}
                            >
                                <span>
                                    {tratamiento.estado ? "Activo" : "Finalizado"}
                                </span>
                            </div>
                            {!tratamiento.estado &&
                                <IonButton
                                    id={tratamiento.estado ? "top-center" : undefined}
                                    shape="round"
                                    size="large"
                                    className="archiveButton"
                                    onClick={() => handleArchive}
                                >
                                    <IonIcon icon={archiveOutline} slot="icon-only" size="large" />
                                </IonButton>
                            }
                        </div>

                    </div>
                    <div className="bodySection">
                        <div className="leftSide">
                            <div className="especialidadContainer">
                                <IonIcon icon={medkitOutline} className="iconoTratamiento" slot="icon-only" size="large" />
                                <span className="tratamientoText">{tratamiento.tipoTratamiento}</span>
                            </div>
                            <div className="fechasContainer">
                                <IonIcon icon={calendarNumberOutline} className="iconoTratamiento" slot="icon-only" size="large" />
                                <span className="tratamientoText">
                                    {tratamiento.estado
                                        ? tratamiento.fechaInicio
                                        : `${tratamiento.fechaInicio} hasta ${tratamiento.fechaFin}`}
                                </span>

                            </div>
                        </div>
                        <div className="rightSide">
                            <IonButton className="detalleButton" shape="round">
                                <IonIcon icon={documentTextOutline} slot="icon-only" size="large" />
                                <span className="buttonTextDetalle"> Detalle del tratamiento</span>
                            </IonButton>
                        </div>
                    </div>
                </div>
            </div>
            <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
        </>
    );
};




export default HistorialTratamientos;