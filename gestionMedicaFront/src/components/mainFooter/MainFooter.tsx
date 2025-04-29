import { IonButton, IonFooter, IonIcon } from "@ionic/react";
import { calendarOutline, fitnessOutline, homeOutline, schoolOutline } from "ionicons/icons";
import React from "react";
import './MainFooter.css';
import { useHistory } from 'react-router-dom';

const MainFooter: React.FC = () => {
    
    const history = useHistory();
    const handleClick = (section: string) => {
        switch (section) {
            case 'inicio':
                history.push('/principal');
                break;
            case 'citas':
               history.push('/appointment-history?tipo=actuales');
                break;
            case 'medicos':
                history.push('/favorite-doctors');
                break;
            case 'tratamiento':
                history.push('/treatment-history?tipo=actuales');
                break;
            default:
                console.warn('Sección no reconocida');
        }
    };
    return (
        <IonFooter className="iconBar">
            <div className="downItemContainer">
                <IonButton shape="round" size="large" fill="outline" className="downButton" onClick={() => handleClick('inicio')}>
                    <IonIcon slot="icon-only" ios={homeOutline}></IonIcon>
                </IonButton>
                <span>Inicio</span>
            </div>
            <div className="downItemContainer">
                <IonButton shape="round" size="large" fill="outline" className="downButton" onClick={() => handleClick('citas')}>
                    <IonIcon slot="icon-only" ios={calendarOutline}></IonIcon>
                </IonButton>
                <span>Citas</span>
            </div>
            <div className="downItemContainer">
                <IonButton shape="round" size="large" fill="outline" className="downButton" onClick={() => handleClick('medicos')}>
                    <IonIcon slot="icon-only" ios={schoolOutline}></IonIcon>
                </IonButton>
                <span>Mis médicos</span>
            </div>
            <div className="downItemContainer">
                <IonButton shape="round" size="large" fill="outline" className="downButton" onClick={() => handleClick('tratamiento')}>
                    <IonIcon slot="icon-only" ios={fitnessOutline}></IonIcon>
                </IonButton>
                <span>Tratamiento actual</span>
            </div>
        </IonFooter>
    );
};
export default MainFooter;