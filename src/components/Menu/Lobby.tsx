import { IonButton, IonContent, IonIcon, IonImg, IonPage } from "@ionic/react";
import "./Lobby.css";
import { callOutline, personAddOutline, personOutline } from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import { useEffect } from "react";

const Lobby: React.FC = () => {
    const history = useHistory();

    const handleRegisterClick = () => {
        history.push('/register');
    };
    const handleSignInClick = () => {
        history.push('/signIn');
    };
    useEffect(() => {
        history.replace("/lobby"); // Reemplaza la historia actual con /lobby
    }, [history]);
  
    const handleEmergencyCall = () => {
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
          window.location.href = 'tel:+34679761132';
        } else {
          alert("Esta función solo está disponible en dispositivos móviles. Llame al +1234567890 si necesita asistencia.");
        }
      };
      
    return (
        <IonPage>

            <IonContent fullscreen className="ion-padding lobby-container">
                <div className="lobbyScreen">
                    <IonImg className="logo"
                        src="/EasyFarmaLogo.png"
                        alt="Logo de EasyFarma"
                    ></IonImg>
                    <div className="button-group">

                        <IonButton size="large" expand="full" shape="round" className="login-btn" onClick={handleSignInClick}>
                            <IonIcon slot="start" icon={personOutline}></IonIcon>
                            Iniciar Sesión
                        </IonButton>
                        <IonButton size="large" expand="full" shape="round" className="register-btn" onClick={handleRegisterClick}>
                            <IonIcon slot="start" icon={personAddOutline}></IonIcon>
                            Registrarse
                        </IonButton>
                        <IonButton size="large" expand="full" shape="round" className="emergency-btn" onClick={handleEmergencyCall}>
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