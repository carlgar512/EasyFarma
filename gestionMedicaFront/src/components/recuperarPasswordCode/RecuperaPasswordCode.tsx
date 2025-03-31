import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonPage, IonToolbar } from "@ionic/react";
import React, { useState } from "react";
import "./RecuperaPasswordCode.css";
import { atOutline, exitOutline, paperPlaneOutline, personOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";


const RecuperaPasswordCode: React.FC = () => {

    const history = useHistory();

    const [form, setForm] = useState({
        dni: "",
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGoBackClick = () => {

        if (document.referrer.includes('/lobby')) {
            history.go(-1); // Si la página anterior era /lobby, vuelve atrás
        } else {
            history.replace('/lobby'); // Si no, reemplaza la ruta actual
        }

    };

    const handleBuscaDni = () => {
        //TODO LLamada backService para metodo exoistencia dni y regreso de email
    }

    const handleGoInicioSesion = () => {
        history.replace('/SignIn')
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="top-BarBackgroundRP">
                    <div className="topBarRP">
                        <div className="left-contentRP">
                            <IonIcon icon={atOutline} size="large" color="#0f2a1d"></IonIcon>
                            <span className="titleRP">Recuperar contraseña</span>
                        </div>
                        <IonButton color="danger" className="leaveButtonRP" onClick={handleGoBackClick}>
                            <IonIcon slot="icon-only" ios={exitOutline}></IonIcon>
                        </IonButton>

                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="contentRP">
                <div className="form-containerRP">
                     <IonImg className="sesImgRP" src="/forgotPassword.svg"></IonImg>
                    <div className="formCardRP">
                        <span className="infoTextRP">Introduce tu DNI para verificar si tienes una cuenta registrada. 
                            Si es así, te enviaremos un código de recuperación al correo electrónico asociado a tu cuenta,
                             para que puedas continuar con el proceso de restablecimiento de contraseña.</span>
                        <IonItem className="form-itemRP">
                            <label className="form-labelRP">DNI:</label>
                            <IonInput
                                color={"success"}
                                placeholder="Escribe tu DNI"
                                name="dni"
                                value={form.dni}
                                onIonChange={handleChange}
                                clearInput={true}
                            />
                        </IonItem>

                        <IonButton
                            expand="block"
                            shape="round"
                            size="default"
                            className="ion-margin-top custom-buttonRP"
                            onClick={handleBuscaDni}
                        >
                            <IonIcon icon={paperPlaneOutline} size="large" slot="icon-only"></IonIcon>
                            <span className="buttonTextRP">
                                Buscar DNI y enviar código
                            </span>
                        </IonButton>

                        <IonButton
                            onClick={handleGoInicioSesion}
                            expand="block"
                            shape="round"
                            size="default"
                            className="ion-margin-top custom-button2RP"
                        >
                            <IonIcon icon={personOutline} size="large" slot="icon-only"></IonIcon>
                            <span className="buttonTextRP">
                                ¿No esta registrado?, Nueva cuenta
                            </span>
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default RecuperaPasswordCode;