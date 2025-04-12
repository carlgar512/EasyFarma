import { IonButton, IonContent, IonIcon, IonImg, IonInput, IonModal } from "@ionic/react";
import { ModalPasswordCheckProps } from "./ModalPasswordCheckInterfaces";
import React, { useState } from "react";
import { arrowForwardOutline, closeOutline, eyeOff, eyeOutline, lockClosedOutline } from "ionicons/icons";
import './ModalPasswordCheck.css'

const ModalPasswordCheck: React.FC<ModalPasswordCheckProps> = ({ isOpen, setIsModalOpen }) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const checkPsw = () => {
        //TODO Back envia dni y Psw
    };

    return (
        <IonModal  isOpen={isOpen} onDidDismiss={() => setIsModalOpen(false)}>
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
                        <IonButton className="buttonPW2" shape="round" onClick={() => setIsModalOpen(false)}>
                            <IonIcon icon={closeOutline} />
                            <span className="buttonTextPW">Cerrar</span>
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonModal>
    );
}

export default ModalPasswordCheck;