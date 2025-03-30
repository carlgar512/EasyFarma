import { IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonFooter, IonImg, IonIcon } from "@ionic/react";
import "./DobleConfirmacion.css";
import { warningOutline } from "ionicons/icons";
import React from "react";
import { DobleConfirmacionProps } from "./DobleConfirmacionInterfaces";


const DobleConfirmacion: React.FC<DobleConfirmacionProps> = ({ isOpen, title = "Confirmar acción", message, img, onConfirm, onCancel }) => {
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onCancel} >
            <IonHeader>
                <IonToolbar>
                    <div className="dialogTittleContainer">
                        <IonIcon color="warning" size="large" icon={warningOutline}></IonIcon>
                        <IonTitle className="dialogTittle">{title}</IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="dialogContainer">
                    <IonText className="dialogText">{message}</IonText>
                    <IonImg className="dialogImg" src={img} />
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
