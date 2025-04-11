import { IonContent, IonIcon, IonImg, IonPage } from "@ionic/react";
import React, { useState } from "react";
import MainHeader from "../mainHeader/MainHeader";
import SideMenu from "../sideMenu/SideMenu";
import MainFooter from "../mainFooter/MainFooter";
import './PerfilYPreferencias.css'
import { OperationLabelProps } from "./PerfilYPreferenciasInterfaces";
import { perfilOperations } from "../../shared/operations";
import { sortOperations } from "../../shared/interfaces/Operation";

import * as icons from 'ionicons/icons';


const PerfilYPreferencias: React.FC = () => {
    const [orderOperationType, setOperation] = useState(sortOperations(perfilOperations, "type"));
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mi perfil & preferencias" />
                <IonContent fullscreen className="contentPP">
                    <div className="contentPPCentral">
                        <div className="titleContainer">
                            <span className="tittleText">Buenas tardes, Usuario</span>
                        </div>

                        {orderOperationType.map((operation) => {
                            return (
                                <OperationLabel operation={operation} key={operation.id} ></OperationLabel>
                            );
                        })}
                    </div>
                </IonContent>
                <MainFooter />
            </IonPage>
        </>
    );

};

const OperationLabel: React.FC<OperationLabelProps> = ({ operation }) => {
    return (

        <div className="labelContainer">
            <div className="leftOperationLabel">
                <IonIcon
                    color={operation.id === 13 || operation.id === 14 ? 'danger' : 'success'}
                    className="iconOperation"
                    slot="icon-only"
                    icon={(icons as Record<string, string>)[operation.icon]}
                    size="large"
                />
                <span className="operationTittle">{operation.title}</span>
            </div>
            <div className="rightOperationLabel">
                <IonImg src={operation.img} alt={operation.description} className="operationImg" />
            </div>
        </div>
    )
};
export default PerfilYPreferencias;