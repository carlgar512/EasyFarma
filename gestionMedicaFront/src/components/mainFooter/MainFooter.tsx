import { IonButton, IonFooter, IonIcon } from "@ionic/react";
import { calendarOutline, fitnessOutline, homeOutline, schoolOutline } from "ionicons/icons";
import React from "react";
import './MainFooter.css';
import { useHistory } from 'react-router-dom';

/**
 * Componente MainFooter
 * Footer de navegación fija que permite al usuario acceder rápidamente a las secciones principales:
 * Inicio, Citas, Médicos favoritos y Tratamientos activos.
 */
const MainFooter: React.FC = () => {

    /**
      * VARIABLES
      */
    const history = useHistory();

    /**
     * FUNCIONALIDAD
     */
    const handleClick = (section: string) => {
        switch (section) {
            case 'inicio':
                history.push('/principal');
                break;
            case 'citas':
                history.push('/appointment-history?tipo=actuales');
                break;
            case 'medicos':
                history.push('/search-doctor?favoritos=true');
                break;
            case 'tratamiento':
                history.push('/treatment-history?tipo=actuales');
                break;
            default:
                console.warn('Sección no reconocida');
        }
    };

    /**
    * RENDER
    */
    return (
        <IonFooter className="iconBar">
            <div className="downItemContainer">
                <IonButton
                    shape="round"
                    size="large"
                    fill="outline"
                    className="downButton"
                    onClick={() => handleClick('inicio')}
                >
                    <IonIcon slot="icon-only" ios={homeOutline}></IonIcon>
                </IonButton>
                <span>Inicio</span>
            </div>
            <div className="downItemContainer">
                <IonButton
                    shape="round"
                    size="large"
                    fill="outline"
                    className="downButton"
                    onClick={() => handleClick('citas')}
                >
                    <IonIcon slot="icon-only" ios={calendarOutline}></IonIcon>
                </IonButton>
                <span>Mis citas</span>
            </div>
            <div className="downItemContainer">
                <IonButton
                    shape="round"
                    size="large"
                    fill="outline"
                    className="downButton"
                    onClick={() => handleClick('medicos')}>
                    <IonIcon slot="icon-only" ios={schoolOutline}></IonIcon>
                </IonButton>
                <span>Mis médicos</span>
            </div>
            <div className="downItemContainer">
                <IonButton
                    shape="round"
                    size="large"
                    fill="outline"
                    className="downButton"
                    onClick={() => handleClick('tratamiento')}>
                    <IonIcon slot="icon-only" ios={fitnessOutline}></IonIcon>
                </IonButton>
                <span>Mi Tratamiento</span>
            </div>
        </IonFooter>
    );
};
export default MainFooter;