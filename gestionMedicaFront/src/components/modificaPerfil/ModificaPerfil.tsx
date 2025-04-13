import React, { useEffect, useState } from "react";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import MainFooter from "../mainFooter/MainFooter";
import { alertCircleOutline, arrowBackOutline, arrowForwardOutline, atOutline, brushOutline, checkmarkDoneOutline, checkmarkOutline, closeOutline, cloudUploadOutline, eyeOff, eyeOutline, optionsOutline } from "ionicons/icons";
import './ModificaPerfil.css'
import { DatoUsuarioProps, FormularioUsuario, ModalCambioDatoRegularProps } from "./ModificaPerfilInterfaces";
import ModalPasswordCheck from "../modalPasswordCheck/ModalPasswordCheck";
import NotificationToast from "../notification/NotificationToast";

const ModificaPerfil: React.FC = () => {

    const [form, setForm] = useState<FormularioUsuario>({
        name: "Carlos",
        lastName: "Garcia",
        dni: "71315332Z",
        dateNac: "15/11/2001",
        email: "cargarmisa@gmail.com",
        direccion: "Calle Caceres 14 Tudela de Duero Valladolid",
        tlf: "600882146",
        password: "",
        confirmPassword: "",
        tipoUsuario: "Regular",
    });


    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCambiarContraseña = () => {
        setCampoEditando("password");
        setIsModalCheckOpen(true);

    };

    const handleVolver = () => {
        window.history.back();
    };

    const handleGuardarNuevoValor = (nuevoValor: string) => {
        if (campoEditando) {
            // 👉 Aquí puedes hacer la llamada al backend si quieres persistir el cambio
            // Por ejemplo:
            // await api.post('/usuario/actualizar', { [campoEditando]: nuevoValor });
            setForm((prev) => ({ ...prev, [campoEditando]: nuevoValor }));

        }
    };

    const [isModalCheckOpen, setIsModalCheckOpen] = useState<boolean>(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [campoEditando, setCampoEditando] = useState<keyof typeof form | null>(null);


    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mi perfil & preferencias" />
                <IonContent fullscreen className="contentMP">
                    <div className="contentMPCentral">
                        <div className="titleContainerMP">
                            <IonIcon
                                className="iconOperation"
                                slot="icon-only"
                                icon={optionsOutline}
                                size="large"
                            />
                            <span className="tittleTextMP">Buenas tardes, {form.name}</span>
                        </div>
                        <div className="infoContainer">
                            <DatoUsuario label="Nombre:" value={form.name} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Apellidos:" value={form.lastName} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Dni:" value={form.dni} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Fecha de nacimiento:" value={form.dateNac} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
                            <DatoUsuario label="Email:" value={form.email} editable={true} setIsModalOpen={() => { setCampoEditando("email"); setIsModalCheckOpen(true); }} />
                            <DatoUsuario label="Dirección:" value={form.direccion} editable={true} setIsModalOpen={() => { setCampoEditando("direccion"); setIsModalCheckOpen(true); }} />
                            <DatoUsuario label="Teléfono:" value={form.tlf} editable={true} setIsModalOpen={() => { setCampoEditando("tlf"); setIsModalCheckOpen(true); }} />
                            <DatoUsuario label="Tipo de usuario:" value={form.tipoUsuario} editable={false} setIsModalOpen={() => setIsModalCheckOpen(true)} />
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

                </IonContent>
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
                valor={campoEditando ? form[campoEditando] : ""}
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
        if (!esValorValido()) {

            if (campo === "password") {
                setToast({
                    show: true,
                    message: `La contraseña y su confirmación deben ser iguales.`,
                    color: "danger",
                    icon: alertCircleOutline,
                });
            }
            else {
                setToast({
                    show: true,
                    message: `El formato del campo introducido no es válido. Por favor, introduce un valor correcto para el campo ${campo?.toLowerCase()}`,
                    color: "danger",
                    icon: alertCircleOutline,
                });
            }

            return;
        }


        try {
            setCargando(true); // ⏳ Mostramos spinner
            // ⏱ Simular tiempo de espera de 1 segundo
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await onGuardar(
                campo === "password"
                    ? nuevaPassword
                    : campo === "direccion"
                        ? nuevaDireccion
                        : nuevoValor
            );

            // Llama al back y espera

            // ✅ Si va bien
            setToast({
                show: true,
                message: `El campo ${campo?.toLowerCase()} se ha actualizado correctamente.`,
                color: "success",
                icon: checkmarkDoneOutline,
            });
            setIsModalOpen(false);
        } catch (error) {
            // ❌ Si falla el backend
            setToast({
                show: true,
                message: `Hubo un error al guardar el campo ${campo?.toLowerCase()}. Inténtalo más tarde.`,
                color: "danger",
                icon: alertCircleOutline,
            });
        } finally {
            setCargando(false); // 🔁 Siempre quitamos el spinner
        }
    };


    const handleCerrar = () => {
        setNuevoValor(valor); // Resetea
        setIsModalOpen(false);
        // Limpia el foco manualmente
        setTimeout(() => {
            (document.activeElement as HTMLElement)?.blur();
        }, 50);
    };

    const esEmailValido = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const esTelefonoValido = (telefono: string) => {
        return /^[0-9]{9}$/.test(telefono); // 9 dígitos, solo números
    };

    const esValorValido = () => {
        if (campo === "email") return esEmailValido(nuevoValor.trim());
        if (campo === "tlf") return esTelefonoValido(nuevoValor.trim());
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
                                        Mapa
                                        {/*<MapComponent onSelect={(direccion) => setNuevaDireccion(direccion)} /> */}
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
                                        onClick={handleActualizar}
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