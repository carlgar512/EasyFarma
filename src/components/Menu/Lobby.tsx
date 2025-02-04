import { IonButton, IonContent, IonIcon, IonImg, IonPage } from "@ionic/react";
import "./Lobby.css";
import { callOutline, personAddOutline, personOutline } from "ionicons/icons";

const Lobby: React.FC = () => {
    return (
        <IonPage>

            <IonContent fullscreen className="ion-padding lobby-container">
                <div className="lobbyScreen">
                    <IonImg className="logo"
                        src="/EasyFarmaLogo.png"
                        alt="Logo de EasyFarma"
                    ></IonImg>
                    <div className="button-group">

                        <IonButton size="large" expand="full" shape="round" className="login-btn">
                            <IonIcon slot="start" icon={personOutline}></IonIcon>
                            Iniciar Sesión
                        </IonButton>
                        <IonButton size="large" expand="full" shape="round" className="register-btn">
                            <IonIcon slot="start" icon={personAddOutline}></IonIcon>
                            Registrarse
                        </IonButton>
                        <IonButton size="large" expand="full" shape="round" className="emergency-btn">
                            <IonIcon slot="start" icon={callOutline}></IonIcon>
                            Emergencia
                        </IonButton>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default Lobby;