import { IonToast } from "@ionic/react";
import React from "react";
import { NotificationToastProps } from "./NotificationToastInterfaces";

/**
 * Componente NotificationToast
 * Toast reutilizable para mostrar mensajes de notificación breves al usuario.
 * Acepta icono, color, mensaje y control de visibilidad desde el componente padre.
 * Incluye botón "Descartar" y cierre automático tras 2 segundos.
 */
export const NotificationToast: React.FC<NotificationToastProps> = ({
    icon,
    color,
    message,
    show,
    onClose,
}) => {
    /**
     * RENDER
     */
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