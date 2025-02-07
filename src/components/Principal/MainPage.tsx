import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonMenu, IonMenuButton, IonMenuToggle, IonPage, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import { personCircleOutline, trashBin } from "ionicons/icons";
import "./MainPage.css";


const MainPage: React.FC = () => {

    return (
        <>
            <IonMenu type="overlay" contentId="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Menu Content</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">This is the menu content.</IonContent>
            </IonMenu>
            <IonPage id="main-content">
                <IonHeader className="headerBar">
                    <IonToolbar className="toolBar">
                        <IonButtons slot="start">
                            <IonMenuButton className="menuButton"></IonMenuButton>
                        </IonButtons>
                        <div className="principalBar">
                            <IonTitle>Inicio</IonTitle>
                            <IonSearchbar className="searchBar" animated={true} placeholder="¿Qué estás buscando hoy?" showClearButton="always" clearIcon={trashBin} value=""></IonSearchbar>
                        </div>

                        <IonButtons slot="end">
                            <IonButton shape="round" className="userButton" size="large">
                                <IonIcon slot="icon-only" icon={personCircleOutline}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen className="content">
                    Hola
                </IonContent>
                <IonFooter>
                    <IonToolbar>
                        <IonTitle>Botones de abajo</IonTitle>
                    </IonToolbar>
                </IonFooter>
            </IonPage>
        </>

    );
};
export default MainPage;