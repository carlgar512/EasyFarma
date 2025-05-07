import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonImg, IonPage } from "@ionic/react";
import { callOutline, informationCircleOutline, medkitOutline, shieldCheckmarkOutline, starOutline } from "ionicons/icons";
import "./PaginaPrincipal.css";
import * as icons from 'ionicons/icons';
import { useEffect, useMemo, useRef, useState } from "react";

import { operations } from "../../shared/operations";
import React from "react";
import DobleConfirmacion from "../dobleConfirmacion/DobleConfirmacion";
import { sortOperations } from "../../shared/interfaces/Operation";
import SideMenu from "../sideMenu/SideMenu";
import MainHeader from "../mainHeader/MainHeader";
import { OperationCardProps, SoporteTelefonicoCard } from "./PaginaPrincipalInterfaces";
import MainFooter from "../mainFooter/MainFooter";
import { useUser } from "../../context/UserContext";


const PaginaPrincipal: React.FC = () => {
    const [orderOperationType, setOperation] = useState(sortOperations(operations, "type"));
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);

    const cardWidth = 320 + 16;

    useEffect(() => {
        const calculateItemsPerPage = () => {
            requestAnimationFrame(() => {
                if (sliderRef.current) {
                    const containerWidth = sliderRef.current.offsetWidth;
                    const visible = containerWidth / cardWidth;
                    setItemsPerPage(visible);
                }
            });
        };

        calculateItemsPerPage();
        window.addEventListener("resize", calculateItemsPerPage);
        return () => window.removeEventListener("resize", calculateItemsPerPage);
    }, []);

    const itemsPerBlock = useMemo(() => {
        return itemsPerPage ? Math.floor(itemsPerPage) : 1;
    }, [itemsPerPage]);

    const totalPages = useMemo(() => {
        if (!itemsPerPage || itemsPerBlock === 0) return 0;
        return Math.ceil(orderOperationType.length / itemsPerBlock);
    }, [orderOperationType.length, itemsPerBlock]);

    const handleScrollToPage = (page: number) => {
        if (!sliderRef.current || itemsPerPage === null) return;

        const maxScroll = getMaxScrollLeft();
        const idealScroll = page * itemsPerBlock * cardWidth;
        const targetScroll = Math.min(idealScroll, maxScroll);

        sliderRef.current.scrollTo({
            left: targetScroll,
            behavior: "smooth",
        });

        setCurrentPage(page);
    };
    const getMaxScrollLeft = () => {
        if (!sliderRef.current) return 0;
        const totalCards = orderOperationType.length;
        const visibleCards = itemsPerBlock;
        const remainingCards = totalCards - visibleCards * (totalPages - 1);
        const scrollWidth = sliderRef.current.scrollWidth;
        const containerWidth = sliderRef.current.clientWidth;

        if (remainingCards < visibleCards) {
            return scrollWidth - containerWidth;
        }

        return (currentPage + 1) * visibleCards * cardWidth;
    };

    const handleScrollRight = () => {
        if (currentPage + 1 < totalPages) {
            handleScrollToPage(currentPage + 1);
        } else {
            // Circular: vuelve al inicio
            handleScrollToPage(0);
        }
    };

    const handleScrollLeft = () => {
        if (currentPage > 0) {
            handleScrollToPage(currentPage - 1);
        } else {
            // Circular: ir al final
            handleScrollToPage(totalPages - 1);
        }
    };


    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider || !itemsPerBlock) return;

        const handleScroll = () => {
            const scrollLeft = slider.scrollLeft;
            const blockWidth = itemsPerBlock * cardWidth;
            const index = Math.ceil(scrollLeft / blockWidth);
            setCurrentPage(index);
        };

        slider.addEventListener("scroll", handleScroll);
        return () => slider.removeEventListener("scroll", handleScroll);
    }, [itemsPerBlock]);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = 0;
            setCurrentPage(0);
        }
    }, [itemsPerBlock]);

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Inicio" />
                <IonContent fullscreen className="content">
                    <div className="contentContainer">

                        <div className="sectionContainer">
                            <Bienvenida />
                        </div>
                        <div className="sectionContainer">
                            <div className="sectionTitle">
                                <IonIcon slot="start" icon={icons.rocketOutline} size="large" />
                                <span className="sectionTitleText">Gestiona tus Operaciones de Forma Eficiente</span>
                            </div>

                            <div className="cardCarouselContainer">
                                {itemsPerPage !== null && (
                                    <IonButton fill="clear" size="small" className="navButton left" onClick={handleScrollLeft}>
                                        <IonIcon slot="icon-only" icon={icons.chevronBackOutline} />
                                    </IonButton>
                                )}

                                <div className="cardSlider" ref={sliderRef}>
                                    {orderOperationType.map((operation, index) => (
                                        <OperationCard operation={operation} key={operation.id} />
                                    ))}
                                </div>

                                {itemsPerPage !== null && (
                                    <IonButton fill="clear" size="small" className="navButton right" onClick={handleScrollRight}>
                                        <IonIcon slot="icon-only" icon={icons.chevronForwardOutline} />
                                    </IonButton>
                                )}

                                {itemsPerPage !== null && (
                                    <div className="paginationDots">
                                        {Array.from({ length: totalPages }).map((_, index) => (
                                            <span
                                                key={index}
                                                className={`dot ${currentPage === index ? "active" : ""}`}
                                                onClick={() => handleScrollToPage(index)}
                                            ></span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Secciones siguientes */}
                        <div className="sectionContainer">
                            <div className="sectionTitle">
                                <IonIcon slot="start" icon={icons.heartCircleOutline} size="large" />
                                <span className="sectionTitleText">Operaciones Favoritas</span>
                            </div>
                        </div>

                        <div className="sectionContainer">
                            <div className="sectionTitle">
                                <IonIcon slot="start" icon={starOutline} size="large" />
                                <span className="sectionTitleText">Tus Médicos de confianza</span>
                            </div>
                        </div>

                        <div className="sectionContainer">
                            <div className="sectionTitle">
                                <IonIcon slot="start" icon={callOutline} size="large" />
                                <span className="sectionTitleText">Asistencia Directa</span>
                            </div>

                            <SoporteTelefonico/>
                        </div>
                    </div>

                    <EmergecyCall />
                </IonContent>
                <MainFooter />
            </IonPage>
        </>
    );
};



const OperationCard: React.FC<OperationCardProps> = ({ operation }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const toggleLike = () => {
        if (isLiked) {
            setShowConfirm(true)
        }
        else {
            setIsLiked(!isLiked);
        }
    };

    const removeLiked = () => {
        setIsLiked(!isLiked);
        setShowConfirm(false)
    }

    const redirectTo = () => {
        window.location.assign(operation.url); // Reemplaza la URL actual y borra el historial
    };

    return (
        <>
            <div className="operationCard" onClick={redirectTo}>

                <IonCardHeader className="cardHeader">
                    <IonCardTitle className="cardTitle">
                        <IonIcon
                            icon={(icons as Record<string, string>)[operation.icon]}
                            size="large"
                            className="operationIcon"
                        />
                        <span className="cardTitleText">{operation.title}</span>
                        <IonButton
                            shape="round"
                            fill="clear"

                            className="starIconPrincipal"
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleLike();
                            }}
                        >
                            <IonIcon
                                slot="icon-only"
                                icon={isLiked ? icons.star : icons.starOutline}
                                size="large"
                            />
                        </IonButton>
                    </IonCardTitle>
                </IonCardHeader>

                <IonImg className="cardImage" alt={operation.title} src={`/${operation.img}`} />

                <IonCardContent>
                    <span className="cardDescription">{operation.description}</span>
                    <span className="cardTitleTextMobile">{operation.title}</span>
                </IonCardContent>
            </div>

            <DobleConfirmacion
                isOpen={showConfirm}
                tittle="Descartar operación de favoritos"
                message={`¿Estás seguro de que deseas eliminar la operación ${operation.title} de tus favoritos? Podrás volver a añadirlo más tarde si lo deseas.`}
                img="/doubleCheckFavourite.svg"
                onConfirm={removeLiked}
                onCancel={() => setShowConfirm(false)}
            />
        </>

    );
};




const EmergecyCall: React.FC = () => {

    const [showEmergency, setShowEmergency] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleEmergencyCall = () => {
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
            window.location.href = 'tel:+34679761132';
        } else {
            alert("Esta función solo está disponible en dispositivos móviles. Llame al +1234567890 si necesita asistencia.");
        }
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node)
            ) {
                setShowEmergency(false);
            }
        };

        if (showEmergency) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmergency]);

    return (
        <>
            {showEmergency && (
                <>
                    <div className="emergencyOverlay" onClick={() => setShowEmergency(false)} />
                    <div ref={panelRef} className="emergencyPanel">
                        <IonButton shape="round" onClick={handleEmergencyCall}>
                            <IonIcon icon={callOutline} slot="icon-only" />
                        </IonButton>
                        <span className="emergencyMessage">¡¡Llamada de emergencia!!</span>
                    </div>
                </>
            )}

            <IonFab horizontal="center" vertical="bottom" slot="fixed">
                <IonFabButton
                    className="emergencyButton"
                    onClick={() => setShowEmergency(!showEmergency)}
                >
                    {showEmergency ? (
                        <IonIcon icon={icons.closeOutline} className="sosIcon" />
                    ) : (
                        <strong className="sosText">S.O.S</strong>
                    )}
                </IonFabButton>
            </IonFab>
        </>

    );
};


const Bienvenida: React.FC = () => {
    const fecha = new Date();
    const hora = fecha.getHours();
    const nombre = "Carlos García Miguel"

    const healthQuotes = [
        { quote: "Cuida tu cuerpo. Es el único lugar que tienes para vivir.", author: "Jim Rohn" },
        { quote: "La salud es la mayor posesión. La alegría es el mayor tesoro.", author: "Lao Tse" },
        { quote: "El cuerpo logra lo que la mente cree.", author: "Napoleon Hill" },
        { quote: "La buena salud no es algo que podamos comprar. Sin embargo, puede ser una cuenta de ahorros muy valiosa.", author: "Anne Wilson Schaef" },
        { quote: "Sin salud, la vida no es vida; solo es un estado de languidez y sufrimiento.", author: "Buda" },
        { quote: "Mantener el cuerpo en buena salud es un deber… de lo contrario, no seremos capaces de mantener nuestra mente fuerte y clara.", author: "Buda" },
        { quote: "La salud es el estado en que el cuerpo y la mente están en armonía con el universo.", author: "Deepak Chopra" },
        { quote: "Cuanto más feliz estás, más saludable estás.", author: "Dalai Lama" },
        { quote: "La prevención es la mejor medicina.", author: "Desconocido" },
        { quote: "Come para nutrir tu cuerpo, no para llenar un vacío.", author: "Desconocido" },
        { quote: "Caminar es el mejor remedio para el hombre.", author: "Hipócrates" },
        { quote: "La fuerza no proviene de la capacidad corporal, sino de la voluntad del alma.", author: "Mahatma Gandhi" },
        { quote: "El ejercicio es clave para la salud física y la tranquilidad mental.", author: "Nelson Mandela" },
        { quote: "La medicina cura, pero solo la naturaleza sana.", author: "Hipócrates" },
        { quote: "Si quieres estar fuerte, corre. Si quieres estar bello, corre. Si quieres estar sabio, corre.", author: "Desconocido" },
        { quote: "El secreto para una buena salud es que el cuerpo se agite y la mente repose.", author: "Vincent Voiture" },
        { quote: "Nada mejora la salud como un buen estado de ánimo.", author: "Proverbio irlandés" },
        { quote: "El mayor error que puede cometer un médico es curar el cuerpo sin haber intentado curar el alma.", author: "Platón" },
        { quote: "La felicidad es la forma más elevada de la salud.", author: "Dalai Lama" },
        { quote: "Invertir en salud no es un gasto, es una inversión.", author: "Desconocido" }
    ];

    const saludo =
        hora < 12
            ? "Buenos días"
            : hora < 19
                ? "Buenas tardes"
                : "Buenas noches";

    const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString("es-ES", { month: "long" });
    const getRandomHealthQuote = () => {
        const randomIndex = Math.floor(Math.random() * healthQuotes.length);
        return healthQuotes[randomIndex];
    };

    const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);

    useEffect(() => {
        setQuote(getRandomHealthQuote());
    }, []);

    return (
        <div className="bienvenidaCard">
            <div className="topBienvenida">
                <div className="bienvenidaLeft">
                    <span className="saludo">{`${saludo},`}</span>
                    <span className="saludo">{nombre}</span>
                    <span className="fecha">{`Hoy es ${diaSemana}, ${dia} de ${mes}`}</span>
                </div>
                <div className="bienvenidaRight">
                    <IonImg src="EasyFarmaLogo.png" className="logoImgPrincipal"></IonImg>
                </div>
            </div>

            {quote && (
                <div className="motivationalQuote">
                    <p>“{quote.quote}”</p>
                    <span>– {quote.author}</span>
                </div>
            )}

        </div>
    );
};


const soporteData: SoporteTelefonicoCard[] = [
    {
      icon: callOutline,
      title: "Atención al Cliente",
      phone: "900123456",
      description: "Resuelve tus dudas administrativas",
    },
    {
      icon: medkitOutline,
      title: "Ambulancia Urgente",
      phone: "112",
      description: "Emergencias médicas inmediatas",
    },
    {
      icon: shieldCheckmarkOutline,
      title: "Seguro Médico",
      phone: "902765432",
      description: "Contacta con tu aseguradora",
    },
    {
      icon: informationCircleOutline,
      title: "Soporte Farmacéutico",
      phone: "911223344",
      description: "Consulta sobre tratamientos y medicación",
    },
  ];
  
  const SoporteTelefonico: React.FC = () => (
    <div className="soporteTelefonoGrid">
      {soporteData.map((item, index) => (
        <a key={index} className="telefonoCard" href={`tel:${item.phone}`}>
          <IonIcon icon={item.icon} size="large" />
          <div className="telefonoInfo">
            <h4>{item.title}</h4>
            {item.description && <p>{item.description}</p>}
            <span>{item.phone}</span>
          </div>
        </a>
      ))}
    </div>
  );


export default PaginaPrincipal;