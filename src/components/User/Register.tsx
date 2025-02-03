import { useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonToolbar,
  IonToast,
  IonIcon,
  IonDatetime,
} from "@ionic/react";
import "./Register.css"; // Importa el archivo CSS
import { alertCircleOutline, checkmarkOutline, exitOutline, personAddOutline, personOutline, settingsSharp } from 'ionicons/icons';

const Register: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateNac: ""
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccessToast, setIsSuccessToast] = useState(false); // Nuevo estado


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



  const handleSubmit = () => {
    if (!form.name || !form.lastName || !form.dni || !form.email || !form.password || !form.confirmPassword || !form.dateNac) {
      console.log(form);
      setToastMessage("Todos los campos son obligatorios");
      setIsSuccessToast(false);
      setShowToast(true);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setToastMessage("Las contraseñas no coinciden");
      setIsSuccessToast(false);
      setShowToast(true);
      return;
    }

    console.log("Registrando usuario:", form);
    setToastMessage("Registro exitoso");
    setIsSuccessToast(true);
    setShowToast(true);
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
            <IonButton color="danger" className="leaveButton">
              <IonIcon slot="icon-only" ios={exitOutline}></IonIcon>
            </IonButton>

          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="content">
        <div className="form-container">
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
              <label className="form-label">Contraseña:</label>
              <IonInput
                color={"success"}
                placeholder="Nueva contraseña"
                name="password"
                type="password"
                value={form.password}
                onIonChange={handleChange}
                clearInput={true}
              />
            </IonItem>

            <IonItem className="form-item">
              <label className="form-label">Confirmar Contraseña:</label>
              <IonInput
                color={"success"}
                name="confirmPassword"
                placeholder="Repite contraseña"
                type="password"
                value={form.confirmPassword}
                onIonChange={handleChange}
                clearInput={true}
              />
            </IonItem>

            <div className="form-FechaNac">
              <label className="form-labelNac">Fecha de Nacimiento:</label>


              <div className="calendar-wrapper">
                <IonDatetime
                  size="fixed"
                  name="dateNac"
                  presentation="date"
                  color={"success"}
                  value={form.dateNac}
                  onIonChange={handleChangeDate}


                >
                </IonDatetime>
              </div>

            </div>

            <IonButton
              expand="block"
              shape="round"
              size="default"
              className="ion-margin-top custom-button"
              onClick={handleSubmit}
            >
              <IonIcon icon={personAddOutline} slot="start"></IonIcon>
              Crear nueva cuenta
            </IonButton>

            <IonButton
              expand="block"
              shape="round"
              size="default"
              className="ion-margin-top custom-button2"
            >
              <IonIcon icon={personOutline} slot="start"></IonIcon>
              ¿Ya registrado?, Iniciar sesion
            </IonButton>


            <IonToast
              icon={isSuccessToast ? checkmarkOutline : alertCircleOutline} // Cambia icono dinámicamente
              color={isSuccessToast ? "success" : "danger"} // Cambia color dinámicamente
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={toastMessage}
              duration={2000}
              swipeGesture="vertical"
              buttons={[
                {
                  text: 'Descartar',
                  role: 'cancel',
                },
              ]}

            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
