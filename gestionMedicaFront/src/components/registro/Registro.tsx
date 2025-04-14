import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonToolbar,
  IonIcon,
  IonDatetime,
  IonSpinner,
  IonImg,
  IonModal,
} from "@ionic/react";
import "./Registro.css"; // Importa el archivo CSS
import { alertCircleOutline, calendarNumberOutline, checkmarkOutline, exitOutline, eyeOff, eyeOutline, personAddOutline, personOutline } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import React from "react";
import { backendService } from "../../services/backendService";
import NotificationToast from "../notification/NotificationToast";
import { useAuth } from "../../context/AuthContext";


const Registro: React.FC = () => {
  const { setAuth } = useAuth();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    dni: "",
    email: "",
    tlf: "",
    password: "",
    confirmPassword: "",
    dateNac: ""
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    color: "success",
    icon: checkmarkOutline,
  });

  const [isOpenCalendar, setIsOpen] = useState(false);

  const [loadSpinner, setLoadSpinner] = useState(false);

  const history = useHistory();

  const handleGoBackClick = () => {

    if (document.referrer.includes('/lobby')) {
      history.go(-1); // Si la página anterior era /lobby, vuelve atrás
    } else {
      history.replace('/lobby'); // Si no, reemplaza la ruta actual
    }

  };

  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginClick = () => {
    history.replace('/signIn')
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

  const handleSubmit = async () => {
    const dni = form.dni?.toUpperCase().trim(); // Normaliza el DNI
    // Validación: vacío o mal formato
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!form.name || !form.lastName || !form.dni || !form.email || !form.tlf || !form.password || !form.confirmPassword || !form.dateNac) {
      setToast({
        show: true,
        message: "Todos los campos son obligatorios",
        color: "danger",
        icon: alertCircleOutline,
      });
      return;
    }
    else if (!dniRegex.test(dni)) {
      setToast({
        show: true,
        message: "Por favor, introduce un DNI válido.",
        color: "danger",
        icon: alertCircleOutline,
      });
      return;
    }
    else if (form.password !== form.confirmPassword) {
      setToast({
        show: true,
        message: "Las contraseñas no coinciden",
        color: "danger",
        icon: alertCircleOutline,
      });
      return;
    }
    // 👉 Validación de edad mínima (18 años)
    const nacimiento = new Date(form.dateNac);
    const hoy = new Date();
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiferencia = hoy.getMonth() - nacimiento.getMonth();
    const diaDiferencia = hoy.getDate() - nacimiento.getDate();

    const esMenor = edad < 18 || (edad === 18 && (mesDiferencia < 0 || (mesDiferencia === 0 && diaDiferencia < 0)));

    if (esMenor) {
      setToast({
        show: true,
        message: "Debes tener al menos 18 años para registrarte.",
        color: "danger",
        icon: alertCircleOutline,
      });
      return;
    }
    setLoadSpinner(true);

    const response = await backendService.register({
      name: form.name,
      lastName: form.lastName,
      dni: dni,
      email: form.email,
      tlf: form.tlf,
      dateNac: form.dateNac,
      password: form.password
    });

    //console.log(response);
    setLoadSpinner(false);

    if (response.success) {
      if (response.user && response.token) {
        setAuth(response.user, response.token);
      }
      setToast({
        show: true,
        message: "Registro exitoso",
        color: "success",
        icon: checkmarkOutline,
      });
      setTimeout(() => {
        history.replace('/principal');
      }, 1000);
    } else {
      setToast({
        show: true,
        message: "Error al registrar: " + response.error,
        color: "danger",
        icon: alertCircleOutline,
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="top-BarBackground">
          <div className="topBar">
            <div className="left-content">
              <IonIcon icon={personAddOutline} size="large" color="#0f2a1d"></IonIcon>
              <span className="title">Bienvenido, crea tu cuenta y protege tu bienestar</span>
            </div>
            <IonButton color="danger" className="leaveButton" onClick={handleGoBackClick}>
              <IonIcon slot="icon-only" ios={exitOutline}></IonIcon>
            </IonButton>

          </div>
        </IonToolbar>
      </IonHeader>

      {loadSpinner ?
        <div className="content">
          <div className="spinnerBackground">
            <IonSpinner name="circular" className="spinner"></IonSpinner>
            <span className="mensajeSpinner">Estamos preparando todo para ti... ¡Casi listo!</span>
          </div>

        </div> :

        <IonContent fullscreen className="content">
          <div className="form-container">
            <div className="imgContainer">
              <IonImg className="imagenReg" src="/register.svg"></IonImg>
            </div>
            <div className="form-card">
              <IonItem className="form-item">
                <label className="form-label">Nombre:</label>
                <IonInput
                  color={"success"}
                  placeholder="Escribe tu nombre"
                  name="name"
                  value={form.name}
                  onIonChange={handleChange}
                  clearInput={true}
                />
              </IonItem>

              <IonItem className="form-item">
                <label className="form-label">Apellidos:</label>
                <IonInput
                  color={"success"}
                  name="lastName"
                  placeholder="Escribe tu(s) apellidos"
                  value={form.lastName}
                  onIonChange={handleChange}
                  clearInput={true}
                />
              </IonItem>

              <IonItem className="form-item">
                <label className="form-label">DNI:</label>
                <IonInput
                  color={"success"}
                  placeholder="Escribe tu DNI"
                  name="dni"
                  value={form.dni}
                  onIonChange={handleChange}
                  clearInput={true}
                />
              </IonItem>

              <IonItem className="form-item">
                <label className="form-label">Correo Electrónico:</label>
                <IonInput
                  color={"success"}
                  name="email"
                  placeholder="Ejemplo: correo@dominio.com"
                  type="email"
                  value={form.email}
                  onIonChange={handleChange}
                  clearInput={true}
                />
              </IonItem>

              <IonItem className="form-item">
                <label className="form-label">Teléfono</label>
                <IonInput
                  color={"success"}
                  name="tlf"
                  placeholder="Escribe tu teléfono"
                  type="tel"
                  value={form.tlf}
                  onIonChange={handleChange}
                  clearInput={true}
                />
              </IonItem>

              <IonItem className="form-item">
                <label className="form-label">Contraseña:</label>
                <IonInput
                  color={"success"}
                  placeholder="Nueva contraseña"
                  name="password"
                  type={showPassword ? "text" : "password"} // Alterna entre 'text' y 'password'
                  value={form.password}
                  onIonChange={handleChange}
                  clearInput={true}
                />
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={togglePasswordVisibility}
                  color="success"
                >
                  {!showPassword ? <IonIcon icon={eyeOutline} size="large" /> : <IonIcon icon={eyeOff} size="large" />}
                </IonButton>
              </IonItem>

              <IonItem className="form-item">
                <label className="form-label">Confirmar Contraseña:</label>
                <IonInput
                  color={"success"}
                  name="confirmPassword"
                  placeholder="Repite contraseña"
                  type={showPassword ? "text" : "password"} // Alterna entre 'text' y 'password'
                  value={form.confirmPassword}
                  onIonChange={handleChange}
                  clearInput={true}
                />
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={togglePasswordVisibility}
                  color="success"
                >
                  {!showPassword ? <IonIcon icon={eyeOutline} size="large" /> : <IonIcon icon={eyeOff} size="large" />}
                </IonButton>
              </IonItem>

              <IonItem className="form-item">
                <label className="form-label">Fecha de Nacimiento:</label>
                <IonInput
                  color={"success"}
                  name="dateNac"
                  value={form.dateNac}
                  placeholder="Selecciona tu fecha de nacimiento"
                  readonly={true} // Hace que el campo no sea editable directamente
                  onClick={() => setIsOpen(true)} // Abre el calendario cuando se hace clic
                />

                {/* Botón para abrir el calendario */}
                <IonButton onClick={() => setIsOpen(true)} className="calendarButton">
                  <IonIcon icon={calendarNumberOutline} size="large" slot="icon-only" ></IonIcon>
                </IonButton>
                <IonModal isOpen={isOpenCalendar} onDidDismiss={() => setIsOpen(false)}>
                  <IonHeader>
                    <IonToolbar className="top-BarBackground">
                      <div className="topBarModal">
                        <div className="left-content">
                          <IonIcon icon={calendarNumberOutline} size="large" slot="icon-only" ></IonIcon>
                          <span className="modalTitle">Calendario</span>
                        </div>
                        <IonButton className="leaveCalendarButton" onClick={() => setIsOpen(false)}>Cerrar</IonButton>
                      </div>
                    </IonToolbar>
                  </IonHeader>
                  <div className="content">
                    <IonDatetime
                      size="fixed"
                      name="dateNac"
                      presentation="date"
                      color={"success"}
                      value={form.dateNac}
                      onIonChange={handleChangeDate}
                    >
                      <span slot="title">Fecha de Nacimiento</span>
                    </IonDatetime>
                  </div>

                </IonModal>
              </IonItem>

              <IonButton
                expand="block"
                shape="round"
                size="default"
                className="ion-margin-top custom-button"
                onClick={handleSubmit}
              >
                <IonIcon icon={personAddOutline} size="large" slot="start"></IonIcon>
                <span className="buttonTextReg"> Crear nueva cuenta</span>
              </IonButton>

              <IonButton
                onClick={handleLoginClick}
                expand="block"
                shape="round"
                size="default"
                className="ion-margin-top custom-button2"
              >
                <IonIcon icon={personOutline} size="large" slot="start" ></IonIcon>
                <span className="buttonTextReg"> ¿Ya registrado?, Iniciar sesion</span>
              </IonButton>
              <NotificationToast
                icon={toast.icon}
                color={toast.color}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
              />
            </div>
          </div>
        </IonContent>

      }


    </IonPage>
  );
};

export default Registro;
