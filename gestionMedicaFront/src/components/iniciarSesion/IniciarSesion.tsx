import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonPage, IonSpinner, IonToolbar } from "@ionic/react";
import { alertCircleOutline, atOutline, checkmarkOutline, exitOutline, eyeOff, eyeOutline, personAddOutline, personOutline } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./IniciarSesion.css";

import React from "react";
import { backendService } from "../../services/backendService";
import NotificationToast from "../notification/NotificationToast";
import { useAuth } from "../../context/AuthContext"; // Ajusta el path si es necesario

/**
 * Componente IniciarSesion
 * Pantalla de inicio de sesión que permite al usuario autenticarse mediante DNI y contraseña.
 * Incluye validación, feedback visual (spinner y toast) y navegación hacia registro o recuperación de contraseña.
 */
const IniciarSesion: React.FC = () => {

    /**
     * VARIABLES
     */
    const { setAuth } = useAuth();
    const history = useHistory();
    const [loadSpinner, setLoadSpinner] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        dni: "",
        password: "",
    });
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    /**
     * FUNCIONALIDAD
     */
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = () => {
        history.replace('/register')
    };

    const handleRecuperarPassword = () => {
        history.replace('/passwordReset')
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

    const handleSubmit = async () => {
        const dni = form.dni?.toUpperCase().trim(); // Normaliza el DNI
        // Validación: vacío o mal formato
        const dniRegex = /^[0-9]{8}[A-Za-z]$/;
        if (!form.dni || !form.password) {
            showToast("Todos los campos son obligatorios", "danger", alertCircleOutline);
            return;
        }
        else if (!dniRegex.test(dni)) {
            showToast("Por favor, introduce un DNI válido.", "danger", alertCircleOutline);
            return;
        }
        setLoadSpinner(true);

        try {
            // Llamada a la API de login
            const response = await backendService.login({
                dni: dni,
                password: form.password,
            });

            setLoadSpinner(false);

            // Verifica la respuesta
            if (response.success) {
                if (response.user && response.token) {
                    setAuth(response.user, response.token);
                }
                showToast("Sesión iniciada correctamente", "success", checkmarkOutline);

                // Redirige al usuario después de un pequeño retraso
                setTimeout(() => {
                    history.replace("/principal");
                }, 1000);
            } else {
                showToast(`Error al iniciar sesión: ${response.error}`, "danger", alertCircleOutline);
            }
        } catch (error) {
            setLoadSpinner(false);
            console.error("Error en la solicitud de inicio de sesión:", error);
            showToast("Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo.", "danger", alertCircleOutline);
        }
    };

    const showToast = (message: string, color: string, icon: any) => {
        setToast({
            show: true,
            message,
            color,
            icon,
        });
    };

    /**
     *  RENDER
     */
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
            {loadSpinner ?
                <div className="content">
                    <div className="spinnerBackground">
                        <IonSpinner name="circular" className="spinner"></IonSpinner>
                        <span className="mensajeSpinner">Estamos preparando todo para ti... ¡Casi listo!</span>
                    </div>

                </div> :
                <IonContent fullscreen className="contentSes">
                    <div className="form-containerSes">
                        <IonImg className="sesImg" src="/signIn.svg"></IonImg>
                        <div className="form-cardSes">
                            <IonItem className="form-itemSes">
                                <label className="form-labelSes">DNI:</label>
                                <IonInput
                                    color={"success"}
                                    placeholder="Escribe tu DNI..."
                                    name="dni"
                                    value={form.dni}
                                    onIonChange={handleChange}
                                    clearInput={true}
                                    maxlength={9}
                                />
                            </IonItem>
                            <IonItem className="form-itemSes">
                                <label className="form-labelSes">Contraseña:</label>
                                <IonInput
                                    color={"success"}
                                    placeholder="Contraseña..."
                                    name="password"
                                    type={showPassword ? "text" : "password"} // Alterna entre 'text' y 'password'
                                    value={form.password}
                                    onIonChange={handleChange}
                                    clearInput={true}
                                />
                                <IonButton
                                    fill="clear"
                                    size="small"
                                    onClick={togglePasswordVisibility}
                                    color="success"
                                >
                                    {!showPassword ? <IonIcon icon={eyeOutline} size="large" /> : <IonIcon icon={eyeOff} size="large" />}
                                </IonButton>
                            </IonItem>
                            <IonButton
                                expand="block"
                                shape="round"
                                size="default"
                                className="ion-margin-top custom-buttonSes"
                                onClick={handleSubmit}
                            >
                                <IonIcon icon={personOutline} size="large" slot="icon-only"></IonIcon>
                                <span className="buttonText">
                                    Iniciar sesion
                                </span>
                                <span className="buttonTextMobile">
                                    Iniciar sesion
                                </span>
                            </IonButton>

                            <IonButton
                                onClick={handleRegister}
                                expand="block"
                                shape="round"
                                size="default"
                                className="ion-margin-top custom-button2Ses"
                            >
                                <IonIcon icon={personAddOutline} size="large" slot="icon-only"></IonIcon>
                                <span className="buttonText">
                                    ¿No esta registrado?, Nueva cuenta
                                </span>
                                <span className="buttonTextMobile">
                                    Nueva cuenta
                                </span>
                            </IonButton>

                            <IonButton
                                onClick={handleRecuperarPassword}
                                expand="block"
                                shape="round"
                                size="default"
                                className="ion-margin-top custom-button3Ses"
                            >
                                <IonIcon icon={atOutline} size="large" slot="icon-only"></IonIcon>
                                <span className="buttonText">
                                    ¿Olvidaste la contraseña?, Recuperar contraseña
                                </span>
                                <span className="buttonTextMobile">
                                    Recuperar contraseña
                                </span>
                            </IonButton>
                            <NotificationToast
                                icon={toast.icon}
                                color={toast.color}
                                message={toast.message}
                                show={toast.show}
                                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                            />

                        </div>
                    </div>
                </IonContent>
            }
        </IonPage>
    );
};
export default IniciarSesion;