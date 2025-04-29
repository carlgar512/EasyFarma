import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';




/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Registro from './components/registro/Registro';
import Lobby from './components/lobby/Lobby';
import IniciarSesion from './components/iniciarSesion/IniciarSesion';

import React from 'react';
import PaginaPrincipal from './components/paginaPrincipal/PaginaPrincipal';
import PerfilYPreferencias from './components/perfil&Preferencias/PerfilYPreferencias';
import RecuperaPassword from './components/recuperarPasswordCode/RecuperaPassword';
import ModificaPerfil from './components/modificaPerfil/ModificaPerfil';
import Preferencias from './components/preferencias/Preferencias';
import TarjetaSeguro from './components/tarjetaSeguro/TarjetaSeguro';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './context/AuthContext'; // Ajustá el path si es necesario
import { UserProvider } from './context/UserContext';
import Alergias from './components/misAlergias/Alergias';
import HistorialTratamientos from './components/historialTratamientos/HistorialTratamientos';
import DetalleTratamientoWrapper from './components/detalleTratamiento/DetalleTratamiento';
import BuscaMedico from './components/buscaMedico/BuscaMedico';
import DetalleMedicoWrapper from './components/detalleMedico/DetalleMedico';
import HistorialCitas from './components/historialCitas/HistorialCitas';
import DetalleCitaWrapper from './components/detalleCita/DetalleCita';




setupIonicReact();

const App: React.FC = () => (
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* Rutas sin contexto de usuario */}
            <Route exact path="/register" component={Registro} />
            <Route exact path="/lobby" component={Lobby} />
            <Route exact path="/signIn" component={IniciarSesion} />
            <Route exact path="/passwordReset" component={RecuperaPassword} />

            {/* Rutas con contexto de usuario */}
            <Route exact path="/principal">
              <UserProvider>
                <PaginaPrincipal />
              </UserProvider>
            </Route>
            <Route exact path="/profile">
              <UserProvider>
                <PerfilYPreferencias />
              </UserProvider>
            </Route>
            <Route exact path="/editProfile">
              <UserProvider>
                <ModificaPerfil />
              </UserProvider>
            </Route>
            <Route exact path="/preferences">
              <UserProvider>
                <Preferencias />
              </UserProvider>
            </Route>
            <Route exact path="/insured-card">
              <UserProvider>
                <TarjetaSeguro />
              </UserProvider>
            </Route>
            <Route exact path="/my-allergies">
              <UserProvider>
                <Alergias />
              </UserProvider>
            </Route>
            <Route exact path="/treatment-history">
              <UserProvider>
                <HistorialTratamientos />
              </UserProvider>
            </Route>
            <Route exact path="/treatment-detail">
              <UserProvider>
                <DetalleTratamientoWrapper />
              </UserProvider>
            </Route>
            <Route exact path="/search-doctor">
              <UserProvider>
                <BuscaMedico />
              </UserProvider>
            </Route>
            <Route exact path="/doctor-detail">
              <UserProvider>
                <DetalleMedicoWrapper />
              </UserProvider>
            </Route>
            <Route exact path="/appointment-history">
              <UserProvider>
                <HistorialCitas />
              </UserProvider>
            </Route>
            <Route exact path="/appointment-detail">
              <UserProvider>
                <DetalleCitaWrapper />
              </UserProvider>
            </Route>

            {/* Redirección por defecto */}
            <Route exact path="/">
              <Redirect to="/lobby" />
            </Route>
          </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>

);


export default App;
