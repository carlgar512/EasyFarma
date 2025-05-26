import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonList, IonModal, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { addCircleOutline, alertCircleOutline, arrowBackOutline, checkmarkOutline, closeCircleOutline, informationCircleOutline, personAddOutline, trashBinOutline, trashOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './DetalleCuentaInfantil.css'
import { DetalleCuentaInfantilProps, NuevoTutorProps, TutorCardProps } from "./DetalleCuentaInfantilInterfaces";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import ModalPasswordCheck from "../modalPasswordCheck/ModalPasswordCheck";
import NotificationToast from "../notification/NotificationToast";
import { useUser } from "../../context/UserContext";
import { backendService } from "../../services/backendService";

/**
 * DetalleCuentaInfantilWrapper.tsx
 *
 * Este componente actúa como wrapper para redirigir a `DetalleCuentaInfantil`,
 * extrayendo el usuario infantil desde el estado de la navegación (`location.state`).
 * Se utiliza al seleccionar una cuenta tutelada desde la vista de gestión familiar.
 *
 * Props:
 * - No recibe props directas. El usuario infantil se obtiene desde `useLocation`.
 *
 * Renderiza:
 * - El componente `DetalleCuentaInfantil` pasando el usuario recibido como prop.
 */
const DetalleCuentaInfantilWrapper: React.FC = () => {

    /**
     * VARIABLES
     */
    const location = useLocation<{ usuario }>();
    const user = location.state?.usuario;

    /**
     * RENDER
     */
    return <DetalleCuentaInfantil usuario={user} />;
};

/**
 * DetalleCuentaInfantilWrapper.tsx
 *
 * Este componente actúa como wrapper para redirigir a `DetalleCuentaInfantil`,
 * extrayendo el usuario infantil desde el estado de la navegación (`location.state`).
 * Se utiliza al seleccionar una cuenta tutelada desde la vista de gestión familiar.
 *
 * Props:
 * - No recibe props directas. El usuario infantil se obtiene desde `useLocation`.
 *
 * Renderiza:
 * - El componente `DetalleCuentaInfantil` pasando el usuario recibido como prop.
 */
const DetalleCuentaInfantil: React.FC<DetalleCuentaInfantilProps> = ({ usuario }) => {

    /**
     * VARIABLES
     */
    const [usuarioState, setUsuarioState] = useState(usuario);
    const iniciales = `${usuarioState.nombreUsuario.charAt(0)}${usuarioState.apellidosUsuario.charAt(0)}`.toUpperCase();
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const [isModalCheckOpen, setIsModalCheckOpen] = useState<boolean>(false);
    const [isNuevoTutorOpen, setNuevoTutorOpen] = useState<boolean>(false);
    const [tutores, setTutores] = useState<any[]>([]);
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
    useEffect(() => {
        const fetchTutores = async () => {
            try {
                setLoading(true);
                const result = await backendService.getTutoresPorTutelado(usuarioState.uid);
                setTutores(result);
            } catch (error: any) {
                setToast({
                    show: true,
                    message: error.message || "Error al cargar los tutores.",
                    color: "danger",
                    icon: alertCircleOutline,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTutores();
    }, [usuarioState.uid]);

    const cerrarDialogo = () => {
        setDialogState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    };

    const handleVolver = () => {
        history.replace('/family-management');
    };

    const bajaUsuarioDobleConf = () => {
        setDialogState({
            isOpen: true,
            tittle: "Baja de cuenta infantil",
            message: `¿Estás seguro de que deseas dar de baja la cuenta infantil de ${usuarioState.nombreUsuario} ${usuarioState.apellidosUsuario}? No podrás seguir gestionando esta cuenta.`,
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
                history.replace("/family-management");
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

    /**
     * RENDER
     */
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Detalle de cuenta infantil" />
                {!loading ? (
                    <IonContent fullscreen className="contentDAI">
                        <div className="contentCentralDAI">
                            <div className="seccionCuentaDAI">
                                <div className="avatarCuentaDAI">{iniciales}</div>
                                <div className="infoNombreDAI">
                                    <span className="tituloCuentaDAI" >{usuarioState.nombreUsuario} {usuarioState.apellidosUsuario}</span>
                                    <span className="subtituloCuentaDAI">(Cuenta tutorizada)</span>
                                </div>
                                <IonButton className="buttonBajaDAI" shape="round" size="large" onClick={() => setIsModalCheckOpen(true)}>
                                    <IonIcon icon={trashOutline} size="large" slot="icon-only" />
                                </IonButton>
                            </div>

                            <div className="detalleCuentaDAI">

                                <div className="tittleDetalleContainerDAI">
                                    <span className="detalleTextDAI">Detalle</span>
                                    <hr className="lineaSepDAI" />
                                </div>

                                <div className="lineaInfoDAI">
                                    <span className="atributeDAIText">Dni:</span>
                                    <span className="valueDAIText">
                                        {usuarioState.dni?.trim() ? usuarioState.dni : "Dni no registrado para este usuario."}
                                    </span>
                                </div>
                                <div className="lineaInfoDAI">
                                    <span className="atributeDAIText">Nº de tarjeta:</span>
                                    <span className="valueDAIText">{usuarioState.numTarjeta}</span>
                                </div>
                                <div className="lineaInfoDAI">
                                    <span className="atributeDAIText">Fecha de nacimiento:</span>
                                    <span className="valueDAIText">{usuarioState.fechaNacimiento
                                        ? new Date(usuarioState.fechaNacimiento).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })
                                        : "Fecha no disponible"}</span>
                                </div>
                            </div>

                            <div className="tutoresSectionDAI">
                                <div className="tittleDetalleContainerDAI">
                                    <hr className="lineaSepDAI" />
                                    <span className="tutorTitleDAI">Tutores</span>
                                    <hr className="lineaSepDAI" />
                                </div>
                                <div className="infoLabelTutoresGF">
                                    <IonIcon icon={informationCircleOutline} className="iconoInfoGF" />
                                    <span>
                                        En esta sección se muestran los tutores activos de esta cuenta infantil, incluyéndote a ti mismo.
                                    </span>
                                </div>
                                <div className="tutoresContainerDAI">
                                    {tutores.length > 0 ? (
                                        tutores.map((tutor) => (
                                            <TutorCard
                                                key={tutor.uid}
                                                tutor={tutor}
                                                tutelado={usuarioState}
                                                setLoading={setLoading}
                                            />
                                        ))
                                    ) : (
                                        <div className="sinCuentasGF">
                                            <p className="mensajeSinCuentas">No tiene tutores asignados.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="buttonsContainerDAI">
                                <IonButton
                                    className="buttonNewTutorDAI"
                                    shape="round"
                                    size="large"
                                    expand="full"
                                    onClick={() => setNuevoTutorOpen(true)}
                                >
                                    <IonIcon icon={addCircleOutline} size="large" slot="icon-only"></IonIcon>
                                    <span className="buttonTextDAI">Añadir tutor</span>
                                </IonButton>
                                <IonButton
                                    className="buttonReturnDAI"
                                    shape="round"
                                    size="large"
                                    expand="full"
                                    onClick={handleVolver}
                                >
                                    <IonIcon icon={arrowBackOutline} size="large" slot="icon-only"></IonIcon>
                                    <span className="buttonTextDAI">Volver</span>
                                </IonButton>
                            </div>
                        </div>

                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentDAI">
                        <div className="contentCentralDAISpinner">
                            <div className="spinnerContainerDAI">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerDAI">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonsContainerDAI">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonReturnDAI"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextDAI">Volver</span>
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                )};
                <MainFooter />

            </IonPage >
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
            <NuevoTutor
                isOpen={isNuevoTutorOpen}
                onClose={() => setNuevoTutorOpen(false)}
                idTutelado={usuarioState.uid}
                setLoading={setLoading}
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

/**
 * Componente TutorCard
 *
 * Muestra la información básica de un tutor vinculado a una cuenta infantil,
 * incluyendo nombre, número de tarjeta y fecha de nacimiento.
 *
 * Si el tutor mostrado no es el usuario actual, se habilita un botón para eliminarlo
 * de la relación de tutela. La eliminación está protegida con una confirmación doble
 * y notificaciones visuales.
 *
 * Props:
 * - tutor: Usuario tutor a mostrar
 * - tutelado: Usuario infantil asociado
 * - setLoading: Función para activar/desactivar el estado de carga
 */

const TutorCard: React.FC<TutorCardProps> = ({ tutor, tutelado, setLoading }) => {

    /**
     * VARIABLES
     */
    const iniciales = `${tutor.nombreUsuario.charAt(0)}${tutor.apellidosUsuario.charAt(0)}`.toUpperCase();
    const { userData } = useUser();
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

    const onEliminaTutor = async () => {
        setLoading(true);
        cerrarDialogo();
        try {
            const tutela = await backendService.getTutelaActivaEntreDos(tutor.uid, tutelado.uid);

            if (!tutela) {
                setToast({
                    show: true,
                    message: "No existe una tutela activa entre este tutor y tutelado.",
                    color: "warning",
                    icon: alertCircleOutline,
                });
                return;
            }

            await backendService.finalizarTutela(tutela.idTutela);

            setToast({
                show: true,
                message: "Tutela finalizada correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });

        } catch (error: any) {
            setToast({
                show: true,
                message: error.message || "Error al finalizar la tutela.",
                color: "danger",
                icon: alertCircleOutline,
            });
        }
        finally {
            setTimeout(() => {
                setLoading(false);
                window.location.reload();
            }, 1000);
        }
    };

    const onEliminaTutorDobleCheck = () => {
        setDialogState({
            isOpen: true,
            tittle: "Eliminar tutor",
            message: `¿Estás seguro de que deseas eliminar al tutor ${tutor.nombreUsuario} ${tutor.apellidosUsuario} de la cuenta infantil de ${tutelado.nombreUsuario} ${tutelado.apellidosUsuario}? El tutor eliminado no podrá volver a gestionar esta cuenta, aunque podrás volver a añadirlo si lo deseas.`,
            img: "bajaCuenta.svg",
            onConfirm: () => onEliminaTutor()
        })
    }

    /**
     * RENDER
     */
    return (
        <>

            <div className="tutorCardDAI">
                <div className="avatarTutorDAI">{iniciales}</div>
                <div className="tutorInfoDAI">
                    <span className="nameTutorDAI">{tutor.nombreUsuario} {tutor.apellidosUsuario}</span>
                    <div className="lineaInfoDAI">
                        <span className="atributeDAIText">Nº de tarjeta:</span>
                        <span className="valueDAIText">{tutor.numTarjeta}</span>
                    </div>
                    <div className="lineaInfoDAI">
                        <span className="atributeDAIText">Fecha de nacimiento:</span>
                        <span className="valueDAIText">
                            {tutor.fechaNacimiento
                                ? new Date(tutor.fechaNacimiento).toLocaleDateString('es-ES',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })
                                : "Fecha no disponible"}</span>
                    </div>
                </div>
                <div className="buttonContainerTutorCardDAI">
                    {userData && tutor.uid !== userData.uid && (
                        <IonButton className="eliminarTutorBtnDAI" onClick={() => onEliminaTutorDobleCheck()}>
                            <IonIcon icon={trashBinOutline} />
                            <span className="buttonTextEliminaTutDAI">Eliminar tutor</span>
                        </IonButton>
                    )}
                </div>
            </div >
            <DobleConfirmacion
                isOpen={dialogState.isOpen}
                tittle={dialogState.tittle}
                message={dialogState.message}
                img={dialogState.img}
                onConfirm={dialogState.onConfirm}
                onCancel={() => cerrarDialogo()}
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

/**
 * Componente modal `NuevoTutor`
 * 
 * Permite agregar un nuevo tutor a una cuenta infantil. El usuario debe proporcionar el DNI y número de tarjeta
 * del tutor que se desea añadir. Se valida si el tutor existe y si no tiene ya una tutela activa con el tutelado.
 * 
 * En caso de validación positiva, se muestra una confirmación antes de registrar la nueva tutela.
 * 
 * Props:
 * - `isOpen`: controla si el modal está abierto.
 * - `onClose`: función para cerrar el modal.
 * - `idTutelado`: UID del usuario infantil al que se le añadirá el tutor.
 * - `setLoading`: función para controlar el estado de carga desde el componente padre.
 */
const NuevoTutor: React.FC<NuevoTutorProps> = ({ isOpen, onClose, idTutelado, setLoading }) => {

    /**
     * VARIABLES
     */
    const [nuevoTutor, setNuevoTutor] = useState({
        dni: "",
        numTarjeta: "",
    });
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });
    const dniValido = /^[0-9]{8}[A-Z]$/.test(nuevoTutor.dni.trim().toUpperCase());
    const tarjetaValida = /^\d{4} \d{4} \d{4} \d{4}$/.test(nuevoTutor.numTarjeta.trim());
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

    const handleAgregar = async () => {
        const tutorFormateado = {
            dni: nuevoTutor.dni.trim().toUpperCase(),
            numTarjeta: nuevoTutor.numTarjeta.trim(),
        };

        try {
            // 1. Comprobar tutor por DNI + tarjeta
            const tutor = await backendService.comprobarNuevoTutor(
                tutorFormateado.dni,
                tutorFormateado.numTarjeta
            );

            if (!tutor) {
                setToast({
                    show: true,
                    message: "No se ha encontrado un usuario con los datos proporcionados.",
                    color: "danger",
                    icon: alertCircleOutline,
                });
                return;
            }

            // 2. Comprobar si ya hay tutela activa
            const tutelaActiva = await backendService.getTutelaActivaEntreDos(tutor.uid, idTutelado);

            if (tutelaActiva) {
                setToast({
                    show: true,
                    message: "Este tutor ya tiene una tutela activa con el usuario.",
                    color: "warning",
                    icon: alertCircleOutline,
                });
                return;
            }

            // 3. Mostrar confirmación
            setDialogState({
                isOpen: true,
                tittle: "Añadir nuevo tutor",
                message: `¿Estás seguro de que deseas añadir al usuario con DNI: ${tutorFormateado.dni} como tutor de esta cuenta? Este usuario tendrá acceso y permisos de edición sobre la cuenta tutelada. Esta acción podrá ser modificada más adelante.`,
                img: "addTutor.svg",
                onConfirm: () => confirmarAgregarTutor(tutor.uid),
            });
            setNuevoTutor({ dni: "", numTarjeta: "" });

        } catch (error: any) {
            setToast({
                show: true,
                message: error.message || "Error al añadir el nuevo tutor.",
                color: "danger",
                icon: alertCircleOutline,
            });
        }
    };

    const confirmarAgregarTutor = async (tutorUid: string) => {
        onClose();
        cerrarDialogo();
        setLoading(true);
        try {
            // Guardar nueva tutela
            await backendService.guardarTutela(tutorUid, idTutelado);

            setToast({
                show: true,
                message: "Tutor añadido correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });

            setNuevoTutor({ dni: "", numTarjeta: "" });


        } catch (error: any) {
            setToast({
                show: true,
                message: error.message || "Error al guardar la nueva tutela.",
                color: "danger",
                icon: alertCircleOutline,
            });
        }
        finally {
            setTimeout(() => {
                onClose();
                location.reload();
                setLoading(false);
            }, 1000);
        }
    };

    /**
     * RENDER
     */
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader className="headerModalNewTutor">
                <IonIcon icon={personAddOutline} size="large" slot="icon-only" />
                <span className="modalNewTutorTittle">Añadir nuevo tutor</span>

            </IonHeader>

            <IonContent className="ion-padding">
                <div className="contentModalNewTutor">
                    {/* 📝 Texto informativo */}
                    <div className="infoLabelAddTutor">
                        <IonIcon icon={informationCircleOutline} className="iconoInfoAddTutor" />
                        <span>
                            Este nuevo tutor podrá acceder y gestionar la cuenta infantil. Podrá ser eliminado más adelante si es necesario.
                        </span>
                    </div>

                    {/* Inputs */}
                    <IonList className="form-listNewTutorModal">
                        <div className="form-itemNewTutorModal">
                            <span className="form-labelNewTutorModal">DNI del tutor:</span>
                            <IonInput
                                className="form-inputNewTutorModal"
                                color={"success"}
                                value={nuevoTutor.dni}
                                clearInput={true}
                                placeholder="Ej: 12345678A"
                                onIonInput={(e) => {
                                    const value = e.detail.value!.toUpperCase().slice(0, 9);
                                    setNuevoTutor({ ...nuevoTutor, dni: value });
                                }}
                            />
                        </div>

                        <div className="form-itemNewTutorModal">
                            <span className="form-labelNewTutorModal">Nº de tarjeta:</span>
                            <IonInput
                                className="form-inputNewTutorModal"
                                color={"success"}
                                value={nuevoTutor.numTarjeta}
                                clearInput={true}
                                placeholder="Ej: 1234-5678-9012-3456"
                                onIonInput={(e) => {
                                    const raw = e.detail.value!.replace(/\D/g, ""); // quitar todo lo que no sea dígito
                                    const formatted = raw
                                        .match(/.{1,4}/g) // agrupar de 4 en 4
                                        ?.join(" ")       // unir con guiones
                                        .slice(0, 19) || ""; // limitar a 19 caracteres: 16 dígitos + 3 guiones

                                    setNuevoTutor({ ...nuevoTutor, numTarjeta: formatted });
                                }}
                            />
                        </div>
                    </IonList>

                    {/* Botones */}
                    <div className="botonesModalTutor">
                        <IonButton
                            className="buttonModalNewTutor1"
                            expand="block"
                            shape="round"
                            disabled={!dniValido || !tarjetaValida}
                            onClick={handleAgregar}
                        >
                            <IonIcon icon={personAddOutline}></IonIcon>
                            <span className="buttonTextModalNewTutor">Agregar tutor</span>
                        </IonButton>

                        <IonButton
                            className="buttonModalNewTutor2"
                            expand="block"
                            shape="round"
                            onClick={onClose}>
                            <IonIcon icon={closeCircleOutline}></IonIcon>
                            <span className="buttonTextModalNewTutor">Descartar</span>
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
            <DobleConfirmacion
                isOpen={dialogState.isOpen}
                tittle={dialogState.tittle}
                message={dialogState.message}
                img={dialogState.img}
                onConfirm={dialogState.onConfirm}
                onCancel={() => cerrarDialogo()}
            />
        </IonModal>
    );
};

export default DetalleCuentaInfantilWrapper;