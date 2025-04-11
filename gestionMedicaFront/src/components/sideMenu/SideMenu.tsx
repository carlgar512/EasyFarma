import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonMenu, IonMenuToggle } from "@ionic/react";
import { arrowBackOutline, logOutOutline } from "ionicons/icons";
import React, { useState } from "react";
import * as icons from 'ionicons/icons';
import { sortOperations } from "../../shared/interfaces/Operation";
import { operations } from "../../shared/operations";
import './SideMenu.css'

const SideMenu: React.FC = () => {
      const [orderOperationType, setOperation] = useState(sortOperations(operations, "type"));
    const logOut = () => {
        window.location.replace('/lobby'); // Reemplaza la URL actual y borra el historial
    };

    return (
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
                            <IonItem button>
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
                <IonItem button={true} onClick={logOut} >
                    <IonIcon color="danger" slot="start" ios={logOutOutline} size="large"></IonIcon>
                    <IonLabel>Cerrar sesión</IonLabel>
                </IonItem>
            </IonContent>
        </IonMenu>
    );
};

export default SideMenu;