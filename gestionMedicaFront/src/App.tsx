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

import 'leaflet/dist/leaflet.css';


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


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/register">
            <Registro />
          </Route>
          <Route exact path="/lobby">
            <Lobby />
          </Route>
          <Route exact path="/signIn">
            <IniciarSesion />
          </Route>
          <Route exact path="/passwordReset">
            <RecuperaPassword />
          </Route>
          <Route exact path="/principal">
            <PaginaPrincipal />
          </Route>
          <Route exact path="/profile">
            <PerfilYPreferencias />
          </Route>
          <Route exact path="/editProfile">
            <ModificaPerfil />
          </Route>
          <Route exact path="/preferences">
            <Preferencias />
          </Route>
          <Route exact path="/insured-card">
            <TarjetaSeguro />
          </Route>
          <Route exact path="/">
            <Redirect to="/lobby" />
          </Route>
        </IonRouterOutlet>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
