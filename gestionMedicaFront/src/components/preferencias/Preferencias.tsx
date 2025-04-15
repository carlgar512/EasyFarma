import React, { useEffect, useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonCheckbox, IonContent, IonIcon, IonImg, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import MainFooter from "../mainFooter/MainFooter";
import { arrowBackOutline, constructOutline, folderOutline } from "ionicons/icons";
import './Preferencias.css'
import { useUser } from "../../context/UserContext";

const Preferencias: React.FC = () => {
    const [valorOriginal, setValorOriginal] = useState(false);
    const [accesibilidad, setAccesibilidad] = useState(false);
    const { userData } = useUser();

    // Logs cuando los datos realmente se actualizan
    useEffect(() => {
        if (userData) {
            console.log("✅ userData actualizado:", userData);
            setAccesibilidad(userData.modoAccesibilidad);
            setValorOriginal(userData.modoAccesibilidad);
        }
    }, [userData]);

    const cambiarVista = (nuevaVistaEsAccesible: boolean) => {
        if (accesibilidad !== nuevaVistaEsAccesible) {
            setAccesibilidad(nuevaVistaEsAccesible);
        }
    };

    const handleVolver = () => {
        window.history.back();
    };

    const guardarPreferencias = async () => {
        if (accesibilidad !== valorOriginal) {
            try {
                // Aquí llamarías al backend:
                // await api.post('/usuario/preferencias', { accesibilidad });
                console.log("Guardado correctamente:", accesibilidad);
                setValorOriginal(accesibilidad); // ✅ Actualiza estado original tras guardar
            } catch (error) {
                console.error("Error al guardar:", error);
            }
        }
    };

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mi perfil & preferencias" />
                {userData ? (
                    <IonContent fullscreen className="contentP">
                        <div className="contentPCentral">
                            <div className="titleContainerP">
                                <IonIcon
                                    slot="icon-only"
                                    icon={constructOutline}
                                    size="large"
                                />
                                <span className="tittleTextP">Preferencias de usuario</span>
                            </div>
                            <div className="interfacesContainerGrid">
                                <div className={`interfaceContainer ${!accesibilidad ? 'seleccionada' : ''}`}
                                    onClick={() => cambiarVista(false)}
                                >
                                    <span className="interfaceText">Vista estándar</span>
                                    <div className="imgContainerP">
                                        <IonImg className="imgInterface" src="estandarInterface.svg" />
                                    </div>
                                    <div className="ckeckContainer">
                                        <IonCheckbox checked={!accesibilidad} />
                                    </div>
                                </div>
                                <div className={`interfaceContainer ${accesibilidad ? 'seleccionada' : ''}`}
                                    onClick={() => cambiarVista(true)}
                                >
                                    <span className="interfaceText">Vista simplificada</span>
                                    <div className="imgContainerP">
                                        <IonImg className="imgInterface" src="simpleInterface.svg" />
                                    </div>
                                    <div className="ckeckContainer">
                                        <IonCheckbox checked={accesibilidad} />
                                    </div>
                                </div>
                            </div>
                            <div className="buttonContainerP">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="PButton"
                                    onClick={guardarPreferencias}
                                    disabled={accesibilidad === valorOriginal}
                                >
                                    <IonIcon slot="start" icon={folderOutline}></IonIcon>
                                    <span className="buttonTextP">Guardar cambios</span>
                                </IonButton>
                                <IonButton size="large" expand="full" shape="round" className="PButton2" onClick={handleVolver}>
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextP">Volver</span>
                                </IonButton>
                            </div>
                        </div>

                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentTA">
                        <div className="contentTACentralP">
                            <div className="spinnerContainerP">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerP">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonContainerP">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="cardButton2"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextP">Volver</span>
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                )}
                <MainFooter />
            </IonPage>
        </>
    );
};

export default Preferencias;