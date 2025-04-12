import React, { useEffect, useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonCheckbox, IonContent, IonIcon, IonImg, IonPage } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import MainFooter from "../mainFooter/MainFooter";
import { arrowBackOutline, constructOutline, saveOutline } from "ionicons/icons";
import './Preferencias.css'

const Preferencias: React.FC = () => {
    const [valorOriginal, setValorOriginal] = useState(false);
    const [accesibilidad, setAccesibilidad] = useState(false);

    const cambiarVista = (nuevaVistaEsAccesible: boolean) => {
        if (accesibilidad !== nuevaVistaEsAccesible) {
            setAccesibilidad(nuevaVistaEsAccesible);
        }
    };
    const handleVolver = () => {
        window.history.back();
    };

    useEffect(() => {
        // Simulación: obtener valor guardado desde el backend
        // Aquí usarías fetch o axios
        const cargarPreferencias = async () => {
            // const response = await api.get('/usuario/preferencias');
            const preferenciaGuardada = false; // Simulado
            setValorOriginal(preferenciaGuardada);
            setAccesibilidad(preferenciaGuardada);
        };
        cargarPreferencias();
    }, []);

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
                                <IonIcon slot="start" icon={saveOutline}></IonIcon>
                                <span className="buttonTextP">Guardar cambios</span>
                            </IonButton>
                            <IonButton size="large" expand="full" shape="round" className="PButton2" onClick={handleVolver}>
                                <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                <span className="buttonTextP">Volver</span>
                            </IonButton>
                        </div>
                    </div>

                </IonContent>
                <MainFooter />
            </IonPage>
        </>
    );
};

export default Preferencias;