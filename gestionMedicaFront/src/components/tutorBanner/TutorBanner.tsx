import { IonButton, IonIcon } from "@ionic/react";
import { eyeOutline, logOutOutline } from "ionicons/icons";
import React, { useState } from "react";
import './TutorBanner.css'
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";

/**
 * Gestión de sesiones tuteladas e infantiles

Este contexto (`UserProvider`) ha sido adaptado para soportar la gestión de múltiples tipos de usuario:
- El usuario principal (tutor)
- El usuario infantil (cuenta tutelada)

¿Qué se ha hecho?
1. Al hacer `setUserData(...)`, los datos del usuario actual se guardan automáticamente en `localStorage`.
2. Al acceder a una cuenta infantil, se guarda el `userData` del tutor como `tutorData`, y se reemplaza el `userData` por el del menor.
3. En el montaje del `UserProvider`, si `localStorage.userData` ya existe, se usa como fuente inicial y se evita llamar al backend.
4. Al volver a la cuenta del tutor, se recupera `tutorData` desde `localStorage`, se hace `setUserData(...)` y se borra la copia.

Esto permite cambiar dinámicamente entre cuentas sin perder el estado, y mantener la sesión activa tras recargas o navegación, sin depender de la API para cada cambio.

Nota:
- El `useAuth` sigue determinando el `user.uid`, pero `userData` puede cambiarse manualmente por necesidades del flujo (como supervisión infantil).
*/


const TutorBanner: React.FC = () => {

    /**
     * VARIABLES
     */
    const { userData, setUserData } = useUser();
    const { logout } = useAuth();
     const [dialogState, setDialogState] = useState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    

    /**
     * FUNCIONALIDAD
     */

    const cerrarDialogo = () => {
        setDialogState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    };

    const handleReturnToMainAccountDoubleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Volver a la cuenta principal",
            message: "¿Estás seguro de que quieres volver a la cuenta principal? Al hacerlo, abandonarás temporalmente la gestión de esta cuenta tutelada.",
            img: "cerrarSesion.svg",
            onConfirm: () => handleReturnToMainAccount(),
        });
    }

    const handleReturnToMainAccount = () => {
        cerrarDialogo();
        const tutorData = localStorage.getItem('tutorData');

        if (!tutorData) {
            console.warn('No hay datos del tutor guardados');
            logout();
            window.location.replace('/lobby');
            return;
        }

        const parsedTutor = JSON.parse(tutorData);
        localStorage.removeItem('tutorData');
        setUserData(parsedTutor);

        window.location.replace('/principal');
    };

    /**
     * RENDER
     */
    return (
        <div className="tutor-banner">
            <IonIcon icon={eyeOutline} className="tutor-icon" />
            <div className="tutor-text">
                <strong>Modo tutor:</strong>
                <span>{userData?.nombreUsuario} {userData?.apellidosUsuario}</span>
            </div>
            <IonButton
                className="tutor-exit-btn"
                size="small"
                onClick={handleReturnToMainAccountDoubleCheck}
            >
                <IonIcon icon={logOutOutline} slot="start" />
                Salir
            </IonButton>
            <DobleConfirmacion
                isOpen={dialogState.isOpen}
                tittle={dialogState.tittle}
                message={dialogState.message}
                img={dialogState.img}
                onConfirm={dialogState.onConfirm}
                onCancel={() => cerrarDialogo()}
            />
        </div>
    );
};

export default TutorBanner;