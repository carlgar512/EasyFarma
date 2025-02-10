import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonMenu, IonMenuButton, IonMenuToggle, IonPage, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import { arrowBackOutline, fitnessOutline, homeOutline, menuOutline, personCircleOutline, schoolOutline, settingsSharp, starOutline, trashBin } from "ionicons/icons";
import "./MainPage.css";


const MainPage: React.FC = () => {

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
                        <IonSearchbar className="searchBar" animated={true} clearIcon={trashBin} value=""></IonSearchbar>
                    </div>
                    <IonButton shape="round" className="upperButton" size="large" fill="outline">
                        <IonIcon slot="icon-only" icon={personCircleOutline}></IonIcon>
                    </IonButton>


                </IonHeader>
                <IonContent fullscreen className="content">
                    Hola
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
export default MainPage;