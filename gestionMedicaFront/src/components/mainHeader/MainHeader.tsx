import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuToggle, IonPopover, IonTitle } from "@ionic/react";
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
                <IonButton shape="round" className="upperButton" size="large" fill="outline" id="Userpopover-button">
                    <IonIcon slot="icon-only" icon={personCircleOutline}></IonIcon>
                </IonButton>
                <UserMenu />
            </IonHeader>
        </>

    );
};

const UserMenu: React.FC = () => {
    const history = useHistory();
    const [showConfirm, setShowConfirm] = useState(false);
    const {logout} = useAuth();
    const logOut = () => {
        logout();
        window.location.replace('/lobby'); // Reemplaza la URL actual y borra el historial
    };

    const handleOperation = (url: string) => {
        history.push(url);
    }
    

    const perfilOperations = operations.filter(op => op.type === "Perfil");
    //TODO meter las posibles opciones.
    return (
        <>
            <IonPopover trigger="Userpopover-button" dismissOnSelect={true}>
                <IonContent>
                    <IonList>
                        {perfilOperations.map((operation, index) => (
                            <IonItem button={true} detail={false} key={index} onClick={()=> handleOperation(operation.url)}>
                                <IonLabel>{operation.title}</IonLabel>
                                <IonIcon color="success" aria-hidden={true} slot="end" icon={(icons as Record<string, string>)[operation.icon]}></IonIcon>
                            </IonItem>
                        ))}
                        <IonItem color="danger" button={true} detail={false} onClick={()=> setShowConfirm(true)} >
                            <IonLabel>Cerrar sesión</IonLabel>
                            <IonIcon aria-hidden={true} slot="end" ios={logOutOutline}></IonIcon>
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