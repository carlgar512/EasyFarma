import { IonButton, IonContent, IonIcon, IonImg, IonInput, IonModal, IonSpinner } from "@ionic/react";
import { ModalPasswordCheckProps } from "./ModalPasswordCheckInterfaces";
import React, { useState } from "react";
import { alertCircleOutline, arrowForwardOutline, checkmarkOutline, closeOutline, eyeOff, eyeOutline, lockClosedOutline, warningOutline } from "ionicons/icons";
import './ModalPasswordCheck.css'
import { useUser } from "../../context/UserContext";
import { backendService } from "../../services/backendService";
import NotificationToast from "../notification/NotificationToast";

const ModalPasswordCheck: React.FC<ModalPasswordCheckProps> = ({ isOpen, setIsModalOpen, dni, onSuccess }) => {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { userData } = useUser();
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const checkPsw = async () => {
        if (!password.trim()) {
            setToast({
                show: true,
                message: "Por favor, introduce tu contraseña.",
                color: "warning",
                icon: warningOutline,
            });
            return;
        }
        setLoading(true);
        try {
            const response = await backendService.login({ dni: userData!.dni, password });

            if (!response.success) {
                setToast({
                    show: true,
                    message: "La contraseña introducida no es válida.",
                    color: "danger",
                    icon: alertCircleOutline,
                });
                setLoading(false);
            }
            else {
                setToast({
                    show: true,
                    message: "Autenticación realizada con exito",
                    color: "success",
                    icon: checkmarkOutline,
                });
                setPassword("");
                onSuccess();
                setLoading(false);
                setShowPassword(false);
            }

        } catch (error: any) {
            setToast({
                show: true,
                message: `Error al verificar contraseña: ${error.message || error}`,
                color: "danger",
                icon: alertCircleOutline,
            });
            setLoading(false);
        }
    };

    return (
        <>

            <IonModal isOpen={isOpen} onDidDismiss={() => { setIsModalOpen(false); setPassword(""); setShowPassword(false);}}>
                {loading ? (
                    <IonContent className="ion-padding">
                        <div className="modalContainerPw">
                        <div className="modalTittlePw">
                                <IonIcon icon={lockClosedOutline} size="large" />
                                <span className="modalTittlePW">Autenticación requerida</span>
                            </div>
                            <div className="SpinnerContainer">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="modalTextPW">Procesando autenticación, por favor espere...</span>
                            </div>
                        </div>
                    </IonContent>
                ) : (

                    <IonContent className="ion-padding">
                        <div className="modalContainerPw">
                            {/* Título */}
                            <div className="modalTittlePw">
                                <IonIcon icon={lockClosedOutline} size="large" />
                                <span className="modalTittlePW">Autenticación requerida</span>
                            </div>

                            {/* Texto + Imagen */}
                            <div className="modalBoddyPw">
                                <span className="modalTextPW">
                                    Por seguridad, debes volver a introducir tu contraseña para realizar esta acción.
                                </span>
                                <div className="ImgContainer">
                                    <IonImg className="imgModalPW" src="passwordForgot.svg" />
                                </div>
                            </div>

                            {/* Input */}

                            <div className="pwCheckInputContainer">

                                <IonInput
                                    placeholder="Introduce tu contraseña"
                                    className="form-inputPW"
                                    clearInput
                                    color={"success"}
                                    value={password}
                                    onIonChange={(e) => setPassword(e.detail.value!)}
                                    type={showPassword ? "text" : "password"}
                                />
                                <IonButton
                                    fill="clear"
                                    size="small"
                                    onClick={togglePasswordVisibility}
                                    color="success"
                                >
                                    {!showPassword ? <IonIcon icon={eyeOutline} size="large" /> : <IonIcon icon={eyeOff} size="large" />}
                                </IonButton>
                            </div>

                            {/* Botones */}
                            <div className="modalButtonContainerPw">
                                <IonButton className="buttonPW1" shape="round" onClick={checkPsw}>
                                    <IonIcon icon={arrowForwardOutline} />
                                    <span className="buttonTextPW">Continuar</span>
                                </IonButton>
                                <IonButton className="buttonPW2" shape="round" onClick={() => { setIsModalOpen(false); setPassword(""); setShowPassword(false); }}>
                                    <IonIcon icon={closeOutline} />
                                    <span className="buttonTextPW">Cerrar</span>
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                )}
            </IonModal>
            <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
        </>
    );
}

export default ModalPasswordCheck;