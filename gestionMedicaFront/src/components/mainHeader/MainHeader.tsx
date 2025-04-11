import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuToggle, IonPopover, IonTitle } from "@ionic/react";
import { logOutOutline, menuOutline, personCircleOutline } from "ionicons/icons";
import React from "react";
import { operations } from "../../shared/operations";
import * as icons from 'ionicons/icons';
import "./MainHeader.css";
import { MainHeaderProps } from "./MainHeaderInterfaces";

const MainHeader: React.FC<MainHeaderProps> = ({ tittle }) => {

    return (
        <IonHeader className="headerBar">
            <IonMenuToggle>
                <IonButton shape="round" className="upperButton" size="large" fill="outline">
                    <IonIcon slot="icon-only" icon={menuOutline}></IonIcon>
                </IonButton>
            </IonMenuToggle>
            <div className="principalBar">
                <IonTitle size="large" className="tittleBarText">{tittle}</IonTitle>
            </div>
            <IonButton shape="round" className="upperButton" size="large" fill="outline" id="Userpopover-button">
                <IonIcon slot="icon-only" icon={personCircleOutline}></IonIcon>
            </IonButton>
            <UserMenu />
        </IonHeader>
    );
};



const UserMenu: React.FC = () => {
    const logOut = () => {
        window.location.replace('/lobby'); // Reemplaza la URL actual y borra el historial
    };

    const perfilOperations = operations.filter(op => op.type === "Perfil");
    //TODO meter las posibles opciones.
    return (

        <IonPopover trigger="Userpopover-button" dismissOnSelect={true}>
            <IonContent>
                <IonList>
                    {perfilOperations.map((operation, index) => (
                        <IonItem button={true} detail={false} key={index}>
                            <IonLabel>{operation.title}</IonLabel>
                            <IonIcon color="success" aria-hidden={true} slot="end" icon={(icons as Record<string, string>)[operation.icon]}></IonIcon>
                        </IonItem>
                    ))}
                    <IonItem color="danger" button={true} detail={false} onClick={logOut} >
                        <IonLabel>Cerrar sesión</IonLabel>
                        <IonIcon aria-hidden={true} slot="end" ios={logOutOutline}></IonIcon>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPopover>

    );
};

export default MainHeader;