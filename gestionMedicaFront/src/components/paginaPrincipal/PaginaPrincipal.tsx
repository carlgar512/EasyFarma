import { IonButton, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonIcon, IonImg, IonPage, IonSpinner } from "@ionic/react";
import { alertCircleOutline, arrowBackOutline, calendarOutline, callOutline, checkmarkOutline, heartOutline, informationCircleOutline, medkitOutline, peopleCircleOutline, shieldCheckmarkOutline, star, starOutline } from "ionicons/icons";
import "./PaginaPrincipal.css";
import * as icons from 'ionicons/icons';
import { useEffect, useMemo, useRef, useState } from "react";

import { operations } from "../../shared/operations";
import React from "react";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { Operation, sortOperations } from "../../shared/interfaces/Operation";
import SideMenu from "../sideMenu/SideMenu";
import MainHeader from "../mainHeader/MainHeader";
import { AgendaPacienteProps, CarouselSectionProps, MedicoCardSimplifiedProps, ModoAccesibilidadProps, OperationCardProps, SoporteTelefonicoCard } from "./PaginaPrincipalInterfaces";
import MainFooter from "../mainFooter/MainFooter";
import { useUser } from "../../context/UserContext";
import { CentroDTO, CitaDTO, EspecialidadDTO, InfoUserDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";
import { backendService } from "../../services/backendService";
import NotificationToast from "../notification/NotificationToast";
import { useHistory } from "react-router-dom";
import { CitaCard } from "../historialCitas/HistorialCitas";
import { TELEFONOS } from "../../shared/telefonos";


/**
 * Componente `PaginaPrincipal`
 *
 * Este componente representa la vista principal del usuario tras iniciar sesión. Su función es servir como panel de control personalizado
 * mostrando diferentes secciones según el tipo de usuario (modo estándar o modo accesibilidad).
 *
 * Funcionalidades principales:
 * - Mostrar un saludo inicial al usuario.
 * - Renderizar un carrusel de operaciones disponibles y sus favoritas.
 * - Mostrar las citas médicas próximas (agenda).
 * - Listar los médicos favoritos del usuario con detalles de centro y especialidad.
 * - Proporcionar acceso directo al soporte telefónico.
 * - Cambiar entre secciones adaptadas al modo de accesibilidad.
 *
 * También maneja:
 * - Lógica para cargar citas, médicos, centros y especialidades desde el backend.
 * - Visualización de errores mediante `NotificationToast`.
 * - Renderización condicional de secciones basada en el modo de accesibilidad del usuario.
 */

const PaginaPrincipal: React.FC = () => {

    /**
     * VARIABLES
     */
    const [orderOperationType] = useState(sortOperations(operations, "type"));
    const [operacionesFavoritas, setOperacionesFavoritas] = useState<Operation[]>([]);
    const [loadingCitas, setLoadingCitas] = useState(true);
    const { userData } = useUser();
    const [medicos, setMedicos] = useState<MedicoDTO[]>([]);
    const [medicosFavoritos, setMedicosFavoritos] = useState<MedicoDTO[]>([]);
    const [centros, setCentros] = useState<CentroDTO[]>([]);
    const [especialidades, setEspecialidades] = useState<EspecialidadDTO[]>([]);
    const [citas, setCitas] = useState<CitaDTO[]>([]);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });
    const [pantallaActiva, setPantallaActiva] = useState<"operaciones" | "medicos" | "asistencia" | null>(null);

    /**
     * FUNCIONALIDAD
     */
    const fetchCitas = async () => {
        if (!userData?.uid) return;
        setLoadingCitas(true);
        try {
            let data: any[] = await backendService.getCitasActuales(userData.uid);
            const citasMapeadas: CitaDTO[] = data.map((item: any) => ({
                uid: item.uid,
                fechaCita: item.fechaCita,
                horaCita: item.horaCita,
                estadoCita: item.estadoCita as "Pendiente" | "Cancelada" | "Completada",
                archivado: item.archivado,
                idUsuario: item.idUsuario,
                idMedico: item.idMedico,
            }));
            setCitas(citasMapeadas);
        } catch (err: any) {
            console.error("❌ Error al obtener tratamientos:", err.message || err);
        }
        finally {
            setLoadingCitas(false); // termina carga
        }
    };

    const cargarDatos = async () => {
        try {
            const data = await backendService.obtenerMapaFiltros();

            setMedicos(data.medicos);
            setCentros(data.centros);
            setEspecialidades(data.especialidades);

        } catch (err: any) {
            setToast({
                show: true,
                message: err.message || "Error inesperado al cargar los filtros",
                color: "danger",
                icon: alertCircleOutline,
            });
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        if (userData?.uid) {
            fetchCitas();
        }
    }, [userData?.uid]);

    useEffect(() => {
        if (userData?.medicosFavoritos && medicos.length > 0) {
            const favoritos = medicos.filter((medico) =>
                userData.medicosFavoritos.includes(medico.uid)
            );
            setMedicosFavoritos(favoritos);
        }
    }, [userData?.medicosFavoritos, medicos]);

    useEffect(() => {
        if (userData?.operacionesFavoritas && orderOperationType.length > 0) {
            const favoritas = orderOperationType.filter((op) =>
                userData.operacionesFavoritas.includes(op.id.toString())
            );
            setOperacionesFavoritas(favoritas);
        }
    }, [userData?.operacionesFavoritas, orderOperationType]);

    const ordenarOperacionesConFavoritasPrimero = (): Operation[] => {
        const favoritasSet = new Set(operacionesFavoritas.map(op => op.id.toString()));

        const noFavoritas = orderOperationType.filter(
            op => !favoritasSet.has(op.id.toString())
        );

        return [...operacionesFavoritas, ...noFavoritas];
    };

    /**
     * RENDER
     */
    if (!userData) {
        return (
            <>
                <SideMenu />
                <IonPage id="main-content">
                    <MainHeader tittle="Inicio" />
                    <IonContent fullscreen className="content">
                        <div className="contentContainerSpinner">
                            <IonSpinner name="crescent" className="spinner" />
                            <span className="emptyMessagePrincipal">Cargando perfil de usuario...</span>
                        </div>
                    </IonContent>
                    <MainFooter />
                </IonPage>
            </>
        );
    }

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Inicio" />
                {!userData?.modoAccesibilidad ? (
                    <IonContent fullscreen className="content">
                        <div className="contentContainer">
                            <div className="sectionContainer">
                                <Bienvenida />
                            </div>

                            <div className="sectionContainer">
                                <div className="sectionTitle">
                                    <IonIcon slot="start" icon={icons.rocketOutline} size="large" />
                                    <span className="sectionTitleText">Gestiona tus Operaciones de Forma Eficiente</span>
                                </div>
                                <CarouselSection data={orderOperationType} CardComponent={OperationCard} />
                            </div>

                            <div className="sectionContainer">
                                <div className="sectionTitle">
                                    <IonIcon slot="start" icon={icons.calendarNumberOutline} size="large" />
                                    <span className="sectionTitleText">Agenda</span>
                                </div>
                                <AgendaPaciente citas={citas} onActualizar={() => window.location.reload()} loading={loadingCitas} />
                            </div>

                            <div className="sectionContainer">
                                <div className="sectionTitle">
                                    <IonIcon slot="start" icon={icons.heartCircleOutline} size="large" />
                                    <span className="sectionTitleText">Operaciones Favoritas</span>
                                </div>
                                <CarouselSection data={operacionesFavoritas} CardComponent={OperationCard} />
                            </div>

                            <div className="sectionContainer">
                                <div className="sectionTitle">
                                    <IonIcon slot="start" icon={starOutline} size="large" />
                                    <span className="sectionTitleText">Tus Médicos de confianza</span>
                                </div>
                                <CarouselSection
                                    data={medicosFavoritos}
                                    loading={medicos.length === 0}
                                    CardComponent={MedicoCardSimplified}
                                    propMapper={(medico) => {
                                        const especialidad = especialidades.find(e => e.uid === medico.idEspecialidad);
                                        const centro = centros.find(c => c.uid === medico.idCentro);

                                        if (!especialidad || !centro) return null;

                                        return {
                                            key: medico.uid, // para evitar warnings en React
                                            medico,
                                            especialidad,
                                            centro
                                        };
                                    }}
                                />
                            </div>

                            <div className="sectionContainer">
                                <div className="sectionTitle">
                                    <IonIcon slot="start" icon={callOutline} size="large" />
                                    <span className="sectionTitleText">Asistencia Directa</span>
                                </div>
                                <SoporteTelefonico />
                            </div>
                        </div>

                        <EmergecyCall />
                    </IonContent>
                ) : (
                    <IonContent fullscreen className="content">
                        <div className="contentContainerAccesibilidad">
                            {pantallaActiva === null && (
                                <ModoAccesibilidad setPantallaActiva={setPantallaActiva} />
                            )}

                            {pantallaActiva === "operaciones" && (
                                <>

                                    <span className="tituloSeccion">Operaciones</span>
                                    <div className="operationsGrid">

                                        {ordenarOperacionesConFavoritasPrimero().map(op => (
                                            <OperationCard key={op.id} operation={op} />
                                        ))
                                        }
                                    </div>
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="btnVolver"
                                        onClick={() => setPantallaActiva(null)}
                                    >
                                        <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                        <span className="buttonTextCitas">Volver</span>
                                    </IonButton>
                                </>
                            )}

                            {pantallaActiva === "medicos" && (
                                <>
                                    <span className="tituloSeccion">Mis médicos</span>
                                    <div className="operationsGrid">
                                        {medicosFavoritos.map(medico => {
                                            const especialidad = especialidades.find(e => e.uid === medico.idEspecialidad);
                                            const centro = centros.find(c => c.uid === medico.idCentro);

                                            if (!especialidad || !centro) return null;

                                            return (
                                                <MedicoCardSimplified
                                                    key={medico.uid}
                                                    medico={medico}
                                                    centro={centro}
                                                    especialidad={especialidad}
                                                />
                                            );
                                        })}
                                    </div>
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="btnVolver"
                                        onClick={() => setPantallaActiva(null)}
                                    >
                                        <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                        <span className="buttonTextCitas">Volver</span>
                                    </IonButton>
                                </>
                            )}

                            {pantallaActiva === "asistencia" && (
                                <>
                                    <span className="tituloSeccion">Asistencia Directa</span>
                                    <SoporteTelefonico />
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="btnVolver"
                                        onClick={() => setPantallaActiva(null)}
                                    >
                                        <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                        <span className="buttonTextCitas">Volver</span>
                                    </IonButton>
                                </>
                            )}
                        </div>
                        <EmergecyCall />
                    </IonContent>
                )};
                <MainFooter />
            </IonPage>
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


/**
 * Componente `OperationCard`
 *
 * Este componente representa una tarjeta visual e interactiva para una operación del sistema.
 * Muestra el icono, imagen, título y descripción de la operación, permitiendo al usuario:
 *
 * - Acceder directamente a la URL asociada a la operación (redirección al hacer clic en la tarjeta).
 * - Marcar o desmarcar la operación como favorita mediante un botón con icono de estrella.
 * - Confirmar la eliminación de una operación de favoritos mediante un diálogo de doble confirmación.
 * - Ver notificaciones emergentes (toast) al realizar acciones sobre favoritos.
 *
 * También sincroniza el estado de favoritos con el backend y actualiza el contexto del usuario tras cada cambio.
 */
const OperationCard: React.FC<OperationCardProps> = ({ operation }) => {

    /**
     * VARIABLES
     */
    const [isLiked, setIsLiked] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { userData, setUserData } = useUser();
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    /**
    * FUNCIONALIDAD
    */
    useEffect(() => {
        if (userData?.operacionesFavoritas?.includes(operation.id.toString())) {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
    }, [userData, operation.id]);

    const onFavoritoOperacionClick = async () => {
        if (!userData || !userData.operacionesFavoritas) return;

        let nuevosFavoritos: string[];
        let mensajeToast = "";

        if (userData.operacionesFavoritas.includes(operation.id.toString())) {
            mensajeToast = `${operation.title} eliminado de favoritos`;
            nuevosFavoritos = userData.operacionesFavoritas.filter(uid => uid !== operation.id.toString());
            setIsLiked(false);
        } else {
            mensajeToast = `${operation.title} añadido a favoritos`;
            nuevosFavoritos = [...userData.operacionesFavoritas, operation.id.toString()];
            setIsLiked(true);
        }

        const updatedUser: InfoUserDTO = {
            ...userData,
            operacionesFavoritas: nuevosFavoritos,
        };

        try {
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
    };

    const toggleLike = () => {
        if (isLiked) {
            setShowConfirm(true);
        } else {
            onFavoritoOperacionClick();
        }
    };

    const removeLiked = () => {
        onFavoritoOperacionClick();
        setShowConfirm(false);
    };

    const redirectTo = () => {
        window.location.assign(operation.url);
    };

    /**
     * RENDER
     */
    return (
        <>
            <div className="operationCard" onClick={redirectTo}>
                <IonCardHeader className="cardHeader">
                    <IonCardTitle className="cardTitle">
                        <IonIcon
                            icon={(icons as Record<string, string>)[operation.icon]}
                            size="large"
                            className="operationIcon"
                        />
                        <span className="cardTitleText">{operation.title}</span>
                        <IonButton
                            shape="round"
                            fill="clear"

                            className="starIconPrincipal"
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleLike();
                            }}
                        >
                            <IonIcon
                                slot="icon-only"
                                icon={isLiked ? icons.star : icons.starOutline}

                            />
                        </IonButton>
                    </IonCardTitle>
                </IonCardHeader>

                <IonImg className="cardImage" alt={operation.title} src={`/${operation.img}`} />

                <IonCardContent>
                    <span className="cardDescription">{operation.description}</span>
                    <span className="cardTitleTextMobile">{operation.title}</span>
                </IonCardContent>
            </div>
            <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <DobleConfirmacion
                isOpen={showConfirm}
                tittle="Descartar operación de favoritos"
                message={`¿Estás seguro de que deseas eliminar la operación ${operation.title} de tus favoritos? Podrás volver a añadirlo más tarde si lo deseas.`}
                img="/doubleCheckFavourite.svg"
                onConfirm={removeLiked}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};

/**
 * Componente `EmergecyCall`
 *
 * Este componente proporciona una funcionalidad de acceso rápido para llamadas de emergencia.
 * Se renderiza como un botón flotante "S.O.S" en la parte inferior de la pantalla.
 *
 * Funcionalidades clave:
 * - Al hacer clic, despliega un panel con un botón para iniciar una llamada de emergencia.
 * - Solo permite realizar la llamada si el dispositivo es móvil (verificado por `userAgent`).
 * - Si no es móvil, muestra una alerta indicando el número a llamar manualmente.
 * - El panel se cierra automáticamente al hacer clic fuera de su área.
 *
 * Uso común en la pantalla principal o en vistas accesibles, ofreciendo asistencia rápida.
 */
const EmergecyCall: React.FC = () => {
    /**
     * VARIABLES
     */
    const [showEmergency, setShowEmergency] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    /**
     * FUNCIONALIDAD
     */
    const handleEmergencyCall = () => {
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
            window.location.href = 'tel:+34679761132';
        } else {
            alert("Esta función solo está disponible en dispositivos móviles. Llame al +1234567890 si necesita asistencia.");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node)
            ) {
                setShowEmergency(false);
            }
        };

        if (showEmergency) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmergency]);

    /**
     * RENDER
     */
    return (
        <>
            {showEmergency && (
                <>
                    <div className="emergencyOverlay" onClick={() => setShowEmergency(false)} />
                    <div ref={panelRef} className="emergencyPanel">
                        <IonButton shape="round" onClick={handleEmergencyCall}>
                            <IonIcon icon={callOutline} slot="icon-only" />
                        </IonButton>
                        <span className="emergencyMessage">¡¡Llamada de emergencia!!</span>
                    </div>
                </>
            )}
            <IonFab horizontal="center" vertical="bottom" slot="fixed">
                <IonFabButton
                    className="emergencyButton"
                    onClick={() => setShowEmergency(!showEmergency)}
                >
                    {showEmergency ? (
                        <IonIcon icon={icons.closeOutline} className="sosIcon" />
                    ) : (
                        <strong className="sosText">S.O.S</strong>
                    )}
                </IonFabButton>
            </IonFab>
        </>
    );
};

/**
 * Componente `Bienvenida`
 *
 * Este componente muestra un mensaje personalizado de saludo al usuario, adaptado a la hora del día
 * (mañana, tarde o noche), junto con la fecha actual y una cita motivacional relacionada con la salud.
 *
 * Funcionalidades clave:
 * - Detecta la hora local para mostrar "Buenos días", "Buenas tardes" o "Buenas noches".
 * - Recupera el nombre del usuario desde el contexto (`useUser`).
 * - Muestra dinámicamente una frase aleatoria de una lista de citas inspiradoras de salud.
 * - Visualmente presenta el logo de la app junto a un diseño dividido en izquierda (texto) y derecha (imagen).
 *
 * Este componente está diseñado para mejorar la experiencia del usuario al entrar en la página principal.
 */
const Bienvenida: React.FC = () => {
    /**
     * VARIABLES
     */
    const fecha = new Date();
    const hora = fecha.getHours();
    const { userData } = useUser();
    const healthQuotes = [
        { quote: "Cuida tu cuerpo. Es el único lugar que tienes para vivir.", author: "Jim Rohn" },
        { quote: "La salud es la mayor posesión. La alegría es el mayor tesoro.", author: "Lao Tse" },
        { quote: "El cuerpo logra lo que la mente cree.", author: "Napoleon Hill" },
        { quote: "La buena salud no es algo que podamos comprar. Sin embargo, puede ser una cuenta de ahorros muy valiosa.", author: "Anne Wilson Schaef" },
        { quote: "Sin salud, la vida no es vida; solo es un estado de languidez y sufrimiento.", author: "Buda" },
        { quote: "Mantener el cuerpo en buena salud es un deber… de lo contrario, no seremos capaces de mantener nuestra mente fuerte y clara.", author: "Buda" },
        { quote: "La salud es el estado en que el cuerpo y la mente están en armonía con el universo.", author: "Deepak Chopra" },
        { quote: "Cuanto más feliz estás, más saludable estás.", author: "Dalai Lama" },
        { quote: "La prevención es la mejor medicina.", author: "Desconocido" },
        { quote: "Come para nutrir tu cuerpo, no para llenar un vacío.", author: "Desconocido" },
        { quote: "Caminar es el mejor remedio para el hombre.", author: "Hipócrates" },
        { quote: "La fuerza no proviene de la capacidad corporal, sino de la voluntad del alma.", author: "Mahatma Gandhi" },
        { quote: "El ejercicio es clave para la salud física y la tranquilidad mental.", author: "Nelson Mandela" },
        { quote: "La medicina cura, pero solo la naturaleza sana.", author: "Hipócrates" },
        { quote: "Si quieres estar fuerte, corre. Si quieres estar bello, corre. Si quieres estar sabio, corre.", author: "Desconocido" },
        { quote: "El secreto para una buena salud es que el cuerpo se agite y la mente repose.", author: "Vincent Voiture" },
        { quote: "Nada mejora la salud como un buen estado de ánimo.", author: "Proverbio irlandés" },
        { quote: "El mayor error que puede cometer un médico es curar el cuerpo sin haber intentado curar el alma.", author: "Platón" },
        { quote: "La felicidad es la forma más elevada de la salud.", author: "Dalai Lama" },
        { quote: "Invertir en salud no es un gasto, es una inversión.", author: "Desconocido" }
    ];
    const saludo =
        hora < 12
            ? "Buenos días"
            : hora < 19
                ? "Buenas tardes"
                : "Buenas noches";

    const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString("es-ES", { month: "long" });
    const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);

    /**
     * FUNCIONALIDAD
     */
    const getRandomHealthQuote = () => {
        const randomIndex = Math.floor(Math.random() * healthQuotes.length);
        return healthQuotes[randomIndex];
    };

    useEffect(() => {
        setQuote(getRandomHealthQuote());
    }, []);

    const nombreCompleto = userData?.nombreUsuario || userData?.apellidosUsuario
        ? `${userData?.nombreUsuario || ""} ${userData?.apellidosUsuario || ""}`.trim()
        : "Usuario";

    /**
     * RENDER
     */
    return (
        <div className="bienvenidaCard">
            <div className="topBienvenida">
                <div className="bienvenidaLeft">
                    <span className="saludo">{`${saludo},`}</span>
                    <span className="saludo">{nombreCompleto}</span>
                    <span className="fecha">{`Hoy es ${diaSemana}, ${dia} de ${mes}`}</span>
                </div>
                <div className="bienvenidaRight">
                    <IonImg src="EasyFarmaLogo.png" className="logoImgPrincipal"></IonImg>
                </div>
            </div>
            {quote && (
                <div className="motivationalQuote">
                    <p>“{quote.quote}”</p>
                    <span>– {quote.author}</span>
                </div>
            )}
        </div>
    );
};


const soporteData: SoporteTelefonicoCard[] = [
    {
        icon: callOutline,
        title: "Atención al Cliente",
        phone: TELEFONOS.SOPORTE,
        phoneVisible: TELEFONOS.SOPORTEVISIBLE,
        description: "Resuelve tus dudas administrativas",
    },
    {
        icon: medkitOutline,
        title: "Ambulancia Urgente",
        phone: TELEFONOS.TEL112,
        phoneVisible: TELEFONOS.TEL112VISIBLE,
        description: "Emergencias médicas inmediatas",
    },
    {
        icon: shieldCheckmarkOutline,
        title: "Seguro Médico",
        phone: TELEFONOS.SEGURO,
        phoneVisible: TELEFONOS.SOPORTEVISIBLE,
        description: "Contacta con tu aseguradora",
    },
    {
        icon: informationCircleOutline,
        title: "Soporte Farmacéutico",
        phone: TELEFONOS.FARMACIA,
        phoneVisible: TELEFONOS.SOPORTEVISIBLE,
        description: "Consulta sobre tratamientos y medicación",
    },
];

/**
 * SoporteTelefonico.tsx
 *
 * Este componente muestra un grid de tarjetas con accesos rápidos a teléfonos de soporte,
 * incluyendo atención al cliente, emergencias, aseguradora y soporte farmacéutico.
 * 
 * Los datos se centralizan en `soporteData`, donde cada tarjeta incluye:
 * - Un icono representativo
 * - Un título
 * - Descripción breve del servicio
 * - Número telefónico real (`phone`) y visible (`phoneVisible`)
 *
 * Cada tarjeta permite hacer una llamada directa desde dispositivos compatibles,
 * utilizando enlaces `tel:`. Los teléfonos están referenciados desde constantes centralizadas (`TELEFONOS`)
 * para facilitar su mantenimiento.
 */
const SoporteTelefonico: React.FC = () => (
    <div className="soporteTelefonoGrid">
        {soporteData.map((item, index) => (
            <a key={index} className="telefonoCard" href={`tel:${item.phone}`}>
                <IonIcon icon={item.icon} size="large" className="iconSoporteTelefono" />
                <div className="telefonoInfo">
                    <h4>{item.title}</h4>
                    {item.description && <p>{item.description}</p>}
                    <span>{item.phoneVisible}</span>
                </div>
            </a>
        ))}
    </div>
);

const CarouselSection: React.FC<CarouselSectionProps> = ({ data, CardComponent, propMapper, loading }) => {

    /**
     * VARIABLES
     */
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const cardWidth = 336; // 320 + 16

    /**
     * FUNCIONALIDAD
     */
    // Detectar cambio de tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Calcular items visibles por página
    useEffect(() => {
        const calculateItemsPerPage = () => {
            requestAnimationFrame(() => {
                if (sliderRef.current) {
                    const containerWidth = sliderRef.current.offsetWidth;
                    const visible = containerWidth / cardWidth;
                    setItemsPerPage(visible);
                }
            });
        };

        calculateItemsPerPage();
        window.addEventListener("resize", calculateItemsPerPage);
        return () => window.removeEventListener("resize", calculateItemsPerPage);
    }, [data]);

    const itemsPerBlock = useMemo(() => {
        return itemsPerPage ? Math.floor(itemsPerPage) : 1;
    }, [itemsPerPage]);

    const totalPages = useMemo(() => {
        if (!itemsPerPage || itemsPerBlock === 0) return 0;
        return Math.ceil(data.length / itemsPerBlock);
    }, [data.length, itemsPerBlock]);

    const handleScrollToPage = (page: number) => {
        if (!sliderRef.current || itemsPerPage === null) return;
        const maxScroll = getMaxScrollLeft();
        const idealScroll = page * itemsPerBlock * cardWidth;
        const targetScroll = Math.min(idealScroll, maxScroll);
        sliderRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
        setCurrentPage(page);
    };

    const getMaxScrollLeft = () => {
        if (!sliderRef.current) return 0;
        const scrollWidth = sliderRef.current.scrollWidth;
        const containerWidth = sliderRef.current.clientWidth;
        return scrollWidth - containerWidth;
    };

    const handleScrollRight = () => {
        if (currentPage + 1 < totalPages) {
            handleScrollToPage(currentPage + 1);
        } else {
            handleScrollToPage(0);
        }
    };

    const handleScrollLeft = () => {
        if (currentPage > 0) {
            handleScrollToPage(currentPage - 1);
        } else {
            handleScrollToPage(totalPages - 1);
        }
    };

    // Actualiza progreso o página según el dispositivo
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const handleScroll = () => {
            const scrollLeft = slider.scrollLeft;
            const maxScroll = slider.scrollWidth - slider.clientWidth;

            if (isMobile) {
                setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
            } else {
                const blockWidth = itemsPerBlock * cardWidth;
                const index = Math.ceil(scrollLeft / blockWidth);
                setCurrentPage(index);
            }
        };

        slider.addEventListener("scroll", handleScroll);
        return () => slider.removeEventListener("scroll", handleScroll);
    }, [isMobile, itemsPerBlock, data]);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = 0;
            setCurrentPage(0);
        }
    }, [itemsPerBlock]);

    /**
     * RENDER
     */
    if (loading) {
        return (
            <div className="cardCarouselContainer empty">
                <div className="emptyCarouselContent">
                    <IonSpinner name="crescent" />
                    <p className="emptyMessage">Cargando elementos...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="cardCarouselContainer empty">
                <div className="emptyCarouselContent">
                    <IonImg src="NoData.svg" alt="Sin elementos" className="emptyIcon" />
                    <p className="emptyMessage">No hay elementos disponibles para mostrar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cardCarouselContainer">
            {!isMobile && totalPages > 1 && (
                <IonButton fill="clear" size="small" className="navButton left" onClick={handleScrollLeft}>
                    <IonIcon slot="icon-only" icon={icons.chevronBackOutline} />
                </IonButton>
            )}

            <div className="cardSlider" ref={sliderRef}>
                {data.map((item, index) => {
                    const props = propMapper ? propMapper(item) : { operation: item };
                    if (!props) return null;
                    const { key, ...restProps } = props as any;
                    return (
                        <CardComponent key={key ?? item.id ?? index} {...restProps} />
                    );
                })}
            </div>

            {isMobile && (
                <div className="mobileScrollIndicator">
                    <div className="progressBar" style={{ width: `${scrollProgress * 100}%` }}></div>
                </div>
            )}

            {!isMobile && totalPages > 1 && (
                <IonButton fill="clear" size="small" className="navButton right" onClick={handleScrollRight}>
                    <IonIcon slot="icon-only" icon={icons.chevronForwardOutline} />
                </IonButton>
            )}

            {!isMobile && totalPages > 1 && (
                <div className="paginationDots">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${currentPage === index ? "active" : ""}`}
                            onClick={() => handleScrollToPage(index)}
                        ></span>
                    ))}
                </div>
            )}
        </div>
    );
};


/**
 * Componente CarouselSection
 *
 * Este componente renderiza una sección en forma de carrusel horizontal adaptable, que muestra tarjetas (cards)
 * con contenido variable definido por un componente hijo (`CardComponent`) y una lista de datos (`data`).
 * 
 * Características principales:
 * - Calcula automáticamente cuántos elementos caben por página dependiendo del tamaño de pantalla.
 * - Muestra navegación por botones en escritorio y barra de progreso en móvil.
 * - Soporta mapeo de props personalizados a través de `propMapper`.
 * - Permite mostrar estados de carga o vacío.
 * 
 * Props:
 * - `data`: array de elementos a mostrar.
 * - `CardComponent`: componente de tarjeta a renderizar por cada ítem.
 * - `propMapper` (opcional): función para transformar cada item a props del `CardComponent`.
 * - `loading` (opcional): si está activo, se muestra un spinner en lugar del contenido.
 */
const MedicoCardSimplified: React.FC<MedicoCardSimplifiedProps> = ({ medico, especialidad, centro }) => {

    /**
     * VARIABLES
     */
    const history = useHistory();
    const { userData, setUserData } = useUser();
    const [isFavorito, setIsFavorito] = useState<boolean>(() =>
        userData?.medicosFavoritos.includes(medico.uid) ?? false
    );
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        tittle: "",
        message: "",
        img: "",
        onConfirm: () => { },
    });
    /**
     * FUNCIONALIDAD
     */
    const cerrarDialogo = () => {
        setDialogState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    };

    const onFavoritoDobleCheck = () => {
        if (!userData || !userData.medicosFavoritos) return;

        const yaEsFavorito = userData.medicosFavoritos.includes(medico.uid);

        if (yaEsFavorito) {
            // Si ya es favorito, pedimos confirmación para eliminar
            setDialogState({
                isOpen: true,
                tittle: "Eliminar médico de favoritos",
                message: `¿Está seguro de que desea eliminar a ${medico.nombreMedico} ${medico.apellidosMedico} de sus médicos favoritos? Podrá volver a agregarlo en cualquier momento.`,
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

        if (userData.medicosFavoritos.includes(medico.uid)) {
            mensajeToast = `${medico.nombreMedico} ${medico.apellidosMedico} eliminado de favoritos`;
            // Si ya es favorito, lo quitamos
            nuevosFavoritos = userData.medicosFavoritos.filter(uid => uid !== medico.uid);
            setIsFavorito(false);
        } else {
            mensajeToast = `${medico.nombreMedico} ${medico.apellidosMedico} añadido a favoritos`;
            // Si no es favorito, lo agregamos
            nuevosFavoritos = [...userData.medicosFavoritos, medico.uid];
            setIsFavorito(true);
        }

        const updatedUser: InfoUserDTO = {
            ...userData,
            medicosFavoritos: nuevosFavoritos,
        };

        try {
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
    };

    const onVerDetalleClick = () => {
        history.push("/doctor-detail", {
            medico,
            centro,
            especialidad,
            seccionAgendarCita: false
        });
    };

    const onNuevaCitaClick = () => {

        history.push("/doctor-detail", {
            medico,
            centro,
            especialidad,
            seccionAgendarCita: true
        });
    };

    /**
     * RENDER
     */
    return (
        <div className="medicoCardSimplified">
            <div className="medicoTopRow">
                <div className="avatar">{medico.nombreMedico[0]}{medico.apellidosMedico[0]}</div>
                <div className="medicoMainInfo">
                    <div className="medicoNombre">{medico.nombreMedico} {medico.apellidosMedico}</div>
                </div>
                <IonButton
                    fill="clear"
                    size="small"
                    onClick={() => onFavoritoDobleCheck()}
                    className="btnFavorito"
                >
                    <IonIcon icon={isFavorito ? star : starOutline} />
                </IonButton>
            </div>

            <div className="medicoEspecialidad">{especialidad.nombre}</div>

            <div className="medicoCentro">
                <IonIcon icon={icons.locationOutline} />
                <div >
                    {centro.nombreCentro}
                    <div className="provinciaPrincipal">({centro.provincia})</div>
                </div>
            </div>

            <div className="medicoAcciones">
                <IonButton size="small" className="btnCita" onClick={onNuevaCitaClick}>
                    <IonIcon slot="start" icon={icons.addCircleOutline} />
                    Agendar cita
                </IonButton>
                <IonButton fill="outline" size="small" className="btnDetalle" onClick={onVerDetalleClick}>
                    <IonIcon slot="start" icon={icons.eyeOutline} />
                    Ver detalle
                </IonButton>
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
};


/**
 * Componente AgendaPaciente
 *
 * Este componente muestra al usuario su próxima cita médica de forma destacada.
 * También incluye un acceso directo a la sección "Mis Citas" para ver el historial completo.
 *
 * Funcionalidades:
 * - Ordena todas las citas cronológicamente por fecha (formato dd-mm-yyyy).
 * - Muestra un estado de carga si `loading` es true.
 * - Muestra una cita destacada (la más próxima) si existen citas.
 * - Muestra un mensaje amigable si no hay citas disponibles.
 * - Integra una tarjeta interactiva (`CitaCard`) para mostrar la próxima cita.
 *
 * Props:
 * - `citas`: lista de citas médicas asociadas al usuario.
 * - `onActualizar`: callback para refrescar datos tras acciones internas.
 * - `loading`: estado de carga para manejar UI mientras se obtiene la información.
 */
export const AgendaPaciente: React.FC<AgendaPacienteProps> = ({ citas, onActualizar, loading }) => {

    /**
     * VARIABLES
     */


    /**
     * FUNCIONALIDAD
     */

    // Ordenar las citas por fecha (más próximas primero)
    // Ordenar las citas por fecha real (si vienen como "dd-mm-yyyy")
    const citasOrdenadas = [...citas].sort((a, b) => {
        const [diaA, mesA, anioA] = a.fechaCita.split("-");
        const [diaB, mesB, anioB] = b.fechaCita.split("-");

        const fechaA = new Date(`${anioA}-${mesA}-${diaA}`);
        const fechaB = new Date(`${anioB}-${mesB}-${diaB}`);

        return fechaA.getTime() - fechaB.getTime();
    });


    // Tomamos la siguiente cita (la más próxima)
    const siguienteCita = citasOrdenadas[0];

    /**
     * RENDER
     */
    if (loading) {
        return (
            <div className="cardCarouselContainer empty">
                <div className="emptyCarouselContent">
                    <IonSpinner name="crescent" />
                    <p className="emptyMessage">Cargando tus citas...</p>
                </div>
            </div>
        );
    }

    if (!citas || citas.length === 0) {
        return (

            <div className="cardCarouselContainer empty">
                <div className="emptyCarouselContent">
                    <IonImg src="NoData.svg" alt="Sin elementos" className="emptyIcon" />
                    <p className="emptyMessage">No hay elementos disponibles para mostrar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="agendaPacienteContainer">

            <div className="agendaContenido">
                <div className="agendaCita">
                    <h3>Tu próxima cita es:</h3>
                    <div className="proximaCitaBox">
                        {siguienteCita ? (
                            <CitaCard cita={siguienteCita} index={1} onActualizar={onActualizar} />
                        ) : (
                            <p>No tienes citas pendientes.</p>
                        )}
                    </div>
                </div>

            </div>
            <div className="infoExtraAgenda">
                <div className="infoLeftSideAgenda">
                    <IonIcon icon={informationCircleOutline} size="large" />
                    <span>¿Quieres más información sobre estas citas? Visita la sección <strong>Mis citas</strong>.</span>
                </div>
                <IonButton shape="round" routerLink="/appointment-history?tipo=actuales" className="btnMisCitas">
                    <IonIcon slot="start" icon={calendarOutline} />
                    <span > Mis Citas</span>
                </IonButton>
            </div>
        </div>
    );
};

/**
 * Componente ModoAccesibilidad
 *
 * Este componente muestra una interfaz simplificada y adaptada para usuarios en modo de accesibilidad.
 * Presenta botones grandes y claros que permiten acceder a funciones clave del sistema.
 *
 * Funcionalidades:
 * - Muestra un saludo personalizado al usuario.
 * - Ofrece accesos directos a:
 *   - Agenda de citas
 *   - Operaciones frecuentes
 *   - Lista de médicos
 *   - Asistencia telefónica
 * - Cambia la pantalla activa cuando se selecciona una opción sin navegación (`onClick`).
 *
 * Props:
 * - `setPantallaActiva`: función que permite cambiar la sección visible según la acción del usuario.
 */
const ModoAccesibilidad: React.FC<ModoAccesibilidadProps> = ({ setPantallaActiva }) => {

    /**
     * VARIABLES
     */
    const { userData } = useUser();
    const botones = [
        { label: "Ver mi agenda", icon: calendarOutline, class: "btn-agenda", route: "/appointment-history?tipo=actuales" },
        { label: "Operaciones", icon: heartOutline, class: "btn-operaciones", onClick: () => setPantallaActiva("operaciones") },
        { label: "Mis médicos", icon: peopleCircleOutline, class: "btn-medicos", onClick: () => setPantallaActiva("medicos") },
        { label: "Llamar a asistencia", icon: callOutline, class: "btn-asistencia", onClick: () => setPantallaActiva("asistencia") },
    ];

    /**
     * RENDER
     */
    return (
        <div className="modoAccesibilidadContainer">
            <div className="topAccesibilidadPrincipal">
                <span className="tituloModoAccesibilidad">
                    Bienvenido {userData?.nombreUsuario} {userData?.apellidosUsuario}
                </span>
                <IonImg src="EasyFarmaLogo.png" className="logoAccesibilidadPrincipal"></IonImg>
            </div>

            <div className="gridBotonesAccesibilidad">
                {botones.map((btn, index) => (
                    <IonButton
                        key={index}
                        className={`btnAccesibilidad ${btn.class}`}
                        shape="round"
                        expand="block"
                        size="large"
                        routerLink={btn.route}
                        onClick={btn.onClick}
                    >
                        <IonIcon icon={btn.icon} slot="start" />
                        {btn.label}
                    </IonButton>
                ))}
            </div>
        </div>
    );
};

export default PaginaPrincipal;