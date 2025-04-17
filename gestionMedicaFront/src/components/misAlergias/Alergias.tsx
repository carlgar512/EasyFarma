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

const Alergias: React.FC = () => {
    const [alergias, setAlergias] = useState([]);
    const [loading, setLoading] = useState(true);

    const { userData } = useUser();

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