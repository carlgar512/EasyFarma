import React from "react";
import SideMenu from "../sideMenu/SideMenu";
import MainFooter from "../mainFooter/MainFooter";
import { IonButton, IonContent, IonIcon, IonImg, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { useUser } from "../../context/UserContext";
import { arrowBackOutline, bugOutline, flaskOutline, helpCircleOutline, leafOutline, medicalOutline, pawOutline, restaurantOutline } from "ionicons/icons";
import './Alergias.css'
import { AlergiaDTO, AlergiaCardProps, GradoSeveridad, TipoAlergeno } from "./AlergiasInterfaces";

const Alergias: React.FC = () => {

    const { userData } = useUser();
    //const misAlergias: Alergia[] = [];
    const misAlergias: AlergiaDTO[] = [
        {
            titulo: "Polen de gramíneas",
            descripcion: "Reacción alérgica estacional con exposición al polen.",
            tipoAlergeno: TipoAlergeno.AMBIENTALES,
            gradoSeveridad: GradoSeveridad.MODERADA,
            sintomas: ["Estornudos", "Picor nasal", "Lagrimeo", "Congestión"]
        },
        {
            titulo: "Penicilina",
            descripcion: "Reacción alérgica al tomar antibióticos del grupo de la penicilina.",
            tipoAlergeno: TipoAlergeno.FARMACOS,
            gradoSeveridad: GradoSeveridad.GRAVE,
            sintomas: ["Erupción cutánea", "Dificultad para respirar", "Hinchazón facial"]
        },
        {
            titulo: "Marisco",
            descripcion: "Alergia alimentaria desencadenada por mariscos como gambas o langostinos.",
            tipoAlergeno: TipoAlergeno.ALIMENTOS,
            gradoSeveridad: GradoSeveridad.LEVE,
            sintomas: ["Picor en la boca", "Hinchazón leve de labios", "Urticaria"]
        },
        {
            titulo: "Caspa de gato",
            descripcion: "Reacción alérgica provocada por proteínas presentes en la piel y saliva de gatos.",
            tipoAlergeno: TipoAlergeno.ANIMALES,
            gradoSeveridad: GradoSeveridad.MODERADA,
            sintomas: ["Ojos llorosos", "Estornudos", "Congestión nasal"]
        },
        {
            titulo: "Picadura de avispa",
            descripcion: "Reacción aguda ante la picadura de una avispa.",
            tipoAlergeno: TipoAlergeno.INSECTOS,
            gradoSeveridad: GradoSeveridad.GRAVE,
            sintomas: ["Dolor intenso", "Hinchazón rápida", "Dificultad respiratoria"]
        },
        {
            titulo: "Látex",
            descripcion: "Alergia por contacto con guantes u objetos que contienen látex.",
            tipoAlergeno: TipoAlergeno.QUIMICOS,
            gradoSeveridad: GradoSeveridad.LEVE,
            sintomas: ["Irritación", "Picor en la piel", "Erupción"]
        },
        {
            titulo: "Alergia inespecífica",
            descripcion: "Síntomas repetidos sin causa alérgica concreta identificada.",
            tipoAlergeno: TipoAlergeno.OTROS,
            gradoSeveridad: GradoSeveridad.MODERADA,
            sintomas: ["Urticaria", "Cansancio", "Reacciones variables"]
        }
    ];

    const handleVolver = () => {
        window.history.back();
    };

    //TODO Cambiar condicio userData
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mis alergias" />
                {!userData ? (
                    <IonContent fullscreen className="contentAlergias">
                        <div className="contentAlergiasCentral">
                            {misAlergias.length === 0 ? (
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
                                    {misAlergias.map((alergia, index) => (
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
export default Alergias;