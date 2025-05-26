import React, { useEffect, useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import MainFooter from "../mainFooter/MainFooter";
import { IonButton, IonContent, IonIcon, IonImg, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { useUser } from "../../context/UserContext";
import { arrowBackOutline, bugOutline, flaskOutline, helpCircleOutline, leafOutline, medicalOutline, pawOutline, restaurantOutline } from "ionicons/icons";
import './Alergias.css'
import { AlergiaCardProps, GradoSeveridad, TipoAlergeno } from "./AlergiasInterfaces";
import { backendService } from "../../services/backendService";


/**
 * Componente Alergias
 *
 * Este componente muestra un listado de alergias registradas para el usuario actual.
 * Al cargarse, obtiene los datos desde el backend utilizando el identificador de usuario (`uid`).
 * 
 * Cada alergia se representa mediante un componente `AlergiaCard`, incluyendo la transformación
 * de los valores técnicos (`tipoAlergeno`, `gradoSeveridad`) a formatos legibles mediante funciones de mapeo.
 *
 * Si no se encuentran alergias registradas, se muestra un mensaje informativo con una imagen de estado vacío.
 * En caso contrario, se lista cada alergia en un contenedor estructurado.
 *
 * Durante la carga, se presenta un spinner de espera. También incluye un botón para volver a la pantalla anterior.
 */
const Alergias: React.FC = () => {

    /**
     * VARIABLES
     */
    const [alergias, setAlergias] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userData } = useUser();

    /**
     * FUNCIONALIDAD
     */
    useEffect(() => {
        const fetchAlergias = async () => {
            if (!userData?.uid) return;

            setLoading(true); // ← Empezamos cargando

            try {
                const data = await backendService.getAlergias(userData.uid);

                const alergiasMapeadas = data.map((alergia: any) => ({
                    ...alergia,
                    tipoAlergeno: mapTipoAlergeno(alergia.tipoAlergeno),
                    gradoSeveridad: mapGradoSeveridad(alergia.gradoSeveridad),
                }));

                setAlergias(alergiasMapeadas);
            } catch (err: any) {
                console.error("❌ Error al obtener alergias:", err.message || err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlergias();
    }, [userData?.uid]);

    const handleVolver = () => {
        window.history.back();
    };

    /**
     * RENDER
     */
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mis alergias" />
                {!loading ? (
                    <IonContent fullscreen className="contentAlergias">
                        <div className="contentAlergiasCentral">
                            {alergias.length === 0 ? (
                                <div className="noAlergiasContainerGrid">
                                    <div className="noAlergiasContainer">
                                        <div className="imgContainer">
                                            <IonImg src="NoData.svg" className="imgNoData" />
                                        </div>
                                        <span className="noAlergiasText">No se han registrado alergias para este paciente.</span>
                                    </div>

                                </div>
                            ) : (
                                <div className="alergiasContainer">
                                    {alergias.map((alergia, index) => (
                                        <AlergiaCard alergia={alergia} key={index} />
                                    ))}
                                </div>
                            )}

                            <div className="buttonContainerAlergias">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonVolverAlergias"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextAlergias">Volver</span>
                                </IonButton>
                            </div>
                        </div>

                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentAlergias">
                        <div className="contentAlergiasCentralSpinner">
                            <div className="spinnerContainerAlergias">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerAlergias">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonContainerAlergias">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonVolverAlergias"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextAlergias">Volver</span>
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

/**
 * Componente AlergiaCard
 *
 * Representa visualmente la información detallada de una alergia registrada por el paciente,
 * incluyendo título, descripción, tipo de alérgeno, grado de severidad y síntomas asociados.
 *
 * Props:
 * - alergia: Objeto que contiene los datos de una alergia específica del paciente.
 *
 * El diseño del componente adapta visualmente el contenido dependiendo del tipo de alérgeno
 * y su grado de severidad mediante iconos y estilos condicionales.
 */
const AlergiaCard: React.FC<AlergiaCardProps> = ({ alergia }) => {
    const iconoPorTipo: Record<TipoAlergeno, string> = {
        [TipoAlergeno.ALIMENTOS]: restaurantOutline,
        [TipoAlergeno.FARMACOS]: medicalOutline,
        [TipoAlergeno.AMBIENTALES]: leafOutline,
        [TipoAlergeno.ANIMALES]: pawOutline,
        [TipoAlergeno.INSECTOS]: bugOutline,
        [TipoAlergeno.QUIMICOS]: flaskOutline,
        [TipoAlergeno.OTROS]: helpCircleOutline
    };
    return (
        <div className="alergiaCardContainer">
            <div className="alergiaCardTop">
                <span className="alergiCardTittle">{alergia.titulo}</span>
                <div className={`badgeSeverityAlergia ${alergia.gradoSeveridad.toLowerCase()}`}>
                    <span className="severityText">{alergia.gradoSeveridad}</span>
                </div>
            </div>

            <div className="bodyAlergiaContainer">
                <div className="alergiaTextContainer">
                    <span className="alergiaDescripcionText">
                        {alergia.descripcion}
                    </span>
                </div>
                <div className="alergenoContainer">
                    <IonIcon size="large" icon={iconoPorTipo[alergia.tipoAlergeno]} className="iconoAlergeno" />
                    <span className="alergenoText">{alergia.tipoAlergeno}</span>
                </div>
            </div>

            <div className="sintomasContainer">
                <span className="sintomasTitulo">Síntomas</span>
                <hr className="sintomasLinea" />

                <div className="sintomasContainerBadges">
                    {alergia.sintomas.map((sintoma, index) => (
                        <div key={index} className="sintoma-item">
                            <span>{sintoma}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Función mapTipoAlergeno
 *
 * Mapea una cadena de texto a su correspondiente enumeración del tipo `TipoAlergeno`.
 * Se utiliza para garantizar una interpretación segura y estandarizada del tipo de alérgeno recibido.
 *
 * @param tipo - Cadena representando el tipo de alérgeno (en mayúsculas o minúsculas).
 * @returns TipoAlergeno correspondiente.
 */
export const mapTipoAlergeno = (tipo: string): TipoAlergeno => {
    switch (tipo.toUpperCase()) {
        case "ALIMENTOS":
            return TipoAlergeno.ALIMENTOS;
        case "FARMACOS":
            return TipoAlergeno.FARMACOS;
        case "AMBIENTALES":
            return TipoAlergeno.AMBIENTALES;
        case "ANIMALES":
            return TipoAlergeno.ANIMALES;
        case "INSECTOS":
            return TipoAlergeno.INSECTOS;
        case "QUIMICOS":
            return TipoAlergeno.QUIMICOS;
        case "OTROS":
        case "OTROS / DESCONOCIDOS":
            return TipoAlergeno.OTROS;
        default:
            return TipoAlergeno.OTROS;
    }
};

/**
 * Función mapGradoSeveridad
 *
 * Convierte una cadena de texto en su valor correspondiente dentro del enum `GradoSeveridad`.
 * Se emplea para traducir la severidad textual en un valor de enumeración manejable y controlado.
 *
 * @param grado - Cadena representando el grado de severidad.
 * @returns GradoSeveridad correspondiente.
 */
export const mapGradoSeveridad = (grado: string): GradoSeveridad => {
    switch (grado.toUpperCase()) {
        case "LEVE":
            return GradoSeveridad.LEVE;
        case "MODERADA":
            return GradoSeveridad.MODERADA;
        case "GRAVE":
            return GradoSeveridad.GRAVE;
        default:
            return GradoSeveridad.LEVE;
    }
};
export default Alergias;