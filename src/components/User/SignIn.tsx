import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonPage, IonToast, IonToolbar } from "@ionic/react";
import { alertCircleOutline, checkmarkOutline, exitOutline, personAddOutline, personOutline } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./SignIn.css";


const SignIn: React.FC = () => {


    const [form, setForm] = useState({
        dni: "",
        password: "",
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [isSuccessToast, setIsSuccessToast] = useState(false); 

    const history = useHistory();
    const handleRegisterClick = () => {
        history.replace('/register')
      };
    
    const handleGoBackClick = () => {

        if (document.referrer.includes('/lobby')) {
            history.go(-1); // Si la página anterior era /lobby, vuelve atrás
        } else {
            history.replace('/lobby'); // Si no, reemplaza la ruta actual
        }

    };
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!form.dni || !form.password) {
            console.log(form);
            setToastMessage("Todos los campos son obligatorios");
            setIsSuccessToast(false);
            setShowToast(true);
            return;
        }

        console.log("Iniciando sesion...", form);
        setToastMessage("Sesión iniciada correctamente");
        setIsSuccessToast(true);
        setShowToast(true);
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="top-BarBackgroundSes">
                    <div className="topBarSes">
                        <div className="left-contentSes">
                            <IonIcon icon={personOutline} size="large" color="#0f2a1d"></IonIcon>
                            <span className="titleSes">Bienvenido de nuevo, te estábamos esperando</span>
                        </div>
                        <IonButton color="danger" className="leaveButtonSes" onClick={handleGoBackClick}>
                            <IonIcon slot="icon-only" ios={exitOutline}></IonIcon>
                        </IonButton>

                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="contentSes">
                <div className="form-containerSes">
                    <div className="form-cardSes">
                        <IonItem className="form-itemSes">
                            <label className="form-labelSes">DNI:</label>
                            <IonInput
                                color={"success"}
                                placeholder="Escribe tu DNI"
                                name="dni"
                                value={form.dni}
                                onIonChange={handleChange}
                                clearInput={true}
                            />
                        </IonItem>
                        <IonItem className="form-item">
                            <label className="form-label">Contraseña:</label>
                            <IonInput
                                color={"success"}
                                placeholder="Contraseña"
                                name="password"
                                type="password"
                                value={form.password}
                                onIonChange={handleChange}
                                clearInput={true}
                            />
                        </IonItem>
                        <IonButton
                            expand="block"
                            shape="round"
                            size="default"
                            className="ion-margin-top custom-buttonSes"
                            onClick={handleSubmit}
                        >
                            <IonIcon icon={personOutline} slot="start"></IonIcon>
                           Iniciar sesion
                        </IonButton>

                        <IonButton
                            onClick={handleRegisterClick}
                            expand="block"
                            shape="round"
                            size="default"
                            className="ion-margin-top custom-button2Ses"
                        >
                            <IonIcon icon={personAddOutline} slot="start"></IonIcon>
                            ¿No esta registrado?, Crear nueva cuenta
                        </IonButton>

                        <IonToast
                            icon={isSuccessToast ? checkmarkOutline : alertCircleOutline} // Cambia icono dinámicamente
                            color={isSuccessToast ? "success" : "danger"} // Cambia color dinámicamente
                            isOpen={showToast}
                            onDidDismiss={() => setShowToast(false)}
                            message={toastMessage}
                            duration={2000}
                            swipeGesture="vertical"
                            buttons={[
                                {
                                    text: 'Descartar',
                                    role: 'cancel',
                                },
                            ]}
                        />

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};
export default SignIn;