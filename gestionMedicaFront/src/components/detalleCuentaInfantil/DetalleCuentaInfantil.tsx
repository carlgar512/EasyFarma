import React, { useState } from "react";
import { InfoUserDTO } from "../../shared/interfaces/frontDTO";
import { useHistory, useLocation } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonSpinner, IonTitle, IonToolbar } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { addCircleOutline, alertCircleOutline, arrowBackOutline, checkmarkOutline, closeCircleOutline, informationCircleOutline, personAddOutline, trashBinOutline, trashOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import './DetalleCuentaInfantil.css'
import { DetalleCuentaInfantilProps, NuevoTutorProps, TutorCardProps } from "./DetalleCuentaInfantilInterfaces";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import ModalPasswordCheck from "../modalPasswordCheck/ModalPasswordCheck";
import NotificationToast from "../notification/NotificationToast";




const DetalleCuentaInfantilWrapper: React.FC = () => {
    const location = useLocation<{ usuario }>();
    const user = location.state?.usuario;


    return <DetalleCuentaInfantil usuario={user} />;
};
const DetalleCuentaInfantil: React.FC<DetalleCuentaInfantilProps> = ({ usuario }) => {
    const iniciales = `${usuario.nombreUsuario.charAt(0)}${usuario.apellidosUsuario.charAt(0)}`.toUpperCase();
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const [isModalCheckOpen, setIsModalCheckOpen] = useState<boolean>(false);
    const [isNuevoTutorOpen, setNuevoTutorOpen] = useState<boolean>(false);


    const tutores: InfoUserDTO[] = [
        {
            uid: "user1",
            dni: "12345678A",
            email: "juan.perez@example.com",
            nombreUsuario: "Juan",
            apellidosUsuario: "Pérez García",
            fechaNacimiento: "2000-05-15",
            telefono: "600123456",
            direccion: "Calle Mayor 12, Madrid",
            numTarjeta: "1234-5678-9012-3456",
            modoAccesibilidad: false,
            medicosFavoritos: ["medico1", "medico3"],
            operacionesFavoritas: ["4", "7"],
            tipoUsuario: "adulto",
        },
        {
            uid: "user2",
            dni: "98765432B",
            email: "maria.lopez@example.com",
            nombreUsuario: "María",
            apellidosUsuario: "López Díaz",
            fechaNacimiento: "2015-09-21",
            telefono: "600654321",
            direccion: "Av. de América 25, Valencia",
            numTarjeta: "4321-8765-2109-6543",
            modoAccesibilidad: true,
            medicosFavoritos: ["medico2"],
            operacionesFavoritas: ["3"],
            tipoUsuario: "infantil",
        },
        {
            uid: "user3",
            dni: "11223344C",
            email: "carlos.martin@example.com",
            nombreUsuario: "Carlos",
            apellidosUsuario: "Martín Ruiz",
            fechaNacimiento: "1980-01-10",
            telefono: "600789123",
            direccion: "C/ Luna 7, Sevilla",
            numTarjeta: "5678-1234-9876-5432",
            modoAccesibilidad: false,
            medicosFavoritos: [],
            operacionesFavoritas: [],
            tipoUsuario: "adulto",
        }
    ];

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
        history.goBack();
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

    const bajaUsuarioInf = () => { }


    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Detalle de cuenta infantil" />
                {loading ? (
                    <IonContent fullscreen className="contentDAI">
                        <div className="contentCentralDAI">
                            <div className="seccionCuentaDAI">
                                <div className="avatarCuentaDAI">{iniciales}</div>
                                <div className="infoNombreDAI">
                                    <span className="tituloCuentaDAI" >{usuario.nombreUsuario} {usuario.apellidosUsuario}</span>
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
                                    <span className="valueDAIText">{usuario.dni}</span>
                                </div>
                                <div className="lineaInfoDAI">
                                    <span className="atributeDAIText">Nº de tarjeta:</span>
                                    <span className="valueDAIText">{usuario.numTarjeta}</span>
                                </div>
                                <div className="lineaInfoDAI">
                                    <span className="atributeDAIText">Fecha de nacimiento:</span>
                                    <span className="valueDAIText">{usuario.fechaNacimiento}</span>
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
                                            <TutorCard key={tutor.uid} tutor={tutor} tutelado={usuario} />
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
            <NuevoTutor isOpen={isNuevoTutorOpen} onClose={() => setNuevoTutorOpen(false)} />
        </>
    );

};


const TutorCard: React.FC<TutorCardProps> = ({ tutor, tutelado }) => {
    const iniciales = `${tutor.nombreUsuario.charAt(0)}${tutor.apellidosUsuario.charAt(0)}`.toUpperCase();
    const [showConfirm, setShowConfirm] = useState(false);
    const onEliminaTutor = () => {
        //TODO tutor eliminar 
    };

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
                        <span className="valueDAIText">{tutor.fechaNacimiento}</span>
                    </div>
                </div>
                <div className="buttonContainerTutorCardDAI">
                    <IonButton className="eliminarTutorBtnDAI" onClick={() => setShowConfirm(true)}>
                        <IonIcon icon={trashBinOutline} />
                        <span className="buttonTextEliminaTutDAI">Eliminar tutor</span>
                    </IonButton>
                </div>
            </div>

            <DobleConfirmacion
                isOpen={showConfirm}
                tittle="Eliminar tutor"
                message={`¿Estás seguro de que deseas eliminar al tutor ${tutor.nombreUsuario} ${tutor.apellidosUsuario} de la cuenta infantil de ${tutelado.nombreUsuario} ${tutelado.apellidosUsuario}? El tutor eliminado no podrá volver a gestionar esta cuenta, aunque podrás volver a añadirlo si lo deseas.`}
                img="bajaCuenta.svg"
                onConfirm={() => onEliminaTutor()}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};


const NuevoTutor: React.FC<NuevoTutorProps> = ({ isOpen, onClose }) => {
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
    const tarjetaValida = /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(nuevoTutor.numTarjeta.trim());

    const handleAgregar = () => {
        const tutorFormateado = {
            dni: nuevoTutor.dni.trim().toUpperCase(),
            numTarjeta: nuevoTutor.numTarjeta.trim(),
        };
        try {
            const exito = buscaExistenciaTutor();
            if (exito) {
                onAgregarTutor();
                setToast({
                    show: true,
                    message: "Tutor añadido correctamente",
                    color: "success",
                    icon: checkmarkOutline,
                });

                setNuevoTutor({ dni: "", numTarjeta: "" });
                
                setTimeout(() => {
                    onClose();
                    location.reload();
                }, 1000);
                
            }
            else {
                setToast({
                    show: true,
                    message: "No se ha encontrado un usuasuario con los datos proporcionados",
                    color: "danger",
                    icon: alertCircleOutline,
                });
            }

        } catch (error) {
            setToast({
                show: true,
                message: "Error a la hora de añadir el nuevo tutor",
                color: "danger",
                icon: alertCircleOutline,
            });
            setNuevoTutor({ dni: "", numTarjeta: "" }); // limpiar después
            onClose();
        }
    };

    const buscaExistenciaTutor = () => {
        return true;
    }
    const onAgregarTutor = () => {

    }

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
                                        ?.join("-")       // unir con guiones
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
        </IonModal>
    );
};


export default DetalleCuentaInfantilWrapper;