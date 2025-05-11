import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonSpinner, IonToolbar } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { alertCircleOutline, arrowBackOutline, calendarNumberOutline, checkmarkOutline, informationCircleOutline, peopleOutline, personAddOutline, warningOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './ChildAccountRegister.css'
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import NotificationToast from "../notification/NotificationToast";
import { backendService } from "../../services/backendService";
import { useUser } from "../../context/UserContext";


const ChildAccountRegister: React.FC = () => {
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenCalendar, setIsOpen] = useState(false);
    const { userData } = useUser();

    const [form, setForm] = useState({
        name: "",
        lastName: "",
        dni: "",
        dateNac: ""
    });

    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success",
        icon: checkmarkOutline,
    });

    const cerrarDialogo = () => {
        setDialogState({
            isOpen: false,
            tittle: "",
            message: "",
            img: "",
            onConfirm: () => { },
        });
    };

    const [dialogState, setDialogState] = useState({
        isOpen: false,
        tittle: "",
        message: "",
        img: "",
        onConfirm: () => { },
    });

    const handleVolver = () => {
        history.replace('/family-management');
    };

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    // Manejar el cambio de fecha
    const handleChangeDate = (e: any) => {
        const selectedDate = e.detail.value; // Obtiene la fecha seleccionada
        if (selectedDate) {
            const formattedDate = selectedDate.split("T")[0]; // Convierte en formato 'YYYY-MM-DD'
            setForm({ ...form, dateNac: formattedDate }); // Actualiza el estado con la fecha seleccionada
        }
    };


    const crearUsuarioDobleConf = () => {
        const fechaNacimiento = new Date(form.dateNac);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();
        // Pasar el DNI a mayúsculas y actualizar el form localmente
        const dniFormateado = form.dni.trim().toUpperCase();

        // Validar: 8 dígitos + 1 letra
        const dniValido = /^[0-9]{8}[A-Z]$/.test(dniFormateado);

        const esMenor = edad < 18 || (edad === 18 && mesDiferencia < 0);

        if (form.dni.trim() !== "" && !dniValido) {
            setToast({
                show: true,
                message: "El DNI debe ser válido (8 números y 1 letra).",
                color: "danger",
                icon: alertCircleOutline,
            });
            return;
        }

        if (!esMenor) {
            setToast({
                show: true,
                message: "Solo se permite crear cuentas infantiles para menores de edad.",
                color: "danger",
                icon: alertCircleOutline,
            });
            return;
        }

        // Actualiza el form con el DNI en mayúsculas antes de confirmar
        if (form.dni.trim()) {
            setForm((prev) => ({ ...prev, dni: dniFormateado }));
        }
        const fechaFormateada = form.dateNac ? new Date(form.dateNac).toLocaleDateString('es-ES') : "";


        setDialogState({
            isOpen: true,
            tittle: "Crear nueva cuenta infantil",
            message: `Vas a crear una cuenta infantil para ${form.name} ${form.lastName}, con DNI ${form.dni} y fecha de nacimiento ${fechaFormateada}. La gestión de esta cuenta estará asociada a tu usuario.`,
            img: "register.svg",
            onConfirm: () => crearUsuarioInf(),
        })
    };


    const crearUsuarioInf = async () => {
        cerrarDialogo();
        setLoading(true);

        if (!userData) {
            setToast({
                show: true,
                message: "Ocurrió un error al cargar sus datos de usuario.",
                color: "danger",
                icon: alertCircleOutline,
            });
            setLoading(false); // Solo aquí
            return;
        }

        try {
            await backendService.crearCuentaInfantil({
                name: form.name,
                lastName: form.lastName,
                dni: form.dni || "",
                dateNac: form.dateNac,
                email: userData.email,
                tlf: userData.telefono,
                idTutor: userData.uid,
            });

            setToast({
                show: true,
                message: "Cuenta infantil creada correctamente.",
                color: "success",
                icon: checkmarkOutline,
            });

            setForm({ name: "", lastName: "", dni: "", dateNac: "" });

            setTimeout(() => {
                history.replace('/family-management');
            }, 1000);

        } catch (error: any) {
            setToast({
                show: true,
                message: error.message || "Ocurrió un error al crear la cuenta infantil.",
                color: "danger",
                icon: alertCircleOutline,
            });
        } finally {
            setLoading(false); // 🔒 Garantizado que se ejecuta
        }
    };

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Gestión familiar" />
                {!loading ? (
                    <IonContent fullscreen className="contentCAR">
                        <div className="contentCentralCAR">
                            <div className="titleContainerCAR">
                                <IonIcon icon={personAddOutline} size="large" slot="icon-only" />
                                <span className="tittleTextCAR">Registro de nueva cuenta infantil</span>
                            </div>
                            <div className="newChildAccCAR">
                                {/* 🏷️ Label informativo */}
                                <div className="infoLabelNewChildCAR">
                                    <IonIcon icon={informationCircleOutline} className="iconoInfoCAR" />
                                    <span>
                                        Este formulario servirá para la creación de una nueva cuenta infantil tutorizada por tu usuario actual.
                                        La cuenta debe pertenecer a un menor de edad y tener un DNI no registrado anteriormente.
                                        Si no se cumple alguno de estos requisitos, deberás registrar una cuenta regular.
                                    </span>
                                </div>

                                <div className="warnLabelNewChildCAR">
                                    <IonIcon icon={warningOutline} className="iconoWarnCAR" />
                                    <span>
                                        Hasta que el usuario alcance la mayoría de edad, su cuenta estará asociada a sus tutores.
                                        Por ello, el correo electrónico, el teléfono y la contraseña serán los mismos que los del usuario tutor.
                                        Además, solo se podrá acceder a la cuenta infantil desde la cuenta de uno de sus tutores.
                                    </span>
                                </div>

                                {/* 🧾 Formulario */}
                                <div className="formNewChildAcc">
                                    <span className="formTittleCAR">Formulario de cuenta tutelada</span>
                                    <IonItem className="form-itemCAR">
                                        <label className="form-labelCAR">Nombre:</label>
                                        <IonInput
                                            color={"success"}
                                            placeholder="Nombre del niño o niña"
                                            name="name"
                                            value={form.name}
                                            onIonChange={handleChange}
                                            clearInput={true}
                                        />
                                    </IonItem>

                                    <IonItem className="form-itemCAR">
                                        <label className="form-labelCAR">Apellidos:</label>
                                        <IonInput
                                            color={"success"}
                                            name="lastName"
                                            placeholder="Apellidos"
                                            value={form.lastName}
                                            onIonChange={handleChange}
                                            clearInput={true}
                                        />
                                    </IonItem>

                                    <IonItem className="form-itemCAR">
                                        <label className="form-labelCAR">DNI (opcional):</label>
                                        <IonInput
                                            color={"success"}
                                            placeholder="DNI (8 números y 1 letra)"
                                            name="dni"
                                            value={form.dni}
                                            onIonChange={handleChange}
                                            clearInput={true}
                                        />
                                    </IonItem>

                                    <IonItem className="form-itemCAR">
                                        <label className="form-labelCAR">Fecha de Nacimiento:</label>
                                        <IonInput
                                            color={"success"}
                                            name="dateNac"
                                            value={form.dateNac ? new Date(form.dateNac).toLocaleDateString('es-ES') : ""}
                                            placeholder="Selecciona su fecha de nacimiento"
                                            readonly={true} // Hace que el campo no sea editable directamente
                                            onClick={() => setIsOpen(true)} // Abre el calendario cuando se hace clic
                                        />

                                        {/* Botón para abrir el calendario */}
                                        <IonButton onClick={() => setIsOpen(true)} className="calendarButtonCAR">
                                            <IonIcon icon={calendarNumberOutline} size="large" slot="icon-only" ></IonIcon>
                                        </IonButton>
                                        <IonModal isOpen={isOpenCalendar} onDidDismiss={() => setIsOpen(false)}>
                                            <IonHeader>
                                                <IonToolbar className="top-BarBackground">
                                                    <div className="topBarModalCAR">
                                                        <div className="left-contentCAR">
                                                            <IonIcon icon={calendarNumberOutline} size="large" slot="icon-only" ></IonIcon>
                                                            <span className="modalTitleCAR">Calendario</span>
                                                        </div>
                                                        <IonButton className="leaveCalendarButtonCAR" onClick={() => setIsOpen(false)}>Cerrar</IonButton>
                                                    </div>
                                                </IonToolbar>
                                            </IonHeader>
                                            <div className="contentCARModal">
                                                <IonDatetime
                                                    size="fixed"
                                                    name="dateNac"
                                                    presentation="date"
                                                    color={"success"}
                                                    value={form.dateNac}
                                                    onIonChange={handleChangeDate}
                                                />
                                            </div>

                                        </IonModal>
                                    </IonItem>

                                </div>
                            </div>
                            <div className="buttonsContainerCAR">
                                <IonButton
                                    className="buttonNewAccountCAR"
                                    shape="round"
                                    size="large"
                                    expand="full"
                                    onClick={crearUsuarioDobleConf}
                                    disabled={
                                        !form.name.trim() ||
                                        !form.lastName.trim() ||
                                        !form.dateNac.trim()
                                    }
                                >
                                    <IonIcon icon={personAddOutline} size="large" slot="icon-only"></IonIcon>
                                    <span className="buttonTextCAR">Crear cuenta infantil</span>
                                </IonButton>
                                <IonButton
                                    className="buttonReturnCAR"
                                    shape="round"
                                    size="large"
                                    expand="full"
                                    onClick={handleVolver}
                                >
                                    <IonIcon icon={arrowBackOutline} size="large" slot="icon-only"></IonIcon>
                                    <span className="buttonTextCAR">Volver</span>
                                </IonButton>
                            </div>

                        </div>
                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentCAR">
                        <div className="contentCentralCARSpinner">
                            <div className="spinnerContainerCAR">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinnerCAR">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonsContainerCAR">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="buttonReturnGF"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextCAR">Volver</span>
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                )}
                <MainFooter />
            </IonPage>
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

export default ChildAccountRegister;