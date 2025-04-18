import React, { useEffect, useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonImg, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { useUser } from "../../context/UserContext";
import { alertCircleOutline, archiveOutline, arrowBackOutline, calendarNumberOutline, checkmarkOutline, documentTextOutline, fileTrayFullOutline, folderOpenOutline, medkitOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './HistorialTratamientos.css'
import { TipoTratamiento, TratamientoCardProps, TratamientoDTO } from "./HistorialTratamientosInterfaces";
import NotificationToast from "../notification/NotificationToast";
import { backendService } from "../../services/backendService";
import { useHistory, useLocation } from "react-router-dom";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";

const HistorialTratamientos: React.FC = () => {

    const { userData } = useUser();

    const location = useLocation();
    const history = useHistory();

    // 🔍 Leer tipo desde la URL
    const searchParams = new URLSearchParams(location.search);
    const tipoParam = searchParams.get("tipo") as "todos" | "actuales" | "archivados" | null;

    // ✅ Estado interno basado en la URL (si no hay tipo → 'todos')
    const [tipoVista, setTipoVista] = useState<"todos" | "actuales" | "archivados">(tipoParam || "todos");

    // 👇 Otros estados
    const [tratamientos, setTratamientos] = useState<TratamientoDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔁 Cambiar tipo de vista y actualizar URL
    const cambiarVista = (nuevaVista: "todos" | "actuales" | "archivados") => {
        setTipoVista(nuevaVista);
        history.push(`/treatment-history?tipo=${nuevaVista}`);
    };


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

    // 👇 La definimos arriba del useEffect
    const fetchTratamientos = async () => {
        if (!userData?.uid) return;

        setLoading(true);
        let data = [];
        try {
            switch (tipoVista) {
                case "actuales":
                    data = await backendService.getTratamientosActuales(userData.uid);
                    break;
                case "archivados":
                    data = await backendService.getTratamientosArchivados(userData.uid);
                    break;
                case "todos":
                default:
                    data = await backendService.getTratamientosActivos(userData.uid);
                    break;
            }

            const tratamientosMapeados = data.map((tratamiento: any) => ({
                ...tratamiento,
                tipoTratamiento: mapTipoTratamiento(tratamiento.tipoTratamiento),
            }));

            setTratamientos(ordenarTratamientos(tratamientosMapeados));
        } catch (err: any) {
            console.error("❌ Error al obtener tratamientos:", err.message || err);
        } finally {
            setLoading(false);
        }
    };

    // 🔁 Y el useEffect queda así de limpio
    useEffect(() => {
        fetchTratamientos();
    }, [tipoVista, userData?.uid]);


    const handleVolver = () => {
        history.replace("/principal");
    };


    //Visuales ###########################################################
    const tituloHeader =
        tipoVista === "archivados"
            ? "Tratamientos archivados"
            : tipoVista === "actuales"
                ? "Tratamientos actuales"
                : "Mis tratamientos";

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle={tituloHeader} />
                {!loading ? (
                    <IonContent fullscreen className="contentTratamientos">
                        <div className="contentCentralTratamientos">
                            <div className="buttonContainerTratamientos">
                                {tipoVista === "todos" && (
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="buttonArchivadosTratamientos"
                                        onClick={() => cambiarVista("archivados")}
                                    >
                                        <IonIcon slot="start" size="large" icon={archiveOutline}></IonIcon>
                                        <span className="buttonTextTratamientosArchivados">Archivados</span>
                                    </IonButton>
                                )}

                                {tipoVista === "archivados" && (
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="buttonArchivadosTratamientos"
                                        onClick={() => cambiarVista("todos")}
                                    >
                                        <IonIcon slot="start" size="large" icon={fileTrayFullOutline}></IonIcon>
                                        <span className="buttonTextTratamientosArchivados">Ver todos</span>
                                    </IonButton>
                                )}
                            </div>


                            {tratamientos.length === 0 ? (
                                <div className="noTratamientosContainerGrid">
                                    <div className="noTratamientosContainer">
                                        <div className="imgContainer">
                                            <IonImg src="NoData.svg" className="imgNoData" />
                                        </div>

                                        {tipoVista === "todos" && (
                                            <span className="noTratamientosText">No se han registrado tratamientos para este paciente.</span>
                                        )}
                                        {tipoVista === "actuales" && (
                                            <span className="noTratamientosText">Este paciente no tiene tratamientos en curso.</span>
                                        )}
                                        {tipoVista === "archivados" && (
                                            <span className="noTratamientosText">Este paciente no tiene tratamientos archivados.</span>
                                        )}
                                    </div>

                                </div>
                            ) : (
                                <div className="TratamientosContainer">
                                    {ordenarTratamientos(tratamientos).map((tratamiento, index) => (
                                        <TratamientoCard key={index} tratamiento={tratamiento} index={index + 1} onActualizar={fetchTratamientos} />
                                    ))}
                                </div>
                            )}
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

const TratamientoCard: React.FC<TratamientoCardProps> = ({ tratamiento, index, onActualizar }) => {
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
            setTimeout(() => {
                onActualizar();
            }, 500); // 👈 vuelve a cargar la lista actualizada
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
            setTimeout(() => {
                onActualizar();
            }, 500);
            // 👈 vuelve a cargar la lista actualizada
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
                            {!tratamiento.estado && !tratamiento.archivado && (
                                <IonButton
                                    shape="round"
                                    size="large"
                                    className="archiveButton"
                                    onClick={() => solicitarConfirmacionArchivado()}
                                >
                                    <IonIcon icon={archiveOutline} slot="icon-only" size="large" />
                                </IonButton>
                            )}

                            {tratamiento.archivado && (
                                <IonButton
                                    shape="round"
                                    size="large"
                                    className="archiveButton"
                                    onClick={() => solicitarConfirmacionDesArchivado()}
                                >
                                    <IonIcon icon={folderOpenOutline} slot="icon-only" size="large" />
                                </IonButton>
                            )}
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


export const mapTipoTratamiento = (tipo: string): TipoTratamiento => {
    switch (tipo.toUpperCase()) {
        case "GENERAL":
            return TipoTratamiento.GENERAL;
        case "CARDIOLOGIA":
            return TipoTratamiento.CARDIOLOGIA;
        case "DERMATOLOGIA":
            return TipoTratamiento.DERMATOLOGIA;
        case "TRAUMATOLOGIA":
            return TipoTratamiento.TRAUMATOLOGIA;
        case "PSIQUIATRIA":
            return TipoTratamiento.PSIQUIATRIA;
        case "DIGESTIVO":
            return TipoTratamiento.DIGESTIVO;
        case "ENDOCRINOLOGIA":
            return TipoTratamiento.ENDOCRINOLOGIA;
        case "PEDIATRIA":
            return TipoTratamiento.PEDIATRIA;
        case "NEUMOLOGIA":
            return TipoTratamiento.NEUMOLOGIA;
        case "NEUROLOGIA":
            return TipoTratamiento.NEUROLOGIA;
        case "ONCOLOGIA":
            return TipoTratamiento.ONCOLOGIA;
        case "UROLOGIA":
            return TipoTratamiento.UROLOGIA;
        case "GINECOLOGIA":
            return TipoTratamiento.GINECOLOGIA;
        case "REUMATOLOGIA":
            return TipoTratamiento.REUMATOLOGIA;
        case "INFECTOLOGIA":
            return TipoTratamiento.INFECTOLOGIA;
        case "NUTRICION":
            return TipoTratamiento.NUTRICION;
        case "REHABILITACION":
            return TipoTratamiento.REHABILITACION;
        case "OTROS":
        default:
            return TipoTratamiento.OTROS;
    }
};



export default HistorialTratamientos;