import React from "react";
import { DetalleTratamientoProps } from "./DetalleTratamientoInterfaces";
import { Redirect, useLocation } from "react-router-dom";
import { IonPage } from "@ionic/react";


const DetalleTratamientoWrapper: React.FC = () => {
    const location = useLocation<{ tratamiento }>();
    const tratamiento = location.state?.tratamiento;
  
    if (!tratamiento) {
      // 🔙 Si se accede sin datos, redirige o muestra mensaje
      return <Redirect to="/treatment-history" />;
    }
  
    return <DetalleTratamiento tratamiento={tratamiento} />;
  };

const DetalleTratamiento: React.FC<DetalleTratamientoProps> = ({tratamiento}) => {
  
    return(
        <IonPage>
        {tratamiento.tipoTratamiento}
        </IonPage>
    );
  };

export default DetalleTratamientoWrapper;