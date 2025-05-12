import { IonButton, IonIcon } from "@ionic/react";
import { eyeOutline, logOutOutline } from "ionicons/icons";
import React from "react";
import './TutorBanner.css'
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";

const TutorBanner: React.FC = () => {
    const { userData, setUserData } = useUser();
     const { logout } = useAuth();


    const handleReturnToMainAccount = () => {
        const tutorData = localStorage.getItem('tutorData');

        if (!tutorData) {
            console.warn('No hay datos del tutor guardados');
            logout();
            window.location.replace('/lobby');
            return;
        }

        const parsedTutor = JSON.parse(tutorData);
        localStorage.removeItem('tutorData');
        setUserData(parsedTutor);

        window.location.replace('/principal');
    };

    return (
        <div className="tutor-banner">
            <IonIcon icon={eyeOutline} className="tutor-icon" />
            <div className="tutor-text">
                <strong>Modo tutor:</strong>
                <span>{userData?.nombreUsuario} {userData?.apellidosUsuario}</span>
            </div>
            <IonButton
                className="tutor-exit-btn"
                size="small"
                onClick={handleReturnToMainAccount}
            >
                <IonIcon icon={logOutOutline} slot="start" />
                Salir
            </IonButton>
        </div>
    );
};

export default TutorBanner;