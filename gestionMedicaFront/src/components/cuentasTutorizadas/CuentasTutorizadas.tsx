import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import MainHeader from "../mainHeader/MainHeader";
import { arrowBackOutline, eyeOutline, logInOutline, peopleOutline, personAddOutline, trashOutline } from "ionicons/icons";
import MainFooter from "../mainFooter/MainFooter";
import { InfoUserDTO } from "../../shared/interfaces/frontDTO";
import './CuentasTutorizadas.css'
import { CuentaInfantilCardProps } from "./CuentasTutorizadasInterfaces";
import ModalPasswordCheck from "../modalPasswordCheck/ModalPasswordCheck";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";


const CuentasTutorizadas: React.FC = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    const handleVolver = () => {
        history.replace('/principal');
    };
    const handleNewChildAccount = () => {
        history.replace('/newChildAccount');
    };

    const mockUsuarios: InfoUserDTO[] = [
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

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Gestión familiar" />
                {loading ? (
                    <IonContent fullscreen className="contentGF">
                        <div className="contentCentralGF">
                            <div className="titleContainerGF">
                                <IonIcon icon={peopleOutline} size="large" slot="icon-only" />
                                <span className="tittleTextGF">Cuentas tutorizadas</span>
                            </div>
                            <div className="cuentasContainerGF">
                                {mockUsuarios.length > 0 ? (
                                    mockUsuarios.map((user) => (
                                        <CuentaInfantilCard key={user.uid} usuario={user} />
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
        </>
    );

};


const CuentaInfantilCard: React.FC<CuentaInfantilCardProps> = ({ usuario }) => {
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

    const bajaUsuarioInf = () => { }

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

                        <IonButton expand="block" shape="round" className="boton-cuenta baja" onClick={()=> setIsModalCheckOpen(true)}>
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
        </>
    );
};



export default CuentasTutorizadas;