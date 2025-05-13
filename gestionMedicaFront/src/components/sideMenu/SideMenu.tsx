import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle } from "@ionic/react";
import { arrowBackOutline, logOutOutline } from "ionicons/icons";
import React, { useState } from "react";
import * as icons from 'ionicons/icons';
import { sortOperations } from "../../shared/interfaces/Operation";
import { operations } from "../../shared/operations";
import './SideMenu.css'
import { useAuth } from "../../context/AuthContext";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { useHistory } from 'react-router-dom';
import { menuController } from "@ionic/core";

/**
 * Componente SideMenu
 * Menú lateral de navegación con operaciones agrupadas por tipo.
 * Permite navegar por las secciones de la app, mostrar badges personalizados y cerrar sesión con confirmación doble.
 */
const SideMenu: React.FC = () => {

    /**
     * VARIABLES
     */
    const history = useHistory();
    const { logout } = useAuth();
    const [isDoubleConfOpen, setDoubleConfOpen] = useState(false);
    const [orderOperationType] = useState(sortOperations(operations, "type"));
   
    /**
      * FUNCIONALIDAD
      */

    // Cerrar sesión con confirmación
    const logOut = () => {
        setDoubleConfOpen(false);
        logout();
        window.location.replace('/lobby'); // Reemplaza la URL actual y borra el historial
    };
    
    // Navegar a una operación y cerrar el menú
    const handleOperation = async (url: string) => {
        await menuController.close("mainMenu");
        history.push(url);
    }

    // Mostrar badges dinámicos según la operación
    const getOperationBadge = (operationId: number): JSX.Element | null => {
        let badgeText = "";
        let badgeClass = "";

        switch (operationId) {
            case 2:
                badgeText = "Favoritos";
                badgeClass = "badge-yellow";
                break;
            case 15:
                badgeText = "Pendientes";
                badgeClass = "badge-yellow";
                break;
            case 3:
            case 8:
                badgeText = "Todos";
                badgeClass = "badge-grey";
                break;
            case 6:
                badgeText = "Activos";
                badgeClass = "badge-green";
                break;
            default:
                return null;
        }
        return <div className={`customBadge ${badgeClass}`} slot="end">{badgeText}</div>;
    };

    /**
      * RENDER
      */
    return (
        <>
            <IonMenu menuId="mainMenu" className="sideMenu" type="overlay" contentId="main-content">
                <IonHeader>
                    <IonMenuToggle>
                        <IonButton fill="clear" color="success">
                            <IonIcon slot="icon-only" icon={arrowBackOutline}></IonIcon>
                        </IonButton>
                    </IonMenuToggle>
                </IonHeader>

                <IonContent className="ion-padding">
                    <IonList>
                        {orderOperationType.map((operation, index) => {
                            const isFirstOfType = index === 0 || operation.type !== orderOperationType[index - 1].type;

                            return (
                                <div key={index}>
                                    {isFirstOfType && (
                                        <div className="titleSideMenu">
                                            <span color="medium" className="menuHeader">
                                                {operation.type}
                                            </span>
                                            <hr className="lineaSeparadora" />
                                        </div>

                                    )}

                                    <IonMenuToggle autoHide={true}>
                                        <IonItem button onClick={() => handleOperation(operation.url)}>
                                            <IonIcon
                                                color="success"
                                                slot="start"
                                                icon={(icons as Record<string, string>)[operation.icon]}
                                                size="large"
                                            />
                                            <IonLabel>{operation.title}</IonLabel>
                                            {getOperationBadge(operation.id)}
                                        </IonItem>
                                    </IonMenuToggle>
                                </div>
                            );
                        })}

                        <IonMenuToggle autoHide={true}>
                            <IonItem button onClick={() => setDoubleConfOpen(true)}>
                                <IonIcon color="danger" slot="start" icon={logOutOutline} size="large" />
                                <IonLabel>Cerrar sesión</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                    </IonList>
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