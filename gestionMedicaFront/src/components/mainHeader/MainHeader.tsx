import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenuToggle,
    IonPopover,
    IonTitle
} from "@ionic/react";
import { logOutOutline, menuOutline, personCircleOutline } from "ionicons/icons";
import React, { useState } from "react";
import { operations } from "../../shared/operations";
import * as icons from 'ionicons/icons';
import "./MainHeader.css";
import { MainHeaderProps } from "./MainHeaderInterfaces";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from 'react-router-dom';

const MainHeader: React.FC<MainHeaderProps> = ({ tittle }) => {
    const [popoverEvent, setPopoverEvent] = useState<MouseEvent | null>(null);

    return (
        <>
            <IonHeader className="headerBar">
                <IonMenuToggle>
                    <IonButton shape="round" className="upperButton" size="large" fill="outline">
                        <IonIcon slot="icon-only" icon={menuOutline}></IonIcon>
                    </IonButton>
                </IonMenuToggle>

                <div className="principalBar">
                    <IonTitle size="large" className="tittleBarText">{tittle}</IonTitle>
                </div>

                <IonButton
                    shape="round"
                    className="upperButton"
                    size="large"
                    fill="outline"
                    onClick={(e) => setPopoverEvent(e.nativeEvent)}
                >
                    <IonIcon slot="icon-only" icon={personCircleOutline}></IonIcon>
                </IonButton>

                <UserMenu event={popoverEvent} onDismiss={() => setPopoverEvent(null)} />
            </IonHeader>
        </>
    );
};

interface UserMenuProps {
    event: MouseEvent | null;
    onDismiss: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ event, onDismiss }) => {
    const history = useHistory();
    const [showConfirm, setShowConfirm] = useState(false);
    const { logout } = useAuth();

    const logOut = () => {
        logout();
        window.location.replace('/lobby');
    };

    const handleOperation = (url: string) => {
        history.push(url);
        onDismiss();
    };

    const perfilOperations = operations.filter(op => op.type === "Perfil");

    return (
        <>
            <IonPopover
                isOpen={!!event}
                event={event!}
                onDidDismiss={onDismiss}
            >
                <IonContent>
                    <IonList>
                        {perfilOperations.map((operation, index) => (
                            <IonItem button={true} detail={false} key={index} onClick={() => handleOperation(operation.url)}>
                                <IonLabel>{operation.title}</IonLabel>
                                <IonIcon color="success" slot="end" icon={(icons as Record<string, string>)[operation.icon]}></IonIcon>
                            </IonItem>
                        ))}
                        <IonItem color="danger" button={true} detail={false} onClick={() => setShowConfirm(true)}>
                            <IonLabel>Cerrar sesión</IonLabel>
                            <IonIcon slot="end" icon={logOutOutline}></IonIcon>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonPopover>

            <DobleConfirmacion
                isOpen={showConfirm}
                tittle="Cerrar sesión"
                message="¿Estás seguro de que deseas cerrar sesión? Tu sesión se cerrará y deberás iniciar sesión nuevamente para continuar usando la aplicación."
                img="cerrarSesion.svg"
                onConfirm={logOut}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};

export default MainHeader;
