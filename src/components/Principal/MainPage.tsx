import { IonButton, IonContent, IonFab, IonFabButton, IonFabList, IonFooter, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonPage, IonPopover, IonSearchbar, IonTitle } from "@ionic/react";
import { arrowBackOutline, callOutline, fitnessOutline, homeOutline, logOutOutline, menuOutline, personCircleOutline, schoolOutline, starOutline, trashBin } from "ionicons/icons";
import "./MainPage.css";



const MainPage: React.FC = () => {
    //TODO probar en telf y cambiar numero
    const handleEmergencyCall = () => {
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
            window.location.href = 'tel:+34679761132';
        } else {
            alert("Esta función solo está disponible en dispositivos móviles. Llame al +1234567890 si necesita asistencia.");
        }
    };

    return (
        <>
            <IonMenu type="overlay" contentId="main-content">
                <IonHeader>
                    <IonMenuToggle>
                        <IonButton fill="clear" color="success">
                            <IonIcon slot="icon-only" ios={arrowBackOutline}></IonIcon>
                        </IonButton>
                    </IonMenuToggle>
                </IonHeader>
                <IonContent className="ion-padding">This is the menu content.</IonContent>
            </IonMenu>
            <IonPage id="main-content">
                <IonHeader className="headerBar">
                    <IonMenuToggle>
                        <IonButton shape="round" className="upperButton" size="large" fill="outline">
                            <IonIcon slot="icon-only" icon={menuOutline}></IonIcon>
                        </IonButton>
                    </IonMenuToggle>
                    <div className="principalBar">
                        <IonTitle>Inicio</IonTitle>
                        <IonSearchbar className="searchBar" clearIcon={trashBin} value=""></IonSearchbar>
                    </div>
                    <IonButton shape="round" className="upperButton" size="large" fill="outline" id="Userpopover-button">
                        <IonIcon slot="icon-only" icon={personCircleOutline}></IonIcon>
                    </IonButton>
                    <UserMenu />
                </IonHeader>
                <IonContent fullscreen className="content">
                    <IonFab horizontal="center" vertical="bottom" slot="fixed">
                        <IonFabButton className="emergencyButton" >
                            <IonIcon icon={callOutline}></IonIcon>
                        </IonFabButton>
                        <IonFabList className="fabList" side="end">
                            <IonButton color={"success"} shape="round" onClick={handleEmergencyCall}>
                                <IonIcon icon={callOutline} slot="icon-only"></IonIcon>
                            </IonButton>
                            <span className="emergencyMessage">¡¡Llamada de emergencia!!</span>
                        </IonFabList>
                    </IonFab>
                </IonContent>
                <IonFooter className="iconBar">

                    <div className="downItemContainer">
                        <IonButton shape="round" size="large" fill="outline" className="downButton">
                            <IonIcon slot="icon-only" ios={homeOutline}></IonIcon>
                        </IonButton>
                        <span>Inicio</span>
                    </div>
                    <div className="downItemContainer">
                        <IonButton shape="round" size="large" fill="outline" className="downButton">
                            <IonIcon slot="icon-only" ios={starOutline}></IonIcon>
                        </IonButton>
                        <span>Favoritos</span>
                    </div>
                    <div className="downItemContainer">
                        <IonButton shape="round" size="large" fill="outline" className="downButton">
                            <IonIcon slot="icon-only" ios={schoolOutline}> </IonIcon>
                        </IonButton>
                        <span>Médicos</span>
                    </div>
                    <div className="downItemContainer">
                        <IonButton shape="round" size="large" fill="outline" className="downButton">
                            <IonIcon slot="icon-only" ios={fitnessOutline}></IonIcon>
                        </IonButton>
                        <span>Tratamiento</span>
                    </div>

                </IonFooter>
            </IonPage>
        </>

    );
};


const UserMenu: React.FC = () => {
   
    const logOut = () => {
        window.location.replace('/lobby'); // Reemplaza la URL actual y borra el historial
    };
    
    //TODO meter las posibles opciones.
    return (

        <IonPopover trigger="Userpopover-button" dismissOnSelect={true}>
            <IonContent>
                <IonList>
                    <IonItem button={true} detail={false}>
                        <IonLabel>Op1</IonLabel>
                    </IonItem>
                    <IonItem button={true} detail={false} >
                        <IonLabel>Op2</IonLabel>
                    </IonItem>
                    <IonItem color="danger" button={true} detail={false} onClick={logOut} >
                        <IonLabel>Cerrar sesión</IonLabel>
                        <IonIcon aria-hidden={true} slot="end" ios={logOutOutline}></IonIcon>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPopover>

    );
};
export default MainPage;