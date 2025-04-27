import { IonBadge, IonButton, IonContent, IonIcon, IonImg, IonPage, IonSpinner } from "@ionic/react";
import SideMenu from "../sideMenu/SideMenu";
import MainHeader from "../mainHeader/MainHeader";
import React, { useEffect, useState } from "react";
import { archiveOutline, arrowBackOutline, calendarOutline, cloudUploadOutline, eyeOutline, timeOutline, trashOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import { useUser } from "../../context/UserContext";
import { backendService } from "../../services/backendService";
import { CitaCardProps } from "./HistorialCitasInterfaces";
import { CitaDTO } from "../../shared/interfaces/frontDTO";
import './HistorialCitas.css'
import Paginacion from "../paginacion/Paginacion";

const HistorialCitas: React.FC = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    const { userData } = useUser();


    useEffect(() => {
        const fetchAlergias = async () => {
            if (!userData?.uid) return;

            setLoading(true); // ← Empezamos cargando

            try {

            } catch (err: any) {
                console.error("❌ Error al obtener citas:", err.message || err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlergias();
    }, [userData?.uid]);


    const handleVolver = () => {
        window.history.back();
    };

    const mockCitas: CitaDTO[] = [
        {
          uid: "cita001",
          fechaCita: "20-05-2025",
          horaCita: "09:00-09:30",
          estadoCita: "Pendiente",
          archivado: false,
          idUsuario: "usuario001",
          idMedico: "medico001"
        },
        {
          uid: "cita002",
          fechaCita: "21-05-2025",
          horaCita: "10:00-10:30",
          estadoCita: "Completada",
          archivado: true,
          idUsuario: "usuario001",
          idMedico: "medico002"
        },
        {
          uid: "cita003",
          fechaCita: "22-05-2025",
          horaCita: "11:00-11:30",
          estadoCita: "Cancelada",
          archivado: true,
          idUsuario: "usuario002",
          idMedico: "medico003"
        },
        {
          uid: "cita004",
          fechaCita: "23-05-2025",
          horaCita: "12:00-12:30",
          estadoCita: "Pendiente",
          archivado: false,
          idUsuario: "usuario002",
          idMedico: "medico001"
        },
        {
          uid: "cita005",
          fechaCita: "24-05-2025",
          horaCita: "13:00-13:30",
          estadoCita: "Pendiente",
          archivado: false,
          idUsuario: "usuario003",
          idMedico: "medico004"
        },
        {
          uid: "cita006",
          fechaCita: "19-05-2025",
          horaCita: "08:00-08:30",
          estadoCita: "Completada",
          archivado: false,
          idUsuario: "usuario003",
          idMedico: "medico002"
        },
        {
          uid: "cita007",
          fechaCita: "25-05-2025",
          horaCita: "14:00-14:30",
          estadoCita: "Pendiente",
          archivado: false,
          idUsuario: "usuario004",
          idMedico: "medico005"
        },
        {
          uid: "cita008",
          fechaCita: "18-05-2025",
          horaCita: "15:00-15:30",
          estadoCita: "Cancelada",
          archivado: false,
          idUsuario: "usuario001",
          idMedico: "medico006"
        },
        {
          uid: "cita009",
          fechaCita: "26-05-2025",
          horaCita: "16:00-16:30",
          estadoCita: "Pendiente",
          archivado: false,
          idUsuario: "usuario005",
          idMedico: "medico007"
        },
        {
          uid: "cita010",
          fechaCita: "17-05-2025",
          horaCita: "17:00-17:30",
          estadoCita: "Completada",
          archivado: true,
          idUsuario: "usuario006",
          idMedico: "medico008"
        }
      ];
      

      const ordenarCitasPorFecha = (citas: CitaDTO[]): CitaDTO[] => {
        const parseFecha = (fechaStr: string): Date => {
          const [day, month, year] = fechaStr.split("-").map(Number);
          return new Date(year, month - 1, day);
        };
      
        return citas.sort((a, b) => {
          const fechaA = parseFecha(a.fechaCita);
          const fechaB = parseFecha(b.fechaCita);
          return fechaB.getTime() - fechaA.getTime(); // Fecha más futura primero
        });
      };


    const [paginaActual, setPaginaActual] = useState(1);
    const tratamientosPorPagina = 5;

    const totalPaginas = Math.ceil(mockCitas.length / tratamientosPorPagina);

    const citasPaginadas = ordenarCitasPorFecha(mockCitas).slice(
        (paginaActual - 1) * tratamientosPorPagina,
        paginaActual * tratamientosPorPagina
    );


    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Historial de citas" />
                {loading ? (
                    <IonContent fullscreen className="contentCitas">
                        <div className="contentCentralCitas">
                            {mockCitas.length === 0 ? (
                                <div className="noCitasContainerGrid">
                                    <div className="noCitasContainer">
                                        <div className="imgContainer">
                                            <IonImg src="NoData.svg" className="imgNoData" />
                                        </div>

                                        <span className="noCitasText">No se han registrado citas para este paciente.</span>
                                    </div>

                                </div>
                            ) : (
                                <div className="CitasContainer">
                                    {citasPaginadas.map((cita, index) => (
                                        <CitaCard
                                            cita={cita}
                                            key={index}
                                            index={(paginaActual - 1) * tratamientosPorPagina + index + 1}

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
                            )}

                            <div className="buttonContainerCitas">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonVolverCitas"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextCitas">Volver</span>
                                </IonButton>
                            </div>
                        </div>

                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentCitas">
                        <div className="contentCitasCentralSpinner">
                            <div className="spinnerContainerCitas">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerCitas">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonContainerCitas">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonVolverCitas"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextCitas">Volver</span>
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


const CitaCard: React.FC<CitaCardProps> = ({ cita, index }) => {

    const puedeArchivar = cita.estadoCita === "Completada" || cita.estadoCita === "Cancelada";
    const puedeEliminar = cita.estadoCita === "Cancelada";

    const onDesarchivar = () => {

    };
    const onArchivar = () => {

    };
    const onEliminar = () => {

    };
    const onVerDetalle = () => {

    };

    return (
        <div className="cita-card">
            <div className="cita-card-header">
                <div className="cita-index-badge">
                    <div className="badgeIndex">
                        <span>{index}</span>
                    </div>

                    <div className={`badgeEstado ${cita.estadoCita}`}>
                        <span>{cita.estadoCita}</span>
                    </div>
                    {cita.archivado && (
                        <div className="badgeEstado Archivado">
                            <span>Archivado</span>
                        </div>
                    )}
                </div>

                <div className="cita-action-buttons">
                    {puedeEliminar && (
                        <IonButton onClick={() => onEliminar()} className="cita-buttonElim">
                            <IonIcon icon={trashOutline} size="large" slot="icon-only" />
                        </IonButton>
                    )}
                    {cita.archivado && (
                        <IonButton onClick={() => onDesarchivar()} className="citaButtonArchive">
                            <IonIcon icon={cloudUploadOutline} size="large" slot="icon-only" />
                        </IonButton>
                    )}

                    {!cita.archivado && puedeArchivar && (
                        <IonButton onClick={() => onArchivar()} className="citaButtonArchive">
                            <IonIcon icon={archiveOutline} size="large" slot="icon-only" />
                        </IonButton>
                    )}


                </div>
            </div>

            <div className="cita-card-body">
                <div className="cita-info">
                    <div className="cita-fecha">
                        <IonIcon size="large" icon={calendarOutline} />
                        <span>{cita.fechaCita}</span>
                    </div>
                    <div className="cita-hora">
                        <IonIcon size="large" icon={timeOutline} />
                        <span>{cita.horaCita}</span>
                    </div>
                </div>
                <div className="verDetalleContainer">
                    <IonButton shape="round" size="small" onClick={() => onVerDetalle()} className="ver-detalle-btn">
                        <IonIcon slot="start" icon={eyeOutline} />
                        Ver Detalle
                    </IonButton>
                </div>

            </div>
        </div>
    );

}

export default HistorialCitas;