import React from "react";
import { useHistory } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonImg, IonPage } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { arrowBackOutline, searchOutline, starOutline, timeOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './MenuAgendaCita.css'

/**
 * Componente: MenuAgendaCita
 *
 * Descripción:
 * Este componente actúa como una pantalla de menú principal para la funcionalidad de búsqueda y selección
 * de médicos. Ofrece al usuario tres accesos directos para explorar los especialistas disponibles:
 * búsqueda general, médicos favoritos y médicos visitados recientemente.
 *
 * Funcionalidad:
 * - Permite redirigir al usuario a:
 *   • La búsqueda general por filtros (ubicación, especialidad, centro).
 *   • El listado de médicos marcados como favoritos.
 *   • El historial de médicos visitados recientemente.
 * - Ofrece un botón para regresar a la vista principal del usuario.
 *
 * Navegación:
 * - Utiliza `useHistory` de React Router para la gestión de rutas mediante `push` y `replace`.
 *
 * Elementos visuales:
 * - Cada opción está representada por una tarjeta informativa con un ícono, texto descriptivo e imagen ilustrativa.
 * - Incluye un botón de retorno visualmente accesible al pie del contenido.
 */
const MenuAgendaCita: React.FC = () => {

    /**
     * VARIABLES
     */
    const history = useHistory();

    /**
    * FUNCIONALIDAD
    */
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

    /**
     * RENDER
    */
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Busca y elige tu médico" />

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