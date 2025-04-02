import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonPage, IonToast, IonToolbar } from "@ionic/react";
import React, { useRef, useState } from "react";
import "./RecuperaPassword.css";
import { atOutline, checkmarkCircleOutline, checkmarkOutline, exitOutline, lockOpenOutline, paperPlaneOutline, personOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { FormModeEnum, NotificationProps, VerificationCodeInputProps } from "./RecuperaPasswordInterfaces";


const RecuperaPassword: React.FC = () => {

    const [mode, setModeState] = useState<FormModeEnum>(() => {
        const savedMode = sessionStorage.getItem("recuperaPasswordMode");
        return (savedMode as FormModeEnum) || FormModeEnum.InsertDni;
    });

    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });


    const setMode = (newMode: FormModeEnum) => {
        setModeState(newMode);
        sessionStorage.setItem("recuperaPasswordMode", newMode);
    };

    const history = useHistory();

    const [form, setForm] = useState({
        dni: "",
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGoBackClick = () => {
        sessionStorage.removeItem("recuperaPasswordMode");
        if (document.referrer.includes('/lobby')) {
            history.go(-1); // Si la página anterior era /lobby, vuelve atrás
        } else {
            history.replace('/lobby'); // Si no, reemplaza la ruta actual
        }

    };

    const handleGoInicioSesion = () => {
        sessionStorage.removeItem("recuperaPasswordMode");
        history.replace('/SignIn')
    };

    const handleBuscaDni = () => {
        setMode(FormModeEnum.InsertCode);
        console.log(mode);
        //TODO LLamada backService para metodo exoistencia dni y regreso de email
    }

    //TODO
    const handleReenvioCodigo = () => { }
    const handleEstablecerPassword = () => {
        //Llamada Back
        const corecto = true
        if (corecto) {
            setToast({
                show: true,
                message: "¡Contraseña cambiada con éxito!",
                color: "success",
                icon: checkmarkOutline,
            });
        }
    }

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
                    {mode === FormModeEnum.InsertDni &&
                        <div className="formCardRP">
                            <span className="infoTextRP">
                                Introduce tu DNI para verificar si tienes una cuenta registrada.
                                Si es así, enviaremos un código de recuperación al correo electrónico asociado a tu cuenta,
                                para que puedas continuar.
                            </span>
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
                                    ¿Recordaste tu contraseña? Inicia sesión
                                </span>
                            </IonButton>
                        </div>
                    }

                    {mode === FormModeEnum.InsertCode &&
                        <div className="formCardRP">
                            <span className="infoTextRP">
                                Se ha enviado un código de verificación al correo *********. Por favor, introdúcelo para restablecer tu contraseña.
                            </span>
                            <VerificationCodeInput
                                onComplete={(code) => {
                                    console.log("Código recibido:", code);

                                    // Simulación de verificación
                                    const codigoEsperado = "1234"; // Cambia esto por el valor de prueba que tú quieras

                                    if (code === codigoEsperado) {
                                        alert("✅ Código correcto. Ahora puedes restablecer tu contraseña.");
                                        setMode(FormModeEnum.NewPassword);// Cambiar al siguiente paso si quieres
                                    } else {
                                        alert("❌ Código incorrecto. Inténtalo de nuevo.");
                                    }
                                }}
                            />


                            <IonButton
                                onClick={handleReenvioCodigo}
                                expand="block"
                                shape="round"
                                size="default"
                                className="ion-margin-top custom-button3RP"
                            >
                                <IonIcon icon={paperPlaneOutline} size="large" slot="icon-only"></IonIcon>
                                <span className="buttonTextRP">
                                    Reenviar código de verificación
                                </span>
                            </IonButton>
                        </div>
                    }

                    {mode === FormModeEnum.NewPassword &&
                        <div className="formCardRP">
                            <span className="infoTextRP">
                                Introduce tu nueva contraseña. Esta será la contraseña que quedará guardada en tu cuenta para futuros accesos.
                            </span>
                            <IonItem className="form-itemRP">
                                <label className="form-labelRP">Contraseña:</label>
                                <IonInput
                                    color={"success"}
                                    placeholder="Nueva contraseña"
                                    name="password"
                                    type="password"
                                    value={"form.password"}
                                    onIonChange={handleChange}
                                    clearInput={true}
                                />
                            </IonItem>

                            <IonItem className="form-itemRP">
                                <label className="form-labelRP">Confirmar contraseña:</label>
                                <IonInput
                                    color={"success"}
                                    name="confirmPassword"
                                    placeholder="Repite contraseña"
                                    type="password"
                                    value={"form.confirmPassword"}
                                    onIonChange={handleChange}
                                    clearInput={true}
                                />
                            </IonItem>

                            <IonButton
                                onClick={handleEstablecerPassword}
                                expand="block"
                                shape="round"
                                size="default"
                                className="ion-margin-top custom-buttonRP"
                            >
                                <IonIcon icon={lockOpenOutline} size="large" slot="icon-only"></IonIcon>
                                <span className="buttonTextRP">
                                    Establecer nueva contraseña
                                </span>
                            </IonButton>
                        </div>
                    }

                    {mode === FormModeEnum.Loading &&
                        <div className="formCardRP">
                            Pantalla Carga
                        </div>
                    }
                </div>
                <Notification
                    icon={toast.icon}
                    color={toast.color}
                    message={toast.message}
                    show={toast.show}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                />
            </IonContent>
        </IonPage >
    )
}





export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
    length = 4,
    onComplete,
}) => {

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (value: string, index: number) => {
        const input = inputsRef.current[index];
        if (!input) return;

        // Solo acepta números
        if (!/^\d$/.test(value)) {
            input.value = "";
            return;
        }

        // Mover al siguiente input
        if (index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }

        // Comprobar si el código está completo
        const code = inputsRef.current.map((input) => input?.value ?? "").join("");

        if (code.length === length && !code.split("").includes("")) {
            setTimeout(() => {
                onComplete?.(code);
            }, 0);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !inputsRef.current[index]?.value && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div className="code-input-wrapper">
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="code-input"
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    ref={(el) => (inputsRef.current[i] = el)}
                />
            ))}
        </div>
    );
}

export const Notification: React.FC<NotificationProps> = ({
    icon,
    color,
    message,
    show,
    onClose,
}) => {
    return (
        <IonToast
            icon={icon}
            color={color}
            isOpen={show}
            onDidDismiss={onClose}
            message={message}
            duration={2000}
            swipeGesture="vertical"
            buttons={[
                {
                    text: "Descartar",
                    role: "cancel",
                },
            ]}
        />
    );
};

export default RecuperaPassword;