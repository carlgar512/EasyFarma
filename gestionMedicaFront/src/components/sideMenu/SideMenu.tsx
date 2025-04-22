import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonMenu, IonMenuToggle } from "@ionic/react";
import { arrowBackOutline, logOutOutline } from "ionicons/icons";
import React, { useState } from "react";
import * as icons from 'ionicons/icons';
import { sortOperations } from "../../shared/interfaces/Operation";
import { operations } from "../../shared/operations";
import './SideMenu.css'
import { useAuth } from "../../context/AuthContext";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { useHistory } from 'react-router-dom';

const SideMenu: React.FC = () => {
    
    const [isDoubleConfOpen, setDoubleConfOpen] = useState(false);
    const { logout } = useAuth();
    const [orderOperationType, setOperation] = useState(sortOperations(operations, "type"));
    const logOut = () => {
        setDoubleConfOpen(false);
        logout();
        window.location.replace('/lobby'); // Reemplaza la URL actual y borra el historial
    };
    const history = useHistory();
    const handleOperation = (url: string) => {
        history.push(url);
    }

    return (
        <>
            <IonMenu className="sideMenu" type="overlay" contentId="main-content">
                <IonHeader>
                    <IonMenuToggle>
                        <IonButton fill="clear" color="success">
                            <IonIcon slot="icon-only" ios={arrowBackOutline}></IonIcon>
                        </IonButton>
                    </IonMenuToggle>
                </IonHeader>
                <IonContent className="ion-padding">

                    {orderOperationType.map((operation, index) => {
                        // Verificar si es el primer elemento o si el tipo ha cambiado
                        const isFirstOfType = index === 0 || operation.type !== orderOperationType[index - 1].type;

                        return (
                            <div key={index}>
                                {/* Encabezado solo cuando cambia el tipo */}
                                {isFirstOfType &&
                                    <IonItem button={false}>
                                        <IonLabel
                                            color={"medium"}
                                            className="menuHeader">
                                            <h1>{operation.type}</h1>
                                        </IonLabel>
                                    </IonItem>

                                }

                                {/* Renderización de la operación */}
                                <IonItem button onClick={() => handleOperation(operation.url)}>
                                    <IonIcon
                                        color="success"
                                        slot="start"
                                        icon={(icons as Record<string, string>)[operation.icon]}
                                        size="large"
                                    />
                                    <IonLabel >{operation.title}</IonLabel>
                                </IonItem>
                            </div>
                        );
                    })}
                    <IonItem button={true} onClick={() => setDoubleConfOpen(true)} >
                        <IonIcon color="danger" slot="start" ios={logOutOutline} size="large"></IonIcon>
                        <IonLabel>Cerrar sesión</IonLabel>
                    </IonItem>
                </IonContent>
            </IonMenu>
            <DobleConfirmacion
                isOpen={isDoubleConfOpen}
                tittle="Cerrar sesión"
                message="¿Estás seguro de que deseas cerrar sesión? Tu sesión se cerrará y deberás iniciar sesión nuevamente para continuar usando la aplicación."
                img="cerrarSesion.svg"
                onConfirm={logOut}
                onCancel={() => setDoubleConfOpen(false)}
            />
        </>
    );
};

export default SideMenu;