import React, { useEffect, useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonCheckbox, IonContent, IonIcon, IonImg, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import MainFooter from "../mainFooter/MainFooter";
import { alertCircleOutline, arrowBackOutline, checkmarkOutline, constructOutline, folderOutline } from "ionicons/icons";
import './Preferencias.css'
import { useUser } from "../../context/UserContext";
import { InfoUserDTO } from "../../shared/interfaces/frontDTO";
import NotificationToast from "../notification/NotificationToast";
import { backendService } from "../../services/backendService";


/**
 * Componente `Preferencias`
 *
 * Este componente permite al usuario modificar y guardar sus preferencias de visualización,
 * en particular la activación o desactivación del "modo accesibilidad".
 *
 * Funcionalidades clave:
 * - Carga inicial del estado de accesibilidad desde los datos del usuario.
 * - Permite alternar entre la vista estándar y la vista simplificada.
 * - Guarda las preferencias modificadas a través de una llamada al backend.
 * - Presenta retroalimentación mediante notificaciones tipo toast.
 * - Incluye lógica de carga y validación visual del estado actual.
 *
 * También incorpora navegación hacia atrás y desactiva el botón de guardar si no hay cambios.
 */
const Preferencias: React.FC = () => {

    /**
     * VARIABLES
     */
    const [valorOriginal, setValorOriginal] = useState(false);
    const [accesibilidad, setAccesibilidad] = useState(false);
    const { userData, setUserData } = useUser();
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });
    const [loading, setLoading] = useState(false);

    /**
     * FUNCIONALIDAD
     */
    // Logs cuando los datos realmente se actualizan
    useEffect(() => {
        if (userData) {
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
        setLoading(true);
        if (accesibilidad !== valorOriginal) {
            const usuarioActualizado: InfoUserDTO = {
                ...userData!,
                modoAccesibilidad: accesibilidad,
            };

            try {
                const response = await backendService.updateUserInfo(usuarioActualizado);
                if (response.success) {
                    setUserData(usuarioActualizado); // 👈 actualizar el contexto
                    setValorOriginal(accesibilidad); // ✅ sincronizar con el nuevo valor
                    setToast({
                        show: true,
                        message: "Preferencias de accesibilidad actualizadas correctamente.",
                        color: "success",
                        icon: checkmarkOutline,
                    });
                    setLoading(false);
                } else {
                    console.error("❌ Error del servidor:", response.error);
                    setToast({
                        show: true,
                        message: "No se ha podido realizar el cambio de accesibilidad",
                        color: "danger",
                        icon: alertCircleOutline,
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error("❌ Error al guardar:", error);
                setToast({
                    show: true,
                    message: "No se ha podido realizar el cambio de accesibilidad",
                    color: "danger",
                    icon: alertCircleOutline,
                });
                setLoading(false);
            }
        }
    };

    /**
     * RENDER
     */
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mi perfil & preferencias" />
                {userData && !loading && (
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
                )}
                {(loading || !userData) &&
                    <IonContent fullscreen className="contentTA">
                        <div className="contentTACentralP">
                            <div className="spinnerContainerP">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerP">Cargando su información. Un momento, por favor...</span>
                            </div>
                            {!loading &&
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
                            }
                        </div>
                    </IonContent>
                }
                <MainFooter />
            </IonPage>
            <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
        </>
    );
};

export default Preferencias;