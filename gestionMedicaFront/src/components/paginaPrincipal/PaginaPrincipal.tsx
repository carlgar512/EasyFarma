import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonImg, IonPage} from "@ionic/react";
import { callOutline, starOutline } from "ionicons/icons";
import "./PaginaPrincipal.css";
import * as icons from 'ionicons/icons';
import { useEffect, useRef, useState } from "react";

import { operations } from "../../shared/operations";
import React from "react";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { sortOperations } from "../../shared/interfaces/Operation";
import SideMenu from "../sideMenu/SideMenu";
import MainHeader from "../mainHeader/MainHeader";
import { OperationCardProps } from "./PaginaPrincipalInterfaces";
import MainFooter from "../mainFooter/MainFooter";
import { useAuth } from "../../context/AuthContext"; // Asegúrate de poner la ruta correcta



const handleEmergencyCall = () => {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        window.location.href = 'tel:+34679761132';
    } else {
        alert("Esta función solo está disponible en dispositivos móviles. Llame al +1234567890 si necesita asistencia.");
    }
};

const PaginaPrincipal: React.FC = () => {
    
    //const { user, token , logout} = useAuth();
    /*useEffect(() => {
        console.log("👤 Usuario en contexto:", user);
        console.log("🔐 Token en contexto:", token);
      }, [user, token]);
      */

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        scrollRef.current.scrollLeft = scrollLeft - (x - startX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const [orderOperationType, setOperation] = useState(sortOperations(operations, "type"));
    //TODO probar en telf y cambiar numero

    return (
        <>
        <SideMenu/>
            <IonPage id="main-content">
                <MainHeader tittle="Inicio"/>
                <IonContent fullscreen className="content">
                    <div className="contentContainer">
                        <div className="sectionContainer">
                            <div className="sectionTitle">
                                <IonIcon
                                    color="success"
                                    slot="start"
                                    icon={icons.rocketOutline}
                                    size="large"
                                />
                                <span className="sectionTitleText">Gestiona tus Operaciones de Forma Eficiente</span>
                            </div>

                            <div
                                ref={scrollRef}
                                className="cardOperationContainer"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {orderOperationType.map((operation, index) => {
                                    return (
                                        <OperationCard operation={operation} key={operation.id} ></OperationCard>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="sectionContainer">
                            <div className="sectionTitle">
                                <IonIcon
                                    color="success"
                                    slot="start"
                                    icon={icons.heartCircleOutline}
                                    size="large"
                                />
                                <span className="sectionTitleText">Operaciones Favoritas</span>
                            </div>
                        </div>
                        <div className="sectionContainer">

                            <div className="sectionTitle">
                                <IonIcon
                                    color="success"
                                    slot="start"
                                    icon={starOutline}
                                    size="large"
                                />
                                <span className="sectionTitleText">Tus esenciales</span>
                            </div>
                        </div>

                        <div className="sectionContainer">

                            <div className="sectionTitle">
                                <IonIcon
                                    color="success"
                                    slot="start"
                                    icon={callOutline}
                                    size="large"
                                />
                                <span className="sectionTitleText">Asistencia Directa</span>
                            </div>
                        </div>
                    </div>
                    
                    <EmergecyCall />
                </IonContent>
                <MainFooter/>
            </IonPage>
        </>

    );
};


const OperationCard: React.FC<OperationCardProps> = ({ operation }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const toggleLike = () => {
        if (isLiked) {
            setShowConfirm(true)
        }
        else {
            setIsLiked(!isLiked);
        }
    };

    const removeLiked = () => {
        setIsLiked(!isLiked);
        setShowConfirm(false)
    }

    const redirectTo = () => {
        window.location.assign(operation.url); // Reemplaza la URL actual y borra el historial
    };

    return (
        <>
            <IonCard className="operationCard" type="button" onClick={redirectTo}>
                <IonFab vertical="top" horizontal="end" >
                    <IonButton
                        shape="round"
                        color="success"
                        fill={isLiked ? "outline" : "clear"}
                        size="default"
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation(); // Evita que el click se propague al IonCard
                            toggleLike();
                        }}>
                        <IonIcon slot="icon-only" color="success" icon={isLiked ? icons.heartSharp : icons.heartOutline}></IonIcon>
                    </IonButton>
                </IonFab>
                <IonCardHeader className="cardHeader">

                    <IonCardTitle color="success" className="cardTittle">
                        <IonIcon icon={(icons as Record<string, string>)[operation.icon]} size="large"></IonIcon>
                        <span className="cardTittleText">{operation.title}</span>
                    </IonCardTitle>
                </IonCardHeader>
                <IonImg className="cardImage" alt={`/${operation.img}`} src={`/${operation.img}`} />


                <IonCardContent>
                    <span className="cardDescription">
                        {operation.description}
                    </span>
                </IonCardContent>
            </IonCard>
            <DobleConfirmacion
                isOpen={showConfirm}
                tittle="Descartar operación de favoritos"
                message={`¿Estás seguro de que deseas eliminar la operación ${operation.title} de tus favoritos? Podrás volver a añadirlo más tarde si lo deseas.`}
                img="/doubleCheckFavourite.svg"
                onConfirm={removeLiked}
                onCancel={() => setShowConfirm(false)}
            />
        </>

    );
};




const EmergecyCall: React.FC = () => {

    return (

        <IonFab horizontal="center" vertical="bottom" slot="fixed">
            <IonFabButton className="emergencyButton" >
                <IonIcon icon={callOutline}></IonIcon>
            </IonFabButton>
            <IonFabList className="fabList" side="end">
                <IonButton color={"success"} shape="round" onClick={handleEmergencyCall}>
                    <IonIcon icon={callOutline} slot="icon-only"></IonIcon>
                </IonButton>
                <span className="emergencyMessage">¡¡Llamada de emergencia!!</span>
            </IonFabList>
        </IonFab>

    );
};




export default PaginaPrincipal;