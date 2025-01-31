import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
  IonIcon,
  IonItemDivider,
} from "@ionic/react";
import "./Register.css"; // Importa el archivo CSS
import { alertCircleOutline, personAddOutline } from 'ionicons/icons';

const Register: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");


  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.lastName || !form.dni || !form.email || !form.password || !form.confirmPassword) {
      setToastMessage("Todos los campos son obligatorios");
      setShowToast(true);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setToastMessage("Las contraseñas no coinciden");
      setShowToast(true);
      return;
    }

    console.log("Registrando usuario:", form);
    setToastMessage("Registro exitoso");
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="topBar">
            <IonIcon icon={personAddOutline} size="large" color="#0f2a1d"></IonIcon>
            <span className="title">Bienvenido, crea tu cuenta y protege tu bienestar</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="content">
        <div className="form-container">
          <div className="form-card">
            <IonItem className="form-item">
              <label className="form-label">Nombre:</label>
              <IonInput color={"success"} name="name" value={form.name} onIonChange={handleChange} />
            </IonItem>

            <IonItem className="form-item">
              <label className="form-label">Apellidos:</label>
              <IonInput color={"success"} name="lastName" value={form.lastName} onIonChange={handleChange} />
            </IonItem>

            <IonItem className="form-item">
              <label className="form-label">DNI:</label>
              <IonInput color={"success"} name="dni" value={form.dni} onIonChange={handleChange} />
            </IonItem>

            <IonItem className="form-item">
              <label className="form-label">Correo Electrónico:</label>
              <IonInput color={"success"} name="email" type="email" value={form.email} onIonChange={handleChange} />
            </IonItem>

            <IonItem className="form-item">
              <label className="form-label">Contraseña:</label>
              <IonInput color={"success"} name="password" type="password" value={form.password} onIonChange={handleChange} />
            </IonItem>

            <IonItem className="form-item">
              <label className="form-label">Confirmar Contraseña:</label>
              <IonInput color={"success"} name="confirmPassword" type="password" value={form.confirmPassword} onIonChange={handleChange} />
            </IonItem>


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

            <IonToast
              icon={alertCircleOutline}
              color="danger"
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
