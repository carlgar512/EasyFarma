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




const PerfilYPreferencias: React.FC = () => {
    const history = useHistory();
    const handleVolver = () => {
        history.replace('/principal');
    };

   
    const [orderOperationType, setOperation] = useState(sortOperations(perfilOperations, "type"));

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mi perfil & preferencias" />
                <IonContent fullscreen className="contentPP">
                    <div className="contentPPCentral">
                        <div className="titleContainer">
                            <span className="tittleText">Buenas tardes, Usuario</span>
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
                            <span className="buttonText">Volver</span>
                        </IonButton>
                    </div>
                </IonContent>
                <MainFooter />

            </IonPage>
        </>
    );

};

const OperationLabel: React.FC<OperationLabelProps> = ({ operation }) => {
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: icons.checkmarkOutline,
      });
      
    const { logout, user } = useAuth();
    
    const history = useHistory();
    const [showConfirm, setShowConfirm] = useState(false);
    const initialModalConfig = {
        tittle: "",
        message: "",
        img: "",
        onConfirm: () => { },
    };
    const [modalConfig, setModalConfig] = useState(initialModalConfig);

    const handleOperation = () => {
        if (operation.id === 13) {
            setModalConfig({
                tittle: operation.title,
                message: "¿Estás seguro de que deseas cerrar sesión? Tu sesión se cerrará y deberás iniciar sesión nuevamente para continuar usando la aplicación.",
                img: operation.img,
                onConfirm: () => {
                    logout();
                    history.replace('/lobby');
                    setShowConfirm(false);
                }
            });
            setShowConfirm(true);
        }
        else if (operation.id === 14) {
            console.log(user?.uid);
            setModalConfig({
                tittle: operation.title,
                message: "¿Estás seguro de que deseas dar de baja tu cuenta? Esta acción es permanente.Perderás el acceso a tu cuenta y a todos tus datos, y no podrás volver a acceder.",
                img: operation.img,
                onConfirm: async () => {
                    const res = await backendService.deactivateUser(user?.uid);
                    if (res.success) {
                        setToast({
                                show: true,
                                message: "Su cuenta ha sido dada de baja correctamente.",
                                color: "success",
                                icon: checkmarkOutline,
                              });
                              logout();
                              history.replace('/lobby');
                              setShowConfirm(false);
                    }
                    else{
                        setToast({
                            show: true,
                            message: "No se ha podido realizar la baja, intentelo más tarde.",
                            color: "danger",
                            icon: icons.alertCircleOutline,
                          });
                          setShowConfirm(false);
                    }
                 },
            });
            setShowConfirm(true);
        }
        else {
            window.location.href = operation.url;
        }
    };


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
                    <IonImg src={operation.img} alt={operation.description} className="operationImg" />
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