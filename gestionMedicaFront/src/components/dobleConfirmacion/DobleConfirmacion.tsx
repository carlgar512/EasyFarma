import { IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonFooter, IonImg, IonIcon } from "@ionic/react";
import "./DobleConfirmacion.css";
import { warningOutline } from "ionicons/icons";
import React from "react";
import { DobleConfirmacionProps } from "./DobleConfirmacionInterfaces";

/**
 * Componente DobleConfirmacion
 * Modal reutilizable que solicita una confirmación final antes de realizar acciones sensibles o destructivas.
 * Incluye:
 * - Título e ícono de advertencia
 * - Mensaje informativo
 * - Imagen decorativa
 * - Botones para confirmar o cancelar la acción
 */
const DobleConfirmacion: React.FC<DobleConfirmacionProps> = ({ isOpen, tittle, message, img, onConfirm, onCancel }) => {

    /**
     * RENDER
     */
    return (
        <IonModal isOpen={isOpen} onDidDismiss={() => onCancel()} >
            <IonHeader>
                <IonToolbar>
                    <div className="dialogTittleContainer">
                        <IonIcon color="warning" size="large" icon={warningOutline}></IonIcon>
                        <IonTitle className="dialogTittle">{tittle}</IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="dialogContainer">
                    <IonText className="dialogText">{message}</IonText>
                    <div className="imgContainer">
                        <IonImg className="dialogImg" src={img} />
                    </div>
                </div>
            </IonContent>
            <IonFooter className="ion-padding">
                <IonButton className="confirmButton" shape="round" expand="block" onClick={onConfirm}>
                    Confirmar
                </IonButton>
                <IonButton className="cancelButton" shape="round" expand="block" color="danger" onClick={onCancel}>
                    Cancelar
                </IonButton>
            </IonFooter>
        </IonModal>
    );
};

export default DobleConfirmacion;
