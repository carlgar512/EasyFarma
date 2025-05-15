import React, { useEffect, useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonInput, IonLabel, IonModal, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import MainFooter from "../mainFooter/MainFooter";
import { alertCircleOutline, arrowBackOutline, atOutline, brushOutline, checkmarkDoneOutline, checkmarkOutline, closeCircleOutline, closeOutline, cloudUploadOutline, eyeOff, eyeOutline, optionsOutline, warningOutline } from "ionicons/icons";
import './ModificaPerfil.css'
import { DatoUsuarioProps, ModalCambioDatoRegularProps } from "./ModificaPerfilInterfaces";
import ModalPasswordCheck from "../modalPasswordCheck/ModalPasswordCheck";
import NotificationToast from "../notification/NotificationToast";
import MapComponent from "../mapComponent/MapComponent";
import { useUser } from "../../context/UserContext";
import { InfoUserDTO, UserType } from "../../shared/interfaces/frontDTO";
import { backendService } from "../../services/backendService";


/**
 * Componente `ModificaPerfil`
 *
 * Este componente permite al usuario visualizar y modificar algunos de sus datos personales,
 * tales como dirección, teléfono, correo electrónico y contraseña. Además, permite confirmar la
 * identidad del usuario mediante una verificación de contraseña antes de realizar cualquier cambio sensible.
 *
 * Funcionalidades clave:
 * - Visualización de los datos personales del usuario.
 * - Edición controlada de campos modificables.
 * - Autenticación previa mediante modal antes de permitir cambios.
 * - Llamadas al backend para persistir cambios y actualización del contexto de usuario.
 * - Gestión de dos modales: uno para verificación de contraseña y otro para editar el valor.
 * - Muestra feedback de carga si los datos no están listos.
 */
const ModificaPerfil: React.FC = () => {

    /**
     * VARIABLES
     */
    const { userData, setUserData } = useUser();
    const [loading, setLoading] = useState(false);
    const [isModalCheckOpen, setIsModalCheckOpen] = useState<boolean>(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [campoEditando, setCampoEditando] = useState<keyof InfoUserDTO | null | "password">(null);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    /**
     * FUNCIONALIDAD
     */
    const handleCambiarContraseña = () => {
        setCampoEditando("password");
        setIsModalCheckOpen(true);

    };

    const handleVolver = () => {
        window.history.back();
    };

    const handleGuardarNuevoValor = async (nuevoValor: string, campo: string): Promise<boolean> => {
        if (!campoEditando || !userData) return false;

        const usuarioActualizado: InfoUserDTO = {
            ...userData,
            [campo]: campo === "modoAccesibilidad" ? nuevoValor === "true" : nuevoValor,
        };

        // 🔐 Si se está actualizando el email → primero Firebase Auth
        if (campo === "email") {
            try {
              await backendService.updateEmailFirebaseAuth(nuevoValor);
            } catch (error) {
              setToast({
                show: true,
                message: "Error al actualizar el email en Firebase.",
                color: "danger",
                icon: closeCircleOutline,
              });
              return false;
            }
          }
          
          else if (campo === "password") {
            try {
              await backendService.passwordReset(userData.dni, nuevoValor);
            } catch (error) {
              setToast({
                show: true,
                message: "Error al actualizar la contraseña.",
                color: "danger",
                icon: closeCircleOutline,
              });
              return false;
            }
          }
          
          else if (campo === "dni") {
            try {
              const response = await backendService.existeDNIRegistrado(nuevoValor);
              if (response) {
                setToast({
                  show: true,
                  message: "El DNI ya está registrado.",
                  color: "danger",
                  icon: closeCircleOutline,
                });
                return false;
              }
            } catch (error) {
              setToast({
                show: true,
                message: "Error al verificar el DNI.",
                color: "danger",
                icon: closeCircleOutline,
              });
              return false;
            }
          }
          
          try {
            const response = await backendService.updateUserInfo(usuarioActualizado);
            if (response.success) {
              setUserData(usuarioActualizado);
              setToast({
                show: true,
                message: "Usuario actualizado correctamente",
                color: "success",
                icon: checkmarkOutline,
              });
              return true;
            } else {
              setToast({
                show: true,
                message: response.error || "Error del servidor al guardar los cambios.",
                color: "danger",
                icon: closeCircleOutline,
              });
              return false;
            }
          } catch (error) {
            setToast({
              show: true,
              message: "Error al guardar los cambios.",
              color: "danger",
              icon: closeCircleOutline,
            });
            return false;
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
                    <IonContent fullscreen className="contentMP">
                        <div className="contentMPCentral">
                            <div className="titleContainerMP">
                                <IonIcon
                                    className="iconOperation"
                                    slot="icon-only"
                                    icon={optionsOutline}
                                    size="large"
                                />
                                <span className="tittleTextMP">Buenas tardes, {userData?.nombreUsuario}</span>
                            </div>
                            <div className="infoContainer">

                                <DatoUsuario
                                    label="Nombre:"
                                    value={userData?.nombreUsuario}
                                    editable={false}
                                    setIsModalOpen={() => setIsModalCheckOpen(true)}
                                />

                                <DatoUsuario
                                    label="Apellidos:"
                                    value={userData?.apellidosUsuario}
                                    editable={false}
                                    setIsModalOpen={() => setIsModalCheckOpen(true)}
                                />

                                <DatoUsuario
                                    label="Dni:"
                                    value={userData?.dni}
                                    editable={userData?.dni === ""}
                                    setIsModalOpen={() => { setCampoEditando("dni"); setIsModalCheckOpen(true); }}
                                />

                                <DatoUsuario
                                    label="Fecha de nacimiento:"
                                    value={
                                        userData?.fechaNacimiento
                                            ? new Date(userData.fechaNacimiento).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                            : ''
                                    }
                                    editable={false}
                                    setIsModalOpen={() => setIsModalCheckOpen(true)}
                                />

                                <DatoUsuario
                                    label="Email:"
                                    value={userData?.email}
                                    editable={userData?.tipoUsuario !== UserType.INFANTIL}
                                    setIsModalOpen={() => { setCampoEditando("email"); setIsModalCheckOpen(true); }}
                                />

                                <DatoUsuario
                                    label="Dirección:"
                                    value={userData?.direccion}
                                    editable={true}
                                    setIsModalOpen={() => { setCampoEditando("direccion"); setIsModalCheckOpen(true); }}
                                />

                                <DatoUsuario
                                    label="Teléfono:"
                                    value={userData?.telefono}
                                    editable={true}
                                    setIsModalOpen={() => { setCampoEditando("telefono"); setIsModalCheckOpen(true); }}
                                />

                                <DatoUsuario
                                    label="Tipo de usuario:"
                                    value={userData?.tipoUsuario}
                                    editable={false}
                                    setIsModalOpen={() => setIsModalCheckOpen(true)}
                                />
                                {
                                    userData.tipoUsuario !== UserType.INFANTIL &&

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
                                }
                                <div className="buttonContainerMP">
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

                        </div>

                    </IonContent>
                )}
                {(loading || !userData) &&
                    <IonContent fullscreen className="contentMP">
                        <div className="contentTACentralMP">
                            <div className="spinnerContainerMP">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerP">Cargando su información. Un momento, por favor...</span>
                            </div>
                            {!loading &&
                                <div className="buttonContainerMP">
                                    <IonButton
                                        size="large"
                                        expand="full"
                                        shape="round"
                                        className="buttonVolver"
                                        onClick={handleVolver}
                                    >
                                        <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                        <span className="buttonTextMP">Volver</span>
                                    </IonButton>
                                </div>
                            }
                        </div>
                    </IonContent>
                }
                <MainFooter />
            </IonPage>

            <ModalPasswordCheck
                isOpen={isModalCheckOpen}
                setIsModalOpen={setIsModalCheckOpen}
                dni={""}
                onSuccess={() => {
                    setIsModalCheckOpen(false);
                    setIsSecondModalOpen(true);
                }}
            />

            <ModalCambioDatoRegular
                isOpen={isSecondModalOpen}
                setIsModalOpen={setIsSecondModalOpen}
                campo={campoEditando}
                valor={
                    campoEditando && campoEditando !== "password"
                        ? String(userData?.[campoEditando] ?? "")
                        : ""
                }
                onGuardar={handleGuardarNuevoValor}
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
 * Componente DatoUsuario
 * 
 * Este componente representa un campo informativo del perfil de usuario,
 * mostrando una etiqueta (`label`) y su valor (`value`). Si el campo es editable,
 * se muestra un botón con un icono de edición que permite lanzar una acción externa
 * definida por `setIsModalOpen`.
 * 
 * Props:
 * - label: nombre del campo (ej. "Nombre", "Email").
 * - value: valor actual del campo.
 * - editable: booleano que indica si se permite la edición.
 * - setIsModalOpen: función que se ejecuta al hacer clic en el botón de edición.
 */
const DatoUsuario: React.FC<DatoUsuarioProps> = ({ label, value, editable, setIsModalOpen }) => {

    /**
     * RENDER
     */
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


/**
 * Componente ModalCambioDatoRegular
 *
 * Este componente representa un modal reutilizable destinado a modificar diferentes campos del perfil del usuario,
 * tales como dirección, email, teléfono, contraseña, entre otros. Gestiona la validación, confirmación y envío de los
 * nuevos valores, así como la lógica específica según el tipo de dato a modificar.
 *
 * Props:
 * - isOpen: controla si el modal está abierto.
 * - setIsModalOpen: función para cerrar el modal.
 * - campo: campo del perfil a modificar ("email", "telefono", "direccion", etc.).
 * - valor: valor actual del campo.
 * - onGuardar: función que se ejecuta al confirmar la actualización; debe devolver un booleano de éxito.
 *
 * Características clave:
 * - Incluye validación personalizada por tipo de dato.
 * - Presenta una segunda pantalla de confirmación antes de actualizar.
 * - Admite campos especiales como contraseñas y direcciones (con soporte de selección desde mapa).
 * - Muestra feedback visual (toasts) según el resultado de la operación.
 */
const ModalCambioDatoRegular: React.FC<ModalCambioDatoRegularProps> = ({
    isOpen,
    setIsModalOpen,
    campo,
    valor,
    onGuardar
}) => {

    /**
     * VARIABLES
     */
    const [nuevoValor, setNuevoValor] = useState(valor);
    const [cargando, setCargando] = useState(false);
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [nuevaDireccion, setNuevaDireccion] = useState("");
    const [finalCheck, setfinalCheck] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    /**
     * FUNCIONALIDADES
     */
    useEffect(() => {
        if (campo === "direccion") {
            setNuevaDireccion(valor);
        } else {
            setNuevoValor(valor);
        }

        setNuevaPassword("");
        setConfirmPassword("");
    }, [valor]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleActualizar = async () => {
        setfinalCheck(false);

        if (!esValorValido()) {
            setToast({
                show: true,
                message: campo === "password"
                    ? "La contraseña y su confirmación deben ser iguales."
                    : `El formato del campo introducido no es válido. Por favor, introduce un valor correcto para el campo ${campo?.toLowerCase()}`,
                color: "danger",
                icon: alertCircleOutline,
            });
            return;
        }

        try {
            setCargando(true);
            const ok = await onGuardar(
                campo === "password"
                    ? nuevaPassword
                    : campo === "direccion"
                        ? nuevaDireccion
                        : nuevoValor,
                campo!
            );

            if (ok) {
                setToast({
                    show: true,
                    message: `El campo ${campo?.toLowerCase()} se ha actualizado correctamente.`,
                    color: "success",
                    icon: checkmarkDoneOutline,
                });
                setIsModalOpen(false);
            } else {
                setToast({
                    show: true,
                    message: `Hubo un error al guardar el campo ${campo?.toLowerCase()}. Inténtalo más tarde.`,
                    color: "danger",
                    icon: alertCircleOutline,
                });
            }

        } catch (error) {
            setToast({
                show: true,
                message: `Error inesperado al guardar el campo ${campo?.toLowerCase()}.`,
                color: "danger",
                icon: alertCircleOutline,
            });
        } finally {
            setCargando(false);
        }
    };

    const handleCerrar = () => {
        setfinalCheck(false);
        setNuevoValor(valor); // Resetea
        setIsModalOpen(false);
        // Limpia el foco manualmente
        setTimeout(() => {
            (document.activeElement as HTMLElement)?.blur();
        }, 50);
    };

    const handleCancel = () => {
        setfinalCheck(false);
    };

    const handleFinalCheck = () => {
        setfinalCheck(true);
    };

    const esEmailValido = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const esDniValido = (dni: string) => {
        // DNI español: 8 dígitos + letra
        return /^[0-9]{8}[A-Za-z]$/.test(dni);
    };

    const esTelefonoValido = (telefono: string) => {
        return /^[0-9]{9}$/.test(telefono); // 9 dígitos, solo números
    };

    const esValorValido = () => {
        if (campo === "email") return esEmailValido(nuevoValor.trim());
        if (campo === "telefono") return esTelefonoValido(nuevoValor.trim());
        if (campo === "dni") return esDniValido(nuevoValor.trim());
        if (campo === "password") return nuevaPassword.trim() !== "" && nuevaPassword === confirmPassword;
        if (campo === "direccion") return nuevaDireccion.trim() !== "" && nuevaDireccion.trim() !== valor.trim();
        return true;
    };

    const esBotonDesactivado = () => {
        if (cargando) return true;

        if (campo === "password") {
            return (
                nuevaPassword.trim() === "" ||
                confirmPassword.trim() === "" ||
                nuevaPassword !== confirmPassword
            );
        }

        if (campo === "direccion") {
            return (
                nuevaDireccion.trim() === "" ||
                nuevaDireccion.trim() === valor.trim()
            );
        }

        return (
            nuevoValor.trim() === "" ||
            nuevoValor.trim() === valor.trim() ||
            !esValorValido()
        );
    };

    /**
     * RENDER
     */
    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={handleCerrar}>

                {
                    finalCheck ? (
                        <IonContent className="ion-padding">
                            <div className="modalContainerMPDR">
                                <div className="modalTittleMPDR">
                                    <IonIcon icon={warningOutline} color={"warning"} size="large" />
                                    <span className="modalTittleMPDR">Confirmación de actualización de perfil</span>
                                </div>
                                <div className="dataContainer">
                                    <span className="finalCheckText">
                                        ¿Estás seguro de que deseas registrar este cambio?
                                        Aunque no es un cambio permanente, afectará a tus futuras operaciones y será utilizado como referencia en tus próximos accesos y gestiones.
                                    </span>
                                </div>
                                <div className="modalButtonContainerMPDR">
                                    <IonButton
                                        className="buttonMPDR1"
                                        shape="round"
                                        onClick={handleActualizar}
                                        disabled={esBotonDesactivado()}
                                    >
                                        <IonIcon icon={cloudUploadOutline} />
                                        <span className="buttonTextMPDR">Confirmar actualización</span>
                                    </IonButton>
                                    <IonButton className="buttonMPDR2" shape="round" onClick={handleCancel}>
                                        <IonIcon icon={closeOutline} />
                                        <span className="buttonTextMPDR">Cancelar</span>
                                    </IonButton>
                                </div>
                            </div>
                        </IonContent>

                    ) : (
                        <IonContent className="ion-padding">
                            <div className="modalContainerMPDR">
                                {/* Título */}
                                <div className="modalTittleMPDR">
                                    <IonIcon icon={cloudUploadOutline} size="large" />
                                    <span className="modalTittleMPDR">Actualización de perfil</span>
                                </div>

                                {/* Valores */}
                                {cargando ? (
                                    <div className="spinnerContainer">
                                        <IonSpinner name="circular" className="SpinnerMCDR" />
                                        <span className="spinnerText">Se está procesando su solicitud. Por favor, manténgase a la espera...</span>
                                    </div>

                                ) : (
                                    <>  {campo === "direccion" ? (
                                        <div className="dataContainer">
                                            <div className="campoAnterior">
                                                <strong>Dirección actual:</strong>
                                                <p>{valor}</p>
                                            </div>

                                            <IonInput
                                                placeholder="Introduce nueva dirección"
                                                value={nuevaDireccion}
                                                onIonInput={(e) =>
                                                    setNuevaDireccion((e.target as unknown as HTMLInputElement).value)
                                                }
                                                className="campoNuevo"
                                                color="success"
                                            />

                                            {/* Aquí irá el mapa */}
                                            <div className="mapContainer">
                                                <MapComponent onSelect={(direccion) => setNuevaDireccion(direccion)} direccionInicial={valor ?? "Valladolid"} />
                                            </div>
                                        </div>
                                    ) :
                                        campo === "password" ? (

                                            <div className="dataContainer">
                                                <span className="campoAnterior">
                                                    Por favor, introduzca una nueva contraseña y su confirmación para continuar.
                                                </span>
                                                <div className="pswContainer">
                                                    <IonInput
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Nueva contraseña"
                                                        value={nuevaPassword}
                                                        onIonInput={(e) => setNuevaPassword((e.target as unknown as HTMLInputElement).value)}
                                                        className="campoNuevo"
                                                        color={"success"}
                                                        clearInput
                                                    />

                                                    <IonButton
                                                        fill="clear"
                                                        size="small"
                                                        onClick={togglePasswordVisibility}
                                                        color="success"
                                                    >
                                                        {!showPassword ? <IonIcon icon={eyeOutline} size="large" /> : <IonIcon icon={eyeOff} size="large" />}
                                                    </IonButton>
                                                </div>
                                                <div className="pswContainer">
                                                    <IonInput
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Confirmar contraseña"
                                                        value={confirmPassword}
                                                        onIonInput={(e) => setConfirmPassword((e.target as unknown as HTMLInputElement).value)}
                                                        className="campoNuevo"
                                                        color={"success"}
                                                        clearInput
                                                    />
                                                    <IonButton
                                                        fill="clear"
                                                        size="small"
                                                        onClick={togglePasswordVisibility}
                                                        color="success"
                                                    >
                                                        {!showPassword ? <IonIcon icon={eyeOutline} size="large" /> : <IonIcon icon={eyeOff} size="large" />}
                                                    </IonButton>
                                                </div>
                                            </div>
                                        ) : (

                                            <div className="dataContainer">
                                                <div className="campoAnterior">
                                                    <strong>Valor actual:</strong>
                                                    <p><p>{valor?.trim() ? valor : "No hay valor registrado"}</p></p>
                                                </div>
                                                <IonInput
                                                    placeholder={`Introduce nuevo ${campo}`}
                                                    value={nuevoValor}
                                                    color={"success"}
                                                    onIonInput={(e) =>
                                                        setNuevoValor((e.target as unknown as HTMLInputElement).value)
                                                    }
                                                    className="campoNuevo"
                                                    clearInput
                                                />
                                            </div>
                                        )}

                                        {/* Botones */}
                                        <div className="modalButtonContainerMPDR">
                                            <IonButton
                                                className="buttonMPDR1"
                                                shape="round"
                                                onClick={handleFinalCheck}
                                                disabled={esBotonDesactivado()}
                                            >
                                                <IonIcon icon={cloudUploadOutline} />
                                                <span className="buttonTextMPDR">Actualizar valor</span>
                                            </IonButton>
                                            <IonButton className="buttonMPDR2" shape="round" onClick={handleCerrar}>
                                                <IonIcon icon={closeOutline} />
                                                <span className="buttonTextMPDR">Descartar</span>
                                            </IonButton>
                                        </div>
                                    </>
                                )}
                            </div>

                        </IonContent>
                    )
                }

            </IonModal>
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



export default ModificaPerfil;