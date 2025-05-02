import React from "react";
import { useHistory } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonImg, IonPage } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { arrowBackOutline, heartOutline, searchOutline, starOutline, timeOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './MenuAgendaCita.css'


const MenuAgendaCita: React.FC = () => {

    const history = useHistory();
    const handleVolver = () => {
        history.replace("/principal");
    };

    const goToGeneralSearch = () => {
        history.push("/search-doctor");
    };

    const goToFavoritos = () => {
        history.push("/search-doctor?favoritos=true");
    };

    const goToRecientes = () => {
        history.push("/search-doctor?recientes=true");
    };


    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Te ayudamos a encontrar al médico adecuado" />

                <IonContent fullscreen className="contentMAC">
                    <div className="contentCentralMAC">
                        <div className="contentCentralMAC">
                            <div className="cardsContainerMAC">

                                <div className="cardMAC general" onClick={goToGeneralSearch}>
                                    <div className="cardLeftMAC">
                                        <IonIcon icon={searchOutline} className="iconMAC" />
                                        <h3 className="cardTitleMAC">Buscar por especialidad o ubicación</h3>
                                        <p className="cardDescriptionMAC">
                                            Explora todos los médicos disponibles según filtros como provincia, especialidad o centro.
                                        </p>
                                    </div>
                                    <div className="cardRightMAC">
                                        <IonImg src="encuentraMedico.svg" alt="Buscar médico" className="cardImageMAC" />
                                    </div>
                                </div>

                                <div className="cardMAC favoritos" onClick={goToFavoritos}>
                                    <div className="cardLeftMAC">
                                        <IonIcon icon={starOutline} className="iconMAC" />
                                        <h3 className="cardTitleMAC">Ver médicos favoritos</h3>
                                        <p className="cardDescriptionMAC">
                                            Accede rápidamente a los especialistas que has marcado como favoritos.
                                        </p>
                                    </div>
                                    <div className="cardRightMAC">
                                        <IonImg src="misMedicos.svg" alt="Médicos favoritos" className="cardImageMAC" />
                                    </div>
                                </div>

                                <div className="cardMAC recientes" onClick={goToRecientes}>
                                    <div className="cardLeftMAC">
                                        <IonIcon icon={timeOutline} className="iconMAC" />
                                        <h3 className="cardTitleMAC">Médicos visitados recientemente</h3>
                                        <p className="cardDescriptionMAC">
                                            Revisa especialistas con los que has interactuado últimamente.
                                        </p>
                                    </div>
                                    <div className="cardRightMAC">
                                        <IonImg src="recentDoctor.svg" alt="Médicos recientes" className="cardImageMAC" />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="buttonContainerMAC">
                            <IonButton
                                size="large"
                                expand="full"
                                shape="round"
                                className="buttonVolverMAC"
                                onClick={handleVolver}
                            >
                                <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                <span className="buttonTextMAC">Volver</span>
                            </IonButton>
                        </div>
                    </div>
                </IonContent>

                <MainFooter />
            </IonPage>
        </>
    );
}

export default MenuAgendaCita;