import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonMenu, IonMenuButton, IonMenuToggle, IonPage, IonTitle, IonToolbar } from "@ionic/react";



const MainPage: React.FC = () => {

    return (
        <>
            <IonMenu  type="overlay" contentId="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Menu Content</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">This is the menu content.</IonContent>
            </IonMenu>
            <IonPage id="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>Menu</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen className="content">
                    Hola
                </IonContent>
                <IonFooter>
                    <IonToolbar>
                        <IonTitle>Footer Toolbar</IonTitle>
                    </IonToolbar>
                </IonFooter>
            </IonPage>
        </>

    );
};
export default MainPage;