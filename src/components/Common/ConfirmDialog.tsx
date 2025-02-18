import { IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonFooter } from "@ionic/react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;  // 👈 Permitir evento opcional
    onCancel:  () => void;   // 👈 Permitir evento opcional
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title = "Confirmar acción", message, onConfirm, onCancel }) => {
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onCancel}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonText>{message}</IonText>
            </IonContent>
            <IonFooter className="ion-padding">
                <IonButton expand="full" color="danger" onClick={onConfirm}>
                    Confirmar
                </IonButton>
                <IonButton expand="full" color="medium" onClick={onCancel}>
                    Cancelar
                </IonButton>
            </IonFooter>
        </IonModal>
    );
};

export default ConfirmDialog;
