import { IonButton, IonContent, IonIcon, IonImg, IonPage, IonSpinner } from "@ionic/react";
import SideMenu from "../sideMenu/SideMenu";
import MainHeader from "../mainHeader/MainHeader";
import React, { useEffect, useState } from "react";
import { alertCircleOutline, archiveOutline, arrowBackOutline, calendarOutline, checkmarkOutline, eyeOutline, fileTrayFullOutline, folderOpenOutline, timeOutline, trashOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import { useUser } from "../../context/UserContext";
import { backendService } from "../../services/backendService";
import { CitaCardProps } from "./HistorialCitasInterfaces";
import { CitaDTO } from "../../shared/interfaces/frontDTO";
import './HistorialCitas.css'
import Paginacion from "../paginacion/Paginacion";
import { useHistory, useLocation } from "react-router-dom";
import NotificationToast from "../notification/NotificationToast";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";

const HistorialCitas: React.FC = () => {
    const { userData } = useUser();

    const location = useLocation();
    const history = useHistory();
  

    // 🔍 Leer tipo desde la URL
    const searchParams = new URLSearchParams(location.search);
    const tipoParam = searchParams.get("tipo") as "todos" | "actuales" | "archivados" | null;

    // ✅ Estado interno basado en la URL (si no hay tipo → 'todos')
    const [tipoVista, setTipoVista] = useState<"todos" | "actuales" | "archivados">(tipoParam || "todos");


    const [citas, setCitas] = useState<CitaDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔁 Cambiar tipo de vista y actualizar URL
    const cambiarVista = (nuevaVista: "todos" | "actuales" | "archivados") => {
        history.push(`/appointment-history?tipo=${nuevaVista}`);
        window.location.reload();

    };

    const ordenarCitasPorFecha = (citas: CitaDTO[]): CitaDTO[] => {
        const parseFecha = (fechaStr: string): Date => {
            const [day, month, year] = fechaStr.split("-").map(Number);
            return new Date(year, month - 1, day);
        };
    
        return citas.sort((a, b) => {
            const fechaA = parseFecha(a.fechaCita);
            const fechaB = parseFecha(b.fechaCita);
    
            if (tipoVista === "actuales") {
                return fechaA.getTime() - fechaB.getTime(); // Más próxima primero
            } else {
                return fechaB.getTime() - fechaA.getTime(); // Más reciente primero
            }
        });
    };

    const fetchCitas = async () => {
        if (!userData?.uid) return;

        setLoading(true);
        let data: any[] = [];
        try {
            switch (tipoVista) {
                case "actuales":
                    data = await backendService.getCitasActuales(userData.uid);
                    break;
                case "archivados":
                    data = await backendService.getCitasArchivados(userData.uid);
                    break;
                case "todos":
                default:
                    data = await backendService.getCitasAll(userData.uid);
                    break;
            }

            const citasMapeadas: CitaDTO[] = data.map((item: any) => ({
                uid: item.uid,
                fechaCita: item.fechaCita,
                horaCita: item.horaCita,
                estadoCita: item.estadoCita as "Pendiente" | "Cancelada" | "Completada",
                archivado: item.archivado,
                idUsuario: item.idUsuario,
                idMedico: item.idMedico,
            }));


            setCitas(ordenarCitasPorFecha(citasMapeadas));
        } catch (err: any) {
            console.error("❌ Error al obtener tratamientos:", err.message || err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tipo = searchParams.get("tipo") as "todos" | "actuales" | "archivados" | null;
        setTipoVista(tipo || "todos");
    }, [location.search]);

    useEffect(() => {
        fetchCitas();
    }, [tipoVista, userData?.uid]);


    const handleVolver = () => {
        history.replace("/principal");
    };

    const [paginaActual, setPaginaActual] = useState(1);
    const tratamientosPorPagina = 5;

    const totalPaginas = Math.ceil(citas.length / tratamientosPorPagina);

    const citasPaginadas = ordenarCitasPorFecha(citas).slice(
        (paginaActual - 1) * tratamientosPorPagina,
        paginaActual * tratamientosPorPagina
    );

    const obtenerTitulo = () => {
        switch (tipoParam) {
          case "actuales":
            return "Citas actuales";
          case "archivados":
            return "Citas archivadas";
          case "todos":
          default:
            return "Historial de citas";
        }
      };
      
  
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle={obtenerTitulo()} />
                {!loading ? (
                    <IonContent fullscreen className="contentCitas">
                        <div className="contentCentralCitas">
                            <div className="buttonContainerCitas">
                                {tipoVista === "todos" && (
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="buttonCitasArchivadas"
                                        onClick={() => cambiarVista("archivados")}
                                    >
                                        <IonIcon slot="start" size="large" icon={archiveOutline}></IonIcon>
                                        <span className="buttonTextCitasArchivados">Archivados</span>
                                    </IonButton>
                                )}

                                {tipoVista === "archivados" && (
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="buttonCitasArchivadas"
                                        onClick={() => cambiarVista("todos")}
                                    >
                                        <IonIcon slot="start" size="large" icon={fileTrayFullOutline}></IonIcon>
                                        <span className="buttonTextCitasArchivados">Ver todos</span>
                                    </IonButton>
                                )}
                            </div>
                            {citas.length === 0 ? (
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
                                            onActualizar={fetchCitas}
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


export const CitaCard: React.FC<CitaCardProps> = ({ cita, index, onActualizar }) => {

    const puedeArchivar = cita.estadoCita === "Completada" || cita.estadoCita === "Cancelada";
    const puedeEliminar = cita.estadoCita === "Cancelada";
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

    const onDesArchivarDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Desarchivar cita",
            message: "¿Desea desarchivar esta cita? Esta acción es reversible. La cita volverá a estar disponible en el historial completo de citas.",
            img: "desarchivar.svg",
            onConfirm: () => onDesarchivar(),
        });
    };

    const onArchivarDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Archivar cita",
            message: "¿Desea archivar esta cita? Esta acción es reversible. Podrá visualizar la cita archivada posteriormente en la sección de citas archivadas.",
            img: "archivar.svg",
            onConfirm: () => onArchivar(),
        });
    };

    const onEliminarDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Eliminar cita",
            message: "¿Está seguro de que desea eliminar esta cita? Esta acción es irreversible y no podrá recuperar la información eliminada.",
            img: "bajaCuenta.svg",
            onConfirm: () => onEliminar(),
        });
    };

    const onDesarchivar = async () => {
        cerrarDialogo();
        try {
            const citaActualizada: CitaDTO = {
                ...cita,
                archivado: false,
            };

            await backendService.actualizarCita(citaActualizada);
            setToast({
                show: true,
                message: "Cita devuelta al historial completo.",
                color: "success",
                icon: checkmarkOutline,
            });
            setTimeout(() => {
                onActualizar();
            }, 500); // 👈 vuelve a cargar la lista actualizada
        } catch (error) {
            setToast({
                show: true,
                message: "Error al devolver la cita al historial completo: " + error,
                color: "danger",
                icon: alertCircleOutline,
            });
        }

    };
    const onArchivar = async () => {
        cerrarDialogo();
        try {
            const citaActualizada: CitaDTO = {
                ...cita,
                archivado: true,
            };

            await backendService.actualizarCita(citaActualizada);
            setToast({
                show: true,
                message: "La cita se ha archivado correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });
            setTimeout(() => {
                onActualizar();
            }, 500); // 👈 vuelve a cargar la lista actualizada
        } catch (error) {
            setToast({
                show: true,
                message: "Error al archivar cita: " + error,
                color: "danger",
                icon: alertCircleOutline,
            });
        }

    };

    const onEliminar = async () => {
        cerrarDialogo();
        try {
            await backendService.eliminarCitaPorId(cita.uid);
            setToast({
                show: true,
                message: "La cita se ha eliminado correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });
            setTimeout(() => {
                onActualizar();
            }, 500); // 👈 vuelve a cargar la lista actualizada
        } catch (error) {
            setToast({
                show: true,
                message: "Error al eliminar cita: " + error,
                color: "danger",
                icon: alertCircleOutline,
            });
        }

    };

    const onVerDetalle = () => {
        history.push({
            pathname: "/appointment-detail",
            state: { cita }, // 👈 aquí mandamos el tratamiento
        });
    };

    function obtenerAntesDelGuion(horario: string): string {
        const partes = horario.split("-");
        return partes[0].trim();
    }


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
                        <IonButton onClick={() => onEliminarDobleCheck()} className="cita-buttonElim">
                            <IonIcon icon={trashOutline} size="large" slot="icon-only" />
                        </IonButton>
                    )}
                    {cita.archivado && (
                        <IonButton onClick={() => onDesArchivarDobleCheck()} className="citaButtonArchive">
                            <IonIcon icon={folderOpenOutline} size="large" slot="icon-only" />
                        </IonButton>
                    )}

                    {!cita.archivado && puedeArchivar && (
                        <IonButton onClick={() => onArchivarDobleCheck()} className="citaButtonArchive">
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
                        <span>{obtenerAntesDelGuion(cita.horaCita)}</span>
                    </div>
                </div>
                <div className="verDetalleContainer">
                    <IonButton shape="round" size="small" onClick={() => onVerDetalle()} className="ver-detalle-btn">
                        <IonIcon slot="start" icon={eyeOutline} />
                        Ver Detalle
                    </IonButton>
                </div>

            </div>
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
        </div>
    );

}

export default HistorialCitas;