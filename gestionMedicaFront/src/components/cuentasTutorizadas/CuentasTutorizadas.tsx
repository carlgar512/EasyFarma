import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonCard, IonContent, IonHeader, IonIcon, IonInput, IonInputPasswordToggle, IonItem, IonLabel, IonModal, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { alertCircleOutline, arrowBackOutline, checkmarkCircleOutline, checkmarkOutline, closeCircleOutline, constructOutline, eyeOutline, informationCircleOutline, logInOutline, peopleOutline, personAddOutline, trashOutline, warningOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './CuentasTutorizadas.css'
import { CuentaInfantilCardProps, ModalTransitionAccProps } from "./CuentasTutorizadasInterfaces";
import ModalPasswordCheck from "../modalPasswordCheck/ModalPasswordCheck";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { backendService } from "../../services/backendService";
import { useUser } from "../../context/UserContext";
import NotificationToast from "../notification/NotificationToast";
import { UserType } from "../../shared/interfaces/frontDTO";


/**
 * Componente `CuentasTutorizadas`
 *
 * Página para gestionar las cuentas infantiles asociadas a un usuario tutor.
 * 
 * Funcionalidades principales:
 * - Carga y visualización de las cuentas tuteladas del usuario actual.
 * - Permite crear nuevas cuentas infantiles.
 * - Muestra advertencia y restringe el acceso si el usuario actual es una cuenta infantil.
 * - Usa `CuentaInfantilCard` para mostrar cada cuenta tutelada.
 * - Muestra feedback de carga, errores y acciones mediante `IonToast` y `IonSpinner`.
 *
 * Redirige a:
 * - `/principal`: al volver
 * - `/newChildAccount`: para crear una nueva cuenta tutelada
 *
 * Requiere que el contexto `useUser` proporcione `userData` con `uid` y `tipoUsuario`.
 */
const CuentasTutorizadas: React.FC = () => {

    /**
     * VARIABLES
     */
    const history = useHistory();
    const { userData } = useUser();
    const [loading, setLoading] = useState<boolean>();
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });
    const [usuariosTutelados, setUsuariosTutelados] = useState<any[]>([]);

    /**
     * FUNCIONALIDAD
     */
    const handleVolver = () => {
        history.replace('/principal');
    };
    const handleNewChildAccount = () => {
        history.replace('/newChildAccount');
    };

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

    /**
     * RENDER
     */
    if (userData?.tipoUsuario === UserType.INFANTIL) {
        return (
            <>
                <SideMenu />
                <IonPage id="main-content">
                    <MainHeader tittle="Gestión familiar" />
                    <IonContent fullscreen className="contentGF advertenciaInfantilUI">
                        <div className="contentCentralGF">
                            <div className="warningContainerUI">
                                <IonIcon icon={alertCircleOutline} size="large" color="warning" />
                                <h2 className="warningTitleUI">Gestión desactivada</h2>
                                <p className="warningMessageUI">
                                    Esta funcionalidad no está disponible en cuentas infantiles. Por favor, vuelve a la cuenta del tutor para gestionar cuentas tuteladas.
                                </p>

                            </div>
                            <div className="buttonsContainerGF">
                                <IonButton
                                    className="buttonReturnGF"
                                    shape="round"
                                    size="large"
                                    expand="full"
                                    onClick={handleVolver}
                                >
                                    <IonIcon icon={arrowBackOutline} />
                                    <span className="buttonTextGF">Volver</span>
                                </IonButton>
                            </div>
                        </div>

                    </IonContent>
                    <MainFooter />
                </IonPage>
            </>
        );
    }

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Gestión familiar" />
                {!loading && userData ? (
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

/**
 * Componente `CuentaInfantilCard`
 *
 * Representa visualmente una tarjeta para cada cuenta tutorizada (infantil) dentro del panel de gestión familiar.
 *
 * Funcionalidades principales:
 * - Muestra nombre, apellidos e iniciales del menor.
 * - Permite al tutor:
 *    - Acceder como la cuenta infantil (cambiando el `userData` del contexto y recargando).
 *    - Ver detalles de la cuenta infantil (`/infantilAcc-detail`).
 *    - Dar de baja la cuenta infantil (requiere verificación por contraseña y doble confirmación).
 *
 * Componentes secundarios utilizados:
 * - `ModalPasswordCheck`: valida identidad antes de permitir acciones críticas.
 * - `DobleConfirmacion`: confirma acciones destructivas como la baja.
 * - `NotificationToast`: muestra feedback de éxito o error.
 *
 * Props requeridas:
 * - `usuario`: datos de la cuenta infantil.
 * - `setLoading`: callback para controlar el estado de carga desde el componente padre.
 */
const CuentaInfantilCard: React.FC<CuentaInfantilCardProps> = ({ usuario, setLoading }) => {

    /**
     * VARIABLES
     */
    const iniciales = `${usuario.nombreUsuario.charAt(0)}${usuario.apellidosUsuario.charAt(0)}`.toUpperCase();
    const history = useHistory();
    const { userData, setUserData } = useUser();
    const [isModalCheckOpen, setIsModalCheckOpen] = useState<boolean>(false);
    const [isModalTransitionOpen, setisModalTransitionOpen] = useState<boolean>(false);
    const [esMayorDeEdad, setEsMayorDeEdad] = useState(false);
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
    })

    /**
     * FUNCIONALIDAD
     */
    useEffect(() => {
        if (usuario?.fechaNacimiento) {
            const fechaNac = new Date(usuario.fechaNacimiento);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            const dia = hoy.getDate() - fechaNac.getDate();
            const mayor = edad > 18 || (edad === 18 && (mes > 0 || (mes === 0 && dia >= 0)));

            setEsMayorDeEdad(mayor);
        }
    }, [usuario]);
    const cerrarDialogo = () => {
        setDialogState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    };

    const onAcceder = async () => {

        if (esMayorDeEdad) {
            // Mostrar notificación
            setToast({
                show: true,
                message: "El usuario ha alcanzado la mayoría de edad. Se ha enviado un correo con instrucciones.",
                color: "warning",
                icon: warningOutline,
            });
            setisModalTransitionOpen(true);
            // Enviar correo de transición
            await backendService.enviarCorreoTransicion(userData, usuario);
        }
        else {
            // Guardar datos actuales (tutor)
            if (userData) {
                localStorage.setItem('tutorData', JSON.stringify(userData));
            }
            // Establecer usuario infantil en el contexto
            setUserData(usuario);
            // Recargar página para que persista y todo se refresque
            window.location.replace('/principal');
        }

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

    const transicionACuentaRegular = async ({
        email,
        dni,
        password,
    }: {
        email: string;
        dni: string;
        password: string;
        confirmPassword: string;
    }) => {

        try {
            setLoading(true);

            const result = await backendService.nuevaCuentaDesdeInfantil({
                usuarioTutelado: usuario,
                email,
                dni,
                password,
            });

            if (result.success) {
                setToast({
                    show: true,
                    message: "Cuenta convertida a regular correctamente.",
                    color: "success",
                    icon: checkmarkOutline,
                });

                setisModalTransitionOpen(false);
            }
            else {
                setToast({
                    show: true,
                    message: "Error al registrar la nueva cuenta.",
                    color: "danger",
                    icon: alertCircleOutline,
                });
            }
        } catch (error: any) {
            setToast({
                show: true,
                message: error.message || "Error al registrar la nueva cuenta.",
                color: "danger",
                icon: alertCircleOutline,
            });
        } finally {
            setLoading(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    };


    /**
     * RENDER
     */
    return (
        <>
            <IonCard className="cuenta-card horizontal">
                <div className="cuenta-card-horizontal">
                    <div className="cuenta-card-left">
                        <div className="avatar-iniciales">{iniciales}</div>
                        <div className="cuenta-card-nombre">
                            <span className="nombre">{usuario.nombreUsuario} {usuario.apellidosUsuario}</span>
                            <span className="subtitulo">(Cuenta tutorizada)</span>
                            {esMayorDeEdad &&
                                <div className="cuenta-mayor-alerta">
                                    <IonIcon icon={alertCircleOutline} />
                                    <span className="alertGF">Cuenta mayor de edad</span>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="cuenta-card-right">
                        <IonButton expand="block" shape="round" className="boton-cuenta acceder" onClick={onAcceder}>
                            <IonIcon slot="start" icon={logInOutline} />
                            <span className="cardButtonTextGF">Acceso a cuenta</span>
                        </IonButton>

                        <IonButton expand="block" shape="round" className="boton-cuenta detalle" onClick={onVerDetalle} disabled={esMayorDeEdad}>
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
            <ModalTransitionAcc
                isOpen={isModalTransitionOpen}
                onConfirm={(data) => transicionACuentaRegular(data)}
                onCancel={() => setisModalTransitionOpen(false)}
                usuarioTutelado={usuario} />
        </>
    );
};

/**
 * Componente ModalTransitionAcc
 *
 * Este componente representa un modal que permite a un usuario tutelado realizar el proceso
 * de transición hacia una cuenta individual. Muestra un formulario en el que se deben introducir:
 * el correo electrónico, DNI (si no estaba ya registrado), y una nueva contraseña con su confirmación.
 *
 * El modal incluye validaciones de campos obligatorios, formato de correo, y coincidencia de contraseñas.
 * Se integra con un sistema de notificaciones tipo toast para informar al usuario sobre errores o acciones exitosas.
 *
 * Este proceso se activa después de que se haya enviado un correo con instrucciones al usuario.
 *
 * Props esperadas:
 * - isOpen: determina si el modal está visible.
 * - onConfirm: función que se ejecuta al confirmar el formulario.
 * - onCancel: función que se ejecuta al cerrar el modal sin confirmar.
 * - usuarioTutelado: datos del usuario tutelado (si existen) para precargar el DNI si ya está registrado.
 */
const ModalTransitionAcc: React.FC<ModalTransitionAccProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    usuarioTutelado
}) => {

    /**
     * VARIABLES
     */
    const [email, setEmail] = useState('');
    const [dni, setDni] = useState(usuarioTutelado?.dni?.trim() || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    /**
     * FUNCIONALIDAD
     */
    useEffect(() => {
        if (!isOpen) {
            // Cuando el modal se cierra, limpiamos el formulario
            setEmail('');
            setDni('');
            setPassword('');
            setConfirmPassword('');
        }
    }, [isOpen]);
    useEffect(() => {
        if (isOpen) {
            setDni(usuarioTutelado?.dni?.trim() || '');
        }
    }, [isOpen, usuarioTutelado]);

    const handleConfirm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !dni || !password || !confirmPassword) {
            setToast({
                show: true,
                message: "Por favor, rellena todos los campos.",
                color: "danger",
                icon: alertCircleOutline,
            });
            return;
        }

        if (!emailRegex.test(email)) {
            setToast({
                show: true,
                message: "El correo electrónico no es válido.",
                color: "danger",
                icon: alertCircleOutline,
            });
            return;
        }

        if (password !== confirmPassword) {
            setToast({
                show: true,
                message: "Las contraseñas no coinciden.",
                color: "danger",
                icon: alertCircleOutline,
            });
            return;
        }

        // Si todo está bien, llamamos a onConfirm
        onConfirm({ email, dni, password, confirmPassword });
        onCancel();
    };

    /**
     * RENDER
     */
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onCancel} className="customModalTransition">
            <IonHeader className="headerModalTransition">
                <div className="titleContainerModalTransition">
                    <IonIcon icon={constructOutline} size="large" />
                    <span className="titleModalTransition">Transición de Cuenta</span>
                </div>
            </IonHeader>

            <IonContent className="contentModalTransition">
                <div className="contentContainerModalTransition">
                    <div className="infoTextContainerModalTransition">
                        <IonIcon icon={informationCircleOutline} />
                        <span className="infoTextModalTransition">
                            Se ha enviado un correo con las instrucciones. Por favor, rellene los siguientes campos para continuar.
                        </span>
                    </div>

                    <div className="formContainerModalTransition">
                        <IonItem className="itemModalTransition">
                            <IonLabel position="stacked">Correo electrónico</IonLabel>

                            <IonInput
                                className="inputModalTransition"
                                type="email"
                                color={"success"}
                                value={email}
                                clearInput={true}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                                required
                            />
                        </IonItem>

                        <IonItem className="itemModalTransition">
                            {usuarioTutelado?.dni?.trim() ? (
                                <IonLabel position="stacked" color="danger" className="alertInputModalTransition">
                                    <IonIcon icon={warningOutline} style={{ marginRight: "6px" }} />
                                    El DNI ya fue registrado y no puede modificarse.
                                </IonLabel>
                            ) : (
                                <IonLabel position="stacked">DNI</IonLabel>
                            )}
                            <IonInput
                                className="inputModalTransition"
                                type="text"
                                color="success"
                                value={dni}
                                clearInput={!usuarioTutelado?.dni?.trim()}
                                onIonChange={(e) => setDni(e.detail.value!)}
                                readonly={!!usuarioTutelado?.dni?.trim()} //
                                maxlength={9}
                                required
                            />
                        </IonItem>

                        <IonItem className="itemModalTransition">
                            <IonLabel position="stacked">Contraseña</IonLabel>
                            <IonInput
                                className="inputModalTransition"
                                type="password"
                                color={"success"}
                                value={password}
                                clearInput={true}
                                onIonChange={(e) => setPassword(e.detail.value!)}
                                required
                            >
                                <IonInputPasswordToggle slot="end" color={"success"}></IonInputPasswordToggle>
                            </IonInput>
                        </IonItem>

                        <IonItem className="itemModalTransition">
                            <IonLabel position="stacked">Confirmar contraseña</IonLabel>
                            <IonInput
                                className="inputModalTransition"
                                type="password"
                                color={"success"}
                                clearInput={true}
                                value={confirmPassword}
                                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                                required
                            >
                                <IonInputPasswordToggle slot="end" color={"success"}></IonInputPasswordToggle>
                            </IonInput>
                        </IonItem>
                    </div>
                    <div className="buttonContainerModalTransition">
                        <IonButton
                            expand="block"
                            className="confirmButtonModalTransition"
                            shape="round"
                            onClick={() => handleConfirm()}
                        >
                            <IonIcon icon={checkmarkCircleOutline} />
                            <span className="buttonTextModalTransition">Confirmar</span>
                        </IonButton>

                        <IonButton
                            expand="block"
                            color="danger"
                            className="cancelButtonModalTransition"
                            onClick={onCancel}
                            shape="round"
                        >
                            <IonIcon icon={closeCircleOutline} />
                            <span className="buttonTextModalTransition">Cancelar</span>
                        </IonButton>
                    </div>
                </div>

            </IonContent>
            <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
        </IonModal>
    );
};

export default CuentasTutorizadas;