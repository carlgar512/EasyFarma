import React, { useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import MainFooter from "../mainFooter/MainFooter";
import { arrowBackOutline, atOutline, brushOutline, optionsOutline } from "ionicons/icons";
import './ModificaPerfil.css'
import { DatoUsuarioProps } from "./ModificaPerfilInterfaces";
import ModalPasswordCheck from "../modalPasswordCheck/ModalPasswordCheck";

const ModificaPerfil: React.FC = () => {

    const [form, setForm] = useState({
        name: "Carlos",
        lastName: "Garcia",
        dni: "71315332Z",
        dateNac: "15/11/2001",
        email: "cargarmisa@gmail.com",
        direccion: "Calle Caceres 14 Tudela de Duero Valladolid",
        tlf: "600882146",
        password: "",
        confirmPassword: "",
        tipoUsuario: "Regular",
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCambiarContraseña = () => {

    };

    const handleVolver = () => {
        window.history.back();
    };

    const [isModalCheckOpen, setIsModalCheckOpen] = useState<boolean>(false);

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mi perfil & preferencias" />
                <IonContent fullscreen className="contentMP">
                    <div className="contentMPCentral">
                        <div className="titleContainerMP">
                            <IonIcon
                                className="iconOperation"
                                slot="icon-only"
                                icon={optionsOutline}
                                size="large"
                            />
                            <span className="tittleTextMP">Buenas tardes, {form.name}</span>
                        </div>
                        <div className="infoContainer">
                            <DatoUsuario label="Nombre:" value={form.name} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Apellidos:" value={form.lastName} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Dni:" value={form.dni} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Fecha de nacimiento:" value={form.dateNac} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Email:" value={form.email} editable={true} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Dirección:" value={form.direccion} editable={true} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Teléfono:" value={form.tlf} editable={true} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Tipo de usuario:" value={form.tipoUsuario} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <IonButton
                                onClick={handleCambiarContraseña}
                                expand="block"
                                shape="round"
                                size="default"
                                className="ion-margin-top buttonCambiarPsw"
                            >
                                <IonIcon icon={atOutline} size="large" slot="icon-only"></IonIcon>
                                <span className="buttonTextMP">
                                    Cambiar contraseña
                                </span>
                            </IonButton>

                            <IonButton
                                onClick={handleVolver}
                                expand="block"
                                shape="round"
                                size="large"
                                className="ion-margin-top buttonVolver"
                            >
                                <IonIcon icon={arrowBackOutline} size="large" slot="icon-only"></IonIcon>
                                <span className="buttonTextMP">
                                    Volver
                                </span>
                            </IonButton>
                        </div>

                    </div>

                </IonContent>
                <MainFooter />
            </IonPage>

            <ModalPasswordCheck isOpen={isModalCheckOpen} setIsModalOpen={setIsModalCheckOpen} dni={""} />
        </>
    );
};



const DatoUsuario: React.FC<DatoUsuarioProps> = ({ label, value, editable, setIsModalOpen }) => {


    return (
        <div className="form-itemMP">
            <label className="form-labelMP">{label}</label>
            <IonLabel className="form-inputMP">{value}</IonLabel>

            <div className="buttonContainer">
                {editable && (
                    <IonButton
                        className="buttonEdit"
                        onClick={setIsModalOpen}
                    >
                        <IonIcon slot="icon-only" icon={brushOutline} size="large" />
                    </IonButton>
                )}
            </div>

        </div>

    );
};




export default ModificaPerfil;