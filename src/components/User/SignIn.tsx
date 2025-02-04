import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonToolbar } from "@ionic/react";
import { exitOutline,  personOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";


const SignIn: React.FC = () => {
    const history = useHistory();
    const handleGoBackClick = () => {

        if (document.referrer.includes('/lobby')) {
          history.go(-1); // Si la página anterior era /lobby, vuelve atrás
        } else {
          history.replace('/lobby'); // Si no, reemplaza la ruta actual
        }
    
      };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="top-BarBackground">
                    <div className="topBar">
                        <div className="left-content">
                            <IonIcon icon={personOutline} size="large" color="#0f2a1d"></IonIcon>
                            <span className="title">Bienvenido de nuevo, te estábamos esperando</span>
                        </div>
                        <IonButton color="danger" className="leaveButton" onClick={handleGoBackClick}>
                            <IonIcon slot="icon-only" ios={exitOutline}></IonIcon>
                        </IonButton>

                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="content">
                <div className="form-container">
                    <div className="form-card">

                        Hola

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};
export default SignIn;