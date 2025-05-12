import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonCard, IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { alertCircleOutline, arrowBackOutline, checkmarkOutline, eyeOutline, logInOutline, peopleOutline, personAddOutline, trashOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './CuentasTutorizadas.css'
import { CuentaInfantilCardProps } from "./CuentasTutorizadasInterfaces";
import ModalPasswordCheck from "../modalPasswordCheck/ModalPasswordCheck";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { backendService } from "../../services/backendService";
import { useUser } from "../../context/UserContext";
import NotificationToast from "../notification/NotificationToast";


const CuentasTutorizadas: React.FC = () => {
    const history = useHistory();
    const { userData } = useUser();
    const [loading, setLoading] = useState<boolean>();
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    const handleVolver = () => {
        history.replace('/principal');
    };
    const handleNewChildAccount = () => {
        history.replace('/newChildAccount');
    };
    const [usuariosTutelados, setUsuariosTutelados] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsuariosTutelados = async () => {
            if (!userData?.uid) return;

            try {
                setLoading(true);
                const result = await backendService.getUsuariosTutelados(userData.uid);
                setUsuariosTutelados(result);
            } catch (error: any) {
                setToast({
                    show: true,
                    message: error.message || "Error al cargar los usuarios tutelados.",
                    color: "danger",
                    icon: alertCircleOutline,
                });
            }
            finally {
                setLoading(false);
            }
        };

        fetchUsuariosTutelados();
    }, [userData?.uid]);

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Gestión familiar" />
                {!loading ? (
                    <IonContent fullscreen className="contentGF">
                        <div className="contentCentralGF">
                            <div className="titleContainerGF">
                                <IonIcon icon={peopleOutline} size="large" slot="icon-only" />
                                <span className="tittleTextGF">Cuentas tutorizadas</span>
                            </div>
                            <div className="cuentasContainerGF">
                                {usuariosTutelados.length > 0 ? (
                                    usuariosTutelados.map((user) => (
                                        <CuentaInfantilCard key={user.uid} usuario={user} setLoading={setLoading} />
                                    ))
                                ) : (
                                    <div className="sinCuentasGF">
                                        <p className="mensajeSinCuentas">No tienes cuentas tutorizadas asignadas.</p>
                                    </div>
                                )}
                            </div>
                            <div className="buttonsContainerGF">
                                <IonButton
                                    className="buttonNewAccountGF"
                                    shape="round"
                                    size="large"
                                    expand="full"
                                    onClick={() => handleNewChildAccount()}
                                >
                                    <IonIcon icon={personAddOutline} size="large" slot="icon-only"></IonIcon>
                                    <span className="buttonTextGF">Crear cuenta infantil</span>
                                </IonButton>
                                <IonButton
                                    className="buttonReturnGF"
                                    shape="round"
                                    size="large"
                                    expand="full"
                                    onClick={() => handleVolver()}
                                >
                                    <IonIcon icon={arrowBackOutline} size="large" slot="icon-only"></IonIcon>
                                    <span className="buttonTextGF">Volver</span>
                                </IonButton>
                            </div>

                        </div>
                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentGF">
                        <div className="contentCentralGFSpinner">
                            <div className="spinnerContainerGF">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerGF">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonsContainerGF">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonReturnGF"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextGF">Volver</span>
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                )}
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


const CuentaInfantilCard: React.FC<CuentaInfantilCardProps> = ({ usuario, setLoading }) => {
    const iniciales = `${usuario.nombreUsuario.charAt(0)}${usuario.apellidosUsuario.charAt(0)}`.toUpperCase();
    const history = useHistory();
    const [isModalCheckOpen, setIsModalCheckOpen] = useState<boolean>(false);
    const cerrarDialogo = () => {
        setDialogState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    };

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

    const onAcceder = () => {
    };

    const onVerDetalle = () => {
        history.push({
            pathname: "/infantilAcc-detail",
            state: { usuario }, // 👈 aquí mandamos el usuario
        });

    };

    const bajaUsuarioDobleConf = () => {
        setDialogState({
            isOpen: true,
            tittle: "Baja de cuenta infantil",
            message: `¿Estás seguro de que deseas dar de baja la cuenta infantil de ${usuario.nombreUsuario} ${usuario.apellidosUsuario}? No podrás seguir gestionando esta cuenta.`,
            img: "bajaCuenta.svg",
            onConfirm: () => bajaUsuarioInf(),
        })
    };

    const bajaUsuarioInf = async () => {
        setLoading(true);
        cerrarDialogo();
        try {
            await backendService.bajaUsuarioComoTutelado(usuario.uid);

            setToast({
                show: true,
                message: "Cuenta infantil dada de baja correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error: any) {
            setToast({
                show: true,
                message: error.message || "Error al dar de baja la cuenta infantil.",
                color: "danger",
                icon: alertCircleOutline,
            });
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <IonCard className="cuenta-card horizontal">
                <div className="cuenta-card-horizontal">
                    <div className="cuenta-card-left">
                        <div className="avatar-iniciales">{iniciales}</div>
                        <div className="cuenta-card-nombre">
                            <span className="nombre">{usuario.nombreUsuario} {usuario.apellidosUsuario}</span>
                            <span className="subtitulo">(Cuenta tutorizada)</span>
                        </div>
                    </div>

                    <div className="cuenta-card-right">
                        <IonButton expand="block" shape="round" className="boton-cuenta acceder" onClick={onAcceder}>
                            <IonIcon slot="start" icon={logInOutline} />
                            <span className="cardButtonTextGF">Acceso a cuenta</span>
                        </IonButton>

                        <IonButton expand="block" shape="round" className="boton-cuenta detalle" onClick={onVerDetalle}>
                            <IonIcon slot="start" icon={eyeOutline} />
                            <span className="cardButtonTextGF">Ver detalle</span>
                        </IonButton>

                        <IonButton expand="block" shape="round" className="boton-cuenta baja" onClick={() => setIsModalCheckOpen(true)}>
                            <IonIcon slot="start" icon={trashOutline} />
                            <span className="cardButtonTextGF">Baja de cuenta</span>
                        </IonButton>
                    </div>
                </div>
            </IonCard>
            <DobleConfirmacion
                isOpen={dialogState.isOpen}
                tittle={dialogState.tittle}
                message={dialogState.message}
                img={dialogState.img}
                onConfirm={dialogState.onConfirm}
                onCancel={() => cerrarDialogo()}
            />
            <ModalPasswordCheck
                isOpen={isModalCheckOpen}
                setIsModalOpen={setIsModalCheckOpen}
                dni={""}
                onSuccess={() => {
                    setIsModalCheckOpen(false);
                    bajaUsuarioDobleConf();
                }}
            />
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



export default CuentasTutorizadas;