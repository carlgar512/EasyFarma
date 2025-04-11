import { IonButton, IonFooter, IonIcon } from "@ionic/react";
import { fitnessOutline, homeOutline, schoolOutline, starOutline } from "ionicons/icons";
import React from "react";
import './MainFooter.css'

const MainFooter: React.FC = () => {
    return (
        <IonFooter className="iconBar">

            <div className="downItemContainer">
                <IonButton shape="round" size="large" fill="outline" className="downButton">
                    <IonIcon slot="icon-only" ios={homeOutline}></IonIcon>
                </IonButton>
                <span>Inicio</span>
            </div>
            <div className="downItemContainer">
                <IonButton shape="round" size="large" fill="outline" className="downButton">
                    <IonIcon slot="icon-only" ios={starOutline}></IonIcon>
                </IonButton>
                <span>Favoritos</span>
            </div>
            <div className="downItemContainer">
                <IonButton shape="round" size="large" fill="outline" className="downButton">
                    <IonIcon slot="icon-only" ios={schoolOutline}> </IonIcon>
                </IonButton>
                <span>Médicos</span>
            </div>
            <div className="downItemContainer">
                <IonButton shape="round" size="large" fill="outline" className="downButton">
                    <IonIcon slot="icon-only" ios={fitnessOutline}></IonIcon>
                </IonButton>
                <span>Tratamiento</span>
            </div>

        </IonFooter>
    );
};
export default MainFooter;