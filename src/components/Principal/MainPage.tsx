import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonPage, IonPopover, IonSearchbar, IonTitle } from "@ionic/react";
import { arrowBackOutline, callOutline, fitnessOutline, homeOutline, logOutOutline, menuOutline, personCircleOutline, schoolOutline, starOutline, trashBin } from "ionicons/icons";
import "./MainPage.css";
import * as icons from 'ionicons/icons';
import { operations } from "../../features/operations";
import { useRef, useState } from "react";
import { Operation, sortOperations } from "../../features/Operation";

const logOut = () => {
    window.location.replace('/lobby'); // Reemplaza la URL actual y borra el historial
};

const handleEmergencyCall = () => {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        window.location.href = 'tel:+34679761132';
    } else {
        alert("Esta función solo está disponible en dispositivos móviles. Llame al +1234567890 si necesita asistencia.");
    }
};

const MainPage: React.FC = () => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        scrollRef.current.scrollLeft = scrollLeft - (x - startX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const [orderOperationType, setOperation] = useState(sortOperations(operations, "type"));
    //TODO probar en telf y cambiar numero


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
                <IonContent className="ion-padding">
                    
                    {orderOperationType.map((operation, index) => {
                        // Verificar si es el primer elemento o si el tipo ha cambiado
                        const isFirstOfType = index === 0 || operation.type !== orderOperationType[index - 1].type;

                        return (
                            <div key={index}>
                                {/* Encabezado solo cuando cambia el tipo */}
                                {isFirstOfType &&
                                    <IonItem button={false}>
                                        <IonLabel
                                            color={"medium"}
                                            className="menuHeader">
                                            <h1>{operation.type}</h1>
                                        </IonLabel>
                                    </IonItem>

                                }

                                {/* Renderización de la operación */}
                                <IonItem button>
                                    <IonIcon
                                        color="success"
                                        slot="start"
                                        icon={(icons as Record<string, string>)[operation.icon]}
                                        size="large"
                                    />
                                    <IonLabel >{operation.title}</IonLabel>
                                </IonItem>
                            </div>
                        );
                    })}
                    <IonItem button={true} onClick={logOut} >
                        <IonIcon color="danger" slot="start" ios={logOutOutline} size="large"></IonIcon>
                        <IonLabel>Cerrar sesión</IonLabel>
                    </IonItem>
                </IonContent>
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
                    <div className="contentContainer">
                        <div className="sectionContainer">
                            <div className="sectionTitle">
                                <IonIcon
                                    color="success"
                                    slot="start"
                                    icon={icons.rocketOutline}
                                    size="large"
                                />
                                <span className="sectionTitleText">Gestiona tus Operaciones de Forma Eficiente</span>
                            </div>

                            <div
                                ref={scrollRef}
                                className="cardOperationContainer"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {orderOperationType.map((operation, index) => {
                                    return (
                                        <OperationCard operation={operation} key={operation.id} ></OperationCard>
                                    );
                                })}



                            </div>
                        </div>
                        <div className="sectionContainer">
                            <div className="sectionTitle">
                                <IonIcon
                                    color="success"
                                    slot="start"
                                    icon={icons.heartCircleOutline}
                                    size="large"
                                />
                                <span className="sectionTitleText">Operaciones Favoritas</span>
                            </div>
                        </div>
                        <div className="sectionContainer">

                            <div className="sectionTitle">
                                <IonIcon
                                    color="success"
                                    slot="start"
                                    icon={starOutline}
                                    size="large"
                                />
                                <span className="sectionTitleText">Tus esenciales</span>
                            </div>
                        </div>

                        <div className="sectionContainer">

                            <div className="sectionTitle">
                                <IonIcon
                                    color="success"
                                    slot="start"
                                    icon={callOutline}
                                    size="large"
                                />
                                <span className="sectionTitleText">Asistencia Directa</span>
                            </div>
                        </div>
                    </div>




                    <EmergecyCall />
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


    const perfilOperations = operations.filter(op => op.type === "Perfil");
    //TODO meter las posibles opciones.
    return (

        <IonPopover trigger="Userpopover-button" dismissOnSelect={true}>
            <IonContent>
                <IonList>
                    {perfilOperations.map((operation, index) => (
                        <IonItem button={true} detail={false} key={index}>
                            <IonLabel>{operation.title}</IonLabel>
                            <IonIcon aria-hidden={true} slot="end" icon={(icons as Record<string, string>)[operation.icon]}></IonIcon>
                        </IonItem>
                    ))}
                    <IonItem color="danger" button={true} detail={false} onClick={logOut} >
                        <IonLabel>Cerrar sesión</IonLabel>
                        <IonIcon aria-hidden={true} slot="end" ios={logOutOutline}></IonIcon>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPopover>

    );
};



interface OperationCardProps {
    operation: Operation;
}
const OperationCard: React.FC<OperationCardProps> = ({ operation }) => {
    const [isLiked, setIsLiked] = useState(false);

    const toggleLike = () => {
      setIsLiked(!isLiked);
    };

    const redirectTo = () => {
        window.location.assign(operation.url); // Reemplaza la URL actual y borra el historial
    };

    return (

        <IonCard className="operationCard" type="button" onClick={redirectTo}>
            <IonFab vertical="top" horizontal="end" >
                <IonButton shape="round" color="success" fill={isLiked ? "outline" : "clear"} size="default" type="button"  onClick={toggleLike}>
                    <IonIcon slot="icon-only" color="success" icon={isLiked ? icons.heartSharp : icons.heartOutline}></IonIcon>
                </IonButton>
            </IonFab>
            <IonCardHeader className="cardHeader">

                <IonCardTitle  color="success" className="cardTittle">
                    <IonIcon icon={(icons as Record<string, string>)[operation.icon]} size="large"></IonIcon>
                    <span className="cardTittleText">{operation.title}</span>
                </IonCardTitle>
            </IonCardHeader>
            <IonImg className="cardImage" alt={`/${operation.img}`} src={`/${operation.img}`} />


            <IonCardContent>
                <span className="cardDescription">
                    {operation.description}
                </span>
            </IonCardContent>
        </IonCard>

    );
};




const EmergecyCall: React.FC = () => {

    return (

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

    );
};




export default MainPage;