import { IonAlert, IonButton, IonContent, IonIcon, IonImg, IonPage } from "@ionic/react";
import "./Lobby.css";
import { callOutline, personAddOutline, personOutline } from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import React from "react";
import { TELEFONOS } from "../../shared/telefonos";

/**
 * Componente Lobby
 * Pantalla principal de bienvenida que permite al usuario acceder al inicio de sesión, registro o realizar una llamada de emergencia.
 * Detecta si el usuario está en un dispositivo móvil para habilitar llamadas, y ofrece una interfaz centrada y adaptable.
 */
const Lobby: React.FC = () => {

    /**
     * VARIABLES
     */
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    
    /**
     * FUNCIONALIDAD
     */
    const handleRegisterClick = () => {
        history.push('/register');
    };
    const handleSignInClick = () => {
        history.push('/signIn');
    };
    useEffect(() => {
        history.replace("/lobby"); // Reemplaza la historia actual con /lobby
    }, [history]);

    //TODO probar en telf y cambiar numero
    const handleEmergencyCall = () => {
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
            window.location.href = `tel:${TELEFONOS.EMERGENCIA}`;
        } else {
            setShowAlert(true);
        }
    };

    /**
     * RENDER
     */
    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding lobby-container">
                <div className="lobbyScreen">
                    <IonImg className="logo"
                        src="/EasyFarmaLogo.png"
                        alt="Logo de EasyFarma"
                    ></IonImg>
                    <div className="button-groupLobby">
                        <IonButton size="large" expand="full" shape="round" className="login-btn" onClick={handleSignInClick}>
                            <IonIcon slot="start" icon={personOutline}></IonIcon>
                            <span className="buttonTextLobby">Iniciar Sesión</span>
                        </IonButton>
                        <IonButton size="large" expand="full" shape="round" className="register-btn" onClick={handleRegisterClick}>
                            <IonIcon slot="start" icon={personAddOutline}></IonIcon>
                            <span className="buttonTextLobby">Registrarse</span>
                        </IonButton>
                        <IonButton size="large" expand="full" shape="round" className="emergency-btn" onClick={handleEmergencyCall}>
                            <IonIcon slot="start" icon={callOutline}></IonIcon>
                            <span className="buttonTextLobby">Emergencia</span>
                        </IonButton>
                    </div>
                </div>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Llamada no disponible"
                    message={`Esta función solo está disponible en dispositivos móviles. Llame manualmente a ${TELEFONOS.EMERGENCIA_VISIBLE}.`}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default Lobby;