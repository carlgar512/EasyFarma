import { IonButton, IonIcon } from "@ionic/react";
import { eyeOutline, locationOutline, star, starOutline } from "ionicons/icons";
import React from "react";
import { MedicoCardProps } from "./MedicoCardInterfaces";
import './MedicoCard.css'

const MedicoCard: React.FC<MedicoCardProps> = ({
    nombre,
    apellidos,
    especialidad,
    centro,
    esFavorito = false,
}) => {
    const onFavoritoClick = () => {
    };

    const onVerDetalleClick = () => {

    };


    return (
        <div className="medico-card">
            <div className="card-header">
                <div className="header-left">
                    <div className="avatarMedico">
                        <span className="letrasAvatar">
                            {nombre.charAt(0)}
                            {apellidos.charAt(0)}
                        </span>
                    </div>

                    <div>
                        <h3>{nombre} {apellidos}</h3>
                        <p className="especialidad">{especialidad}</p>
                        <hr className="separadorMedico" />
                        <IonIcon icon={locationOutline} slot="start" />
                        <span className="centro">{centro}</span>
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