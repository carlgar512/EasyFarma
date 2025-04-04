import { IonToast } from "@ionic/react";
import React from "react";
import { NotificationToastProps } from "./NotificationToastInterfaces";


export const NotificationToast: React.FC<NotificationToastProps> = ({
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

export default NotificationToast;