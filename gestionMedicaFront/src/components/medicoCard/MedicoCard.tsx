import { IonButton, IonIcon } from "@ionic/react";
import { addCircleOutline, alertCircleOutline, checkmarkOutline, eyeOutline, locationOutline, star, starOutline } from "ionicons/icons";
import React, { useState } from "react";
import { MedicoCardProps } from "./MedicoCardInterfaces";
import './MedicoCard.css';
import { useHistory } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { InfoUserDTO } from "../../shared/interfaces/frontDTO";
import { backendService } from "../../services/backendService";
import NotificationToast from "../notification/NotificationToast";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";

/**
 * Componente MedicoCard
 *
 * Representa la vista resumida de un médico con la información relevante para el usuario:
 * nombre, especialidad, centro y provincia, junto con acciones disponibles como:
 * - Agendar una nueva cita
 * - Ver detalle del profesional
 * - Marcar o desmarcar como favorito (con confirmación si es necesario)
 *
 * Props:
 * - medico: Objeto de tipo MedicoDTO que contiene la información principal del profesional.
 * - especialidad: Objeto de tipo EspecialidadDTO asociado al médico.
 * - centro: Objeto de tipo CentroDTO donde ejerce el médico.
 * - provincia: Nombre de la provincia donde se ubica el centro.
 *
 * Comportamientos clave:
 * - Gestión local de favorito con sincronización con el backend.
 * - Navegación hacia el detalle del médico o agendamiento de cita.
 * - Confirmación visual de acciones mediante diálogos y notificaciones.
 */
const MedicoCard: React.FC<MedicoCardProps> = ({
    medico,
    especialidad,
    centro,
    provincia,

}) => {

    /**
     * VARIABLES
     */
    const history = useHistory();
    const { userData, setUserData } = useUser();
    const [isFavorito, setIsFavorito] = useState<boolean>(() =>
        userData?.medicosFavoritos.includes(medico.uid) ?? false
    );
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        tittle: "",
        message: "",
        img: "",
        onConfirm: () => { },
    });

    /**
     * FUNCIONALIDAD
     */
    const cerrarDialogo = () => {
        setDialogState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    };

    const onFavoritoDobleCheck = () => {
        if (!userData || !userData.medicosFavoritos) return;

        const yaEsFavorito = userData.medicosFavoritos.includes(medico.uid);

        if (yaEsFavorito) {
            // Si ya es favorito, pedimos confirmación para eliminar
            setDialogState({
                isOpen: true,
                tittle: "Eliminar médico de favoritos",
                message: `¿Está seguro de que desea eliminar a ${medico.nombreMedico} ${medico.apellidosMedico} de sus médicos favoritos? Podrá volver a agregarlo en cualquier momento.`,
                img: "moveCollection.svg",
                onConfirm: () => {
                    onFavoritoClick();
                    cerrarDialogo();
                }
            });

        } else {
            // Si no es favorito, lo añadimos directamente
            onFavoritoClick();
        }
    };

    const onFavoritoClick = async () => {
        if (!userData || !userData.medicosFavoritos) return;

        let nuevosFavoritos: string[];
        let mensajeToast = "";

        if (userData.medicosFavoritos.includes(medico.uid)) {
            mensajeToast = `${medico.nombreMedico} ${medico.apellidosMedico} eliminado de favoritos`;
            // Si ya es favorito, lo quitamos
            nuevosFavoritos = userData.medicosFavoritos.filter(uid => uid !== medico.uid);
            setIsFavorito(false);
        } else {
            mensajeToast = `${medico.nombreMedico} ${medico.apellidosMedico} añadido a favoritos`;
            // Si no es favorito, lo agregamos
            nuevosFavoritos = [...userData.medicosFavoritos, medico.uid];
            setIsFavorito(true);
        }

        const updatedUser: InfoUserDTO = {
            ...userData,
            medicosFavoritos: nuevosFavoritos,
        };

        try {
            await backendService.updateUserInfo(updatedUser);
            setUserData(updatedUser);
            setToast({
                show: true,
                message: mensajeToast,
                color: "success",
                icon: checkmarkOutline,
            });
        } catch (error) {

            setToast({
                show: true,
                message: "Error al actualizar favorito",
                color: "danger",
                icon: alertCircleOutline,
            });
        }
    };

    const onVerDetalleClick = () => {
        history.push("/doctor-detail", {
            medico,
            centro,
            especialidad,
            seccionAgendarCita: false
        });
    };

    const onNuevaCitaClick = () => {

        history.push("/doctor-detail", {
            medico,
            centro,
            especialidad,
            seccionAgendarCita: true
        });
    };

    /**
     * RENDER
     */
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
                    onClick={() => onFavoritoDobleCheck()}
                    className="favorito-boton"
                >
                    <IonIcon icon={isFavorito ? star : starOutline} />
                </IonButton>
            </div>

            <div className="card-footer">
                <IonButton
                    shape="round"
                    fill="solid"
                    onClick={onNuevaCitaClick}
                    className="nuevaCitabBoton"
                >
                    <IonIcon icon={addCircleOutline} slot="start" />
                    <span>Agendar nueva cita</span>
                </IonButton>
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
            <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
            <DobleConfirmacion
                isOpen={dialogState.isOpen}
                tittle={dialogState.tittle}
                message={dialogState.message}
                img={dialogState.img}
                onConfirm={dialogState.onConfirm}
                onCancel={() => cerrarDialogo()}
            />
        </div>
    );
};

export default MedicoCard;