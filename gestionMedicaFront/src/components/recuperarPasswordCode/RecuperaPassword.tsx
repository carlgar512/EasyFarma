import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonPage, IonSpinner, IonToast, IonToolbar } from "@ionic/react";
import React, { useRef, useState } from "react";
import "./RecuperaPassword.css";
import { alertCircleOutline, atOutline, checkmarkCircleOutline, checkmarkOutline, exitOutline, lockOpenOutline, paperPlaneOutline, personOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { FormModeEnum, NotificationProps, VerificationCodeInputProps } from "./RecuperaPasswordInterfaces";
import { backendService } from "../../services/backendService";


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
    const [email, setEmail] = useState("");
    const [formDni, setForm] = useState({
        dni: "",
    });
    const [formPassword, setFormPsw] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleChangePsw = (e: any) => {
        setFormPsw({ ...formPassword, [e.target.name]: e.target.value });
    };

    const handleChange = (e: any) => {
        setForm({ ...formDni, [e.target.name]: e.target.value });
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

    const handleBuscaDni = async () => {
        const dni = formDni.dni?.toUpperCase().trim(); // Normaliza el DNI
        // Validación: vacío o mal formato
        const dniRegex = /^[0-9]{8}[A-Za-z]$/;
        if (!dni || !dniRegex.test(dni)) {
            setToast({
                show: true,
                message: "Por favor, introduce un DNI válido.",
                color: "danger",
                icon: alertCircleOutline,
            });
            return;
        }

        try {
            setMode(FormModeEnum.Loading);

            const response = await backendService.recoveryRequest(formDni.dni);

            if (!response.success) {
                setToast({
                    show: true,
                    message: "No existe ninguna cuenta vinculada a ese DNI.",
                    color: "danger",
                    icon: alertCircleOutline,
                });
                setMode(FormModeEnum.InsertDni);
                return;
            }

            setEmail(response.email); // correo enmascarado
            setToast({
                show: true,
                message: "Hemos enviado un código de verificación. Puede tardar unos segundos en llegar al correo.",
                color: "success",
                icon: checkmarkOutline,
            });
            setMode(FormModeEnum.InsertCode);

        } catch (error) {
            console.error("Error al buscar DNI:", error);

            setToast({
                show: true,
                message: "Ocurrió un error al procesar tu solicitud. Intenta nuevamente.",
                color: "danger",
                icon: alertCircleOutline,
            });

            setMode(FormModeEnum.InsertDni);
        }
    };

    const handleCompruebaCodigo = async (code: string) => {
        console.log("Código recibido:", code);

        try {
            setMode(FormModeEnum.Loading);

            const response = await backendService.checkCode(code);

            if (!response.success) {
                setToast({
                    show: true,
                    message: "El código ingresado no es válido. Por favor, intenta nuevamente.",
                    color: "danger",
                    icon: alertCircleOutline,
                });
                setMode(FormModeEnum.InsertCode);
                return;
            }

            setToast({
                show: true,
                message: "Código verificado correctamente. Puedes establecer una nueva contraseña.",
                color: "success",
                icon: checkmarkOutline,
            });

            setMode(FormModeEnum.NewPassword);

        } catch (error) {
            console.error("Error al verificar el código:", error);
            setToast({
                show: true,
                message: "Ha ocurrido un error al verificar el código. Intenta nuevamente más tarde.",
                color: "danger",
                icon: alertCircleOutline,
            });
            setMode(FormModeEnum.InsertCode);
        }
    };

    const handleReenvioCodigo = () => { }

    const handleEstablecerPassword = async () => {
        const { password, confirmPassword } = formPassword;

        // Validación de campos
        if (!password || !confirmPassword || password !== confirmPassword) {
            setToast({
                show: true,
                message: "Las contraseñas no coinciden o hay campos vacíos. Por favor, revísalos.",
                color: "danger",
                icon: alertCircleOutline,
            });
            return;
        }

        try {
            setMode(FormModeEnum.Loading);

            const response = await backendService.passwordReset(formDni.dni, password);

            if (response.success) {
                setToast({
                    show: true,
                    message: "¡Contraseña cambiada con éxito!",
                    color: "success",
                    icon: checkmarkOutline,
                });

                handleGoInicioSesion();
            } else {
                throw new Error("Falló la operación");
            }
        } catch (error) {
            setToast({
                show: true,
                message: "Algo salió mal al cambiar tu contraseña. ¡Vuelve a intentarlo en unos segundos!",
                color: "danger",
                icon: alertCircleOutline,
            });
            setMode(FormModeEnum.NewPassword);
        }
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
                                    value={formDni.dni}
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
                                Se ha enviado un código de verificación al correo {email}. Por favor, introdúcelo para restablecer tu contraseña.
                            </span>
                            <VerificationCodeInput onComplete={handleCompruebaCodigo} />
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
                                    value={formPassword.password}
                                    onIonChange={handleChangePsw}
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
                                    value={formPassword.confirmPassword}
                                    onIonChange={handleChangePsw}
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
                            <IonSpinner name="circular" className="spinner"></IonSpinner>
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