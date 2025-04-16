import React, { useEffect, useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonInput, IonLabel, IonModal, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import MainFooter from "../mainFooter/MainFooter";
import { alertCircleOutline, arrowBackOutline, atOutline, brushOutline, checkmarkDoneOutline, checkmarkOutline, closeOutline, cloudUploadOutline, eyeOff, eyeOutline, optionsOutline, warningOutline } from "ionicons/icons";
import './ModificaPerfil.css'
import { DatoUsuarioProps, ModalCambioDatoRegularProps } from "./ModificaPerfilInterfaces";
import ModalPasswordCheck from "../modalPasswordCheck/ModalPasswordCheck";
import NotificationToast from "../notification/NotificationToast";
import MapComponent from "../mapComponent/MapComponent";
import { useUser } from "../../context/UserContext";
import { InfoUserDTO } from "../../shared/interfaces/frontDTO";
import { backendService, updateUserInfo } from "../../services/backendService";

const ModificaPerfil: React.FC = () => {

    const { userData, setUserData } = useUser();
    const [loading, setLoading] = useState(false);

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
                console.error("❌ Error al actualizar email en Firebase Auth:", error);
                return false;
              }
        }

        else if (campo === "password") {
            try {
                await backendService.passwordReset(userData.dni, nuevoValor);
              } catch (error) {
                console.error("❌ Error al actualizar la contraseña:", error);
                return false;
              }
        }

        try {
            const response = await updateUserInfo(usuarioActualizado);
            if (response.success) {
                setUserData(usuarioActualizado);
                return true; // ✅ Todo bien
            } else {
                console.error("❌ Error del servidor:", response.error);
                return false;
            }
        } catch (error) {
            console.error("❌ Error al guardar:", error);
            return false;
        }
    };


    const [isModalCheckOpen, setIsModalCheckOpen] = useState<boolean>(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [campoEditando, setCampoEditando] = useState<keyof InfoUserDTO | null | "password">(null);


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
                                <DatoUsuario label="Nombre:" value={userData?.nombreUsuario} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                                <DatoUsuario label="Apellidos:" value={userData?.apellidosUsuario} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                                <DatoUsuario label="Dni:" value={userData?.dni} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                                <DatoUsuario label="Fecha de nacimiento:" value={userData?.fechaNacimiento} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                                <DatoUsuario label="Email:" value={userData?.email} editable={true} setIsModalOpen={() => { setCampoEditando("email"); setIsModalCheckOpen(true); }} />
                                <DatoUsuario label="Dirección:" value={userData?.direccion} editable={true} setIsModalOpen={() => { setCampoEditando("direccion"); setIsModalCheckOpen(true); }} />
                                <DatoUsuario label="Teléfono:" value={userData?.telefono} editable={true} setIsModalOpen={() => { setCampoEditando("telefono"); setIsModalCheckOpen(true); }} />
                                <DatoUsuario label="Tipo de usuario:" value={userData?.tipoUsuario} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
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



const ModalCambioDatoRegular: React.FC<ModalCambioDatoRegularProps> = ({
    isOpen,
    setIsModalOpen,
    campo,
    valor,
    onGuardar
}) => {
    const [nuevoValor, setNuevoValor] = useState(valor);
    const [cargando, setCargando] = useState(false);
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [nuevaDireccion, setNuevaDireccion] = useState("");
    const [finalCheck, setfinalCheck] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    useEffect(() => {
        if (campo === "direccion") {
            setNuevaDireccion(valor);
        } else {
            setNuevoValor(valor);
        }

        setNuevaPassword("");
        setConfirmPassword("");
    }, [valor]);


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
            await new Promise((resolve) => setTimeout(resolve, 1000));

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

    const esTelefonoValido = (telefono: string) => {
        return /^[0-9]{9}$/.test(telefono); // 9 dígitos, solo números
    };

    const esValorValido = () => {
        if (campo === "email") return esEmailValido(nuevoValor.trim());
        if (campo === "telefono") return esTelefonoValido(nuevoValor.trim());
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
                                                    <p>{valor}</p>
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