import { IonButton, IonContent, IonIcon, IonImg, IonPage } from "@ionic/react";
import React, { useState } from "react";
import MainHeader from "../mainHeader/MainHeader";
import SideMenu from "../sideMenu/SideMenu";
import MainFooter from "../mainFooter/MainFooter";
import './PerfilYPreferencias.css'
import { OperationLabelProps } from "./PerfilYPreferenciasInterfaces";
import { perfilOperations } from "../../shared/operations";
import { sortOperations } from "../../shared/interfaces/Operation";
import * as icons from 'ionicons/icons';
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { backendService } from "../../services/backendService";
import NotificationToast from "../notification/NotificationToast";
import { checkmarkOutline } from "ionicons/icons";
import { useUser } from "../../context/UserContext";
import { UserType } from "../../shared/interfaces/frontDTO";



/**
 * Componente PerfilYPreferencias
 * Muestra la pantalla de perfil del usuario con sus operaciones disponibles agrupadas (como cerrar sesión o dar de baja la cuenta).
 * Ofrece navegación hacia acciones personalizadas, confirmación antes de operaciones críticas y notificaciones visuales.
 */
const PerfilYPreferencias: React.FC = () => {

    /**
    * VARIABLES
    */
    const { userData } = useUser();
    const history = useHistory();
    const [orderOperationType] = useState(sortOperations(perfilOperations, "type"));

    /**
    * FUNCIONALIDAD
    */
    const handleVolver = () => {
        history.replace('/principal');
    };

    /**
      * RENDER
      */
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mi perfil & preferencias" />
                <IonContent fullscreen className="contentPP">
                    <div className="contentPPCentral">
                        <div className="titleContainer">
                            <span className="tittleText">Buenas tardes, {userData?.nombreUsuario}</span>
                        </div>
                        {orderOperationType.map((operation) => {
                            return (
                                <OperationLabel operation={operation} key={operation.id} ></OperationLabel>
                            );
                        })}
                        <IonButton
                            className="buttonReturn"
                            shape="round"
                            size="large"
                            expand="full"
                            onClick={handleVolver}
                        >
                            <IonIcon icon={icons.arrowBackOutline}></IonIcon>
                            <span className="buttonTextPYF">Volver</span>
                        </IonButton>
                    </div>
                </IonContent>
                <MainFooter />

            </IonPage>
        </>
    );

};


/**
 * Componente OperationLabel
 * Representa visualmente una opción de operación dentro del perfil (cerrar sesión, baja de cuenta, etc.).
 * Ejecuta la lógica adecuada según el tipo de operación y muestra confirmaciones o toasts según el resultado.
 */
const OperationLabel: React.FC<OperationLabelProps> = ({ operation }) => {

    /**
     * VARIABLES
     */
    const { userData } = useUser();
    const { logout, user } = useAuth();
    const history = useHistory();
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: icons.checkmarkOutline,
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const initialModalConfig = {
        tittle: "",
        message: "",
        img: "",
        onConfirm: () => { },
    };
    const [modalConfig, setModalConfig] = useState(initialModalConfig);

    /**
    * FUNCIONALIDAD
    */
    const handleOperation = async () => {
        switch (operation.id) {
            case 13:
                setModalConfig({
                    tittle: operation.title,
                    message: "¿Estás seguro de que deseas cerrar sesión? Tu sesión se cerrará y deberás iniciar sesión nuevamente para continuar usando la aplicación.",
                    img: operation.img,
                    onConfirm: () => {
                        logout();
                        sessionStorage.removeItem('userData');
                        history.replace('/lobby');
                        setShowConfirm(false);
                    }
                });
                setShowConfirm(true);
                break;
    
            case 14:
                console.log(user?.uid);
                setModalConfig({
                    tittle: operation.title,
                    message: "¿Estás seguro de que deseas dar de baja tu cuenta? Esta acción es permanente. Perderás el acceso a tu cuenta y a todos tus datos, y no podrás volver a acceder.",
                    img: operation.img,
                    onConfirm: async () => {
                        let res;
                        try {
                            if (userData?.tipoUsuario === UserType.INFANTIL) {
                                res = await backendService.bajaUsuarioComoTutelado(userData.uid);
                                console.log(res);
                            } else {
                                res = await backendService.deactivateUser(user?.uid);
                            }

                            if (res.success) {
                                setToast({
                                    show: true,
                                    message: "Su cuenta ha sido dada de baja correctamente.",
                                    color: "success",
                                    icon: checkmarkOutline,
                                });
                                sessionStorage.removeItem('userData');
                                logout();
                                history.replace('/lobby');
                            } else {
                                throw new Error();
                            }
                        } catch (error) {
                            setToast({
                                show: true,
                                message: "No se ha podido realizar la baja, inténtelo más tarde.",
                                color: "danger",
                                icon: icons.alertCircleOutline,
                            });
                        } finally {
                            setShowConfirm(false);
                        }
                    }
                });
                setShowConfirm(true);
                break;
    
            default:
                window.location.href = operation.url;
                break;
        }
    };

    /**
     * RENDER
     */
    return (
        <>
            <div className="labelContainer" onClick={handleOperation}>
                <div className="leftOperationLabel">
                    <IonIcon
                        color={operation.id === 13 || operation.id === 14 ? 'danger' : 'success'}
                        className="iconOperation"
                        slot="icon-only"
                        icon={(icons as Record<string, string>)[operation.icon]}
                        size="large"
                    />
                    <span className="operationTittle">{operation.title}</span>
                </div>
                <div className="rightOperationLabel">
                    <IonImg src={operation.img} className="operationImgPYF" />
                </div>
            </div>
            <DobleConfirmacion
                isOpen={showConfirm}
                tittle={modalConfig.tittle}
                message={modalConfig.message}
                img={modalConfig.img}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setShowConfirm(false)}
            />
            <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
        </>
    )
};


export default PerfilYPreferencias;