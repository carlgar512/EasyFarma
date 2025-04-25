import { IonButton, IonIcon } from "@ionic/react";
import { eyeOutline, locationOutline, star, starOutline } from "ionicons/icons";
import React from "react";
import { MedicoCardProps } from "./MedicoCardInterfaces";
import './MedicoCard.css';
import { useHistory } from "react-router-dom";

const MedicoCard: React.FC<MedicoCardProps> = ({
    medico,
    especialidad,
    centro,
    provincia,
    esFavorito = false,
}) => {

    const history = useHistory();
    const onFavoritoClick = () => {
    };

    const onVerDetalleClick = () => {
        history.push("/doctor-detail", {
            medico,
            centro,
            especialidad,
            esFavorito
        });
    };


    return (
        <div className="medico-card">
            <div className="card-header">
                <div className="header-left">
                    <div className="avatarMedico">
                        <span className="letrasAvatar">
                            {medico.nombreMedico.charAt(0)}
                            {medico.apellidosMedico.charAt(0)}
                        </span>
                    </div>

                    <div>
                        <h3>{medico.nombreMedico} {medico.apellidosMedico}</h3>
                        <p className="especialidad">{especialidad.nombre}</p>
                        <hr className="separadorMedico" />
                        <IonIcon icon={locationOutline} slot="start" />
                        <span className="centro">{centro.nombreCentro}</span>
                        <p className="provincia">({provincia})</p> 
                    </div>
                </div>

                <IonButton
                    fill="clear"
                    size="small"
                    onClick={onFavoritoClick}
                    className="favorito-boton"
                >
                    <IonIcon icon={esFavorito ? star : starOutline} />
                </IonButton>
            </div>

            <div className="card-footer">
                <IonButton
                    shape="round"
                    fill="outline"
                    color={"success"}
                    onClick={onVerDetalleClick}
                    className="ver-detalle-boton"
                >
                    <IonIcon icon={eyeOutline} slot="start" />
                    <span>Ver detalle</span>
                </IonButton>
            </div>
        </div>
    );
};

export default MedicoCard;