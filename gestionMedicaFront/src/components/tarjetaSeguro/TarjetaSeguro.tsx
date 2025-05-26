import React, { useEffect, useState } from "react";
import MainHeader from "../mainHeader/MainHeader";
import { IonButton, IonContent, IonIcon, IonImg, IonModal, IonPage, IonSpinner } from "@ionic/react";
import SideMenu from "../sideMenu/SideMenu";
import MainFooter from "../mainFooter/MainFooter";
import './TarjetaSeguro.css'
import { arrowBackOutline, cardOutline, qrCodeOutline } from "ionicons/icons";
import { CardProps } from "./TarjetaSeguroInterfaces";
import { QRCodeSVG } from 'qrcode.react';
import { useUser } from "../../context/UserContext"; // ajustá la ruta si es necesario


/**
 * Componente principal `TarjetaSeguro`
 *
 * Este componente representa la vista de la tarjeta del asegurado.
 * Su función principal es mostrar al usuario los datos básicos de su seguro,
 * tales como nombre, fecha de alta y número de tarjeta.
 * 
 * Además, incluye funcionalidades para:
 * - Visualizar un diseño gráfico de la tarjeta personalizada.
 * - Generar y mostrar un código QR con el número de tarjeta del asegurado.
 * - Permitir la navegación de regreso a la pantalla anterior.
 * 
 * Si los datos del usuario o de alta no están disponibles, se presenta un
 * spinner de carga con un mensaje informativo.
 */
const TarjetaSeguro: React.FC = () => {

    /**
     * VARIABLES
     */
    const { userData, altaClienteData } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    /**
     * FUNCIONALIDAD
     */
    const formatearFecha = (fechaTexto: string): string => {
        const fecha = new Date(fechaTexto);

        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // +1 porque enero = 0
        const anio = fecha.getFullYear();

        return `${dia} / ${mes} / ${anio}`;
    };

    const handleGenerarQR = () => {
        setIsOpen(true);
    };

    const handleVolver = () => {
        window.history.back();
    };

    /**
     * RENDER
     */
    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <MainHeader tittle="Mi perfil & preferencias" />
                {userData && altaClienteData ? (
                    <IonContent fullscreen className="contentTA">
                        <div className="contentTACentral">
                            <div className="titleContainerTA">
                                <IonIcon
                                    className="iconOperation"
                                    slot="icon-only"
                                    icon={cardOutline}
                                    size="large"
                                />
                                <span className="tittleTextTA">Tarjeta del asegurado</span>
                            </div>
                            <Card
                                name={userData.nombreUsuario + " " + userData.apellidosUsuario}
                                dateInit={formatearFecha(altaClienteData.fechaAlta)}
                                numTarjeta={userData.numTarjeta}
                            />
                            <div className="buttonContainerCredit">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="cardButton1"
                                    onClick={handleGenerarQR}
                                >
                                    <IonIcon slot="start" icon={qrCodeOutline}></IonIcon>
                                    <span className="buttonTextCredit">Generar código QR</span>
                                </IonButton>

                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="cardButton2"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextCredit">Volver</span>
                                </IonButton>
                            </div>
                        </div>
                        <IonModal isOpen={isOpen}>
                            <IonContent className="ion-padding">
                                <div className="modalContent">
                                    <div className="tittleContainerModal">
                                        <IonIcon size="large" slot="start" icon={qrCodeOutline}></IonIcon>
                                        <span className="modalText">
                                            Escanear este código para la verificar la tarjeta del asegurado.
                                        </span>
                                    </div>

                                    <QRCodeSVG value={userData.numTarjeta} size={250} />
                                    <IonButton
                                        expand="full"
                                        shape="round"
                                        className="cardButton2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cerrar
                                    </IonButton>
                                </div>
                            </IonContent>
                        </IonModal>
                    </IonContent>
                ) : (
                    <IonContent fullscreen className="contentTA">
                        <div className="contentTACentralTC">
                            <div className="spinnerContainerTC">
                                <IonSpinner className="spinner" name="circular"></IonSpinner>
                                <span className="textSpinner">Cargando su información. Un momento, por favor...</span>
                            </div>
                            <div className="buttonContainerCredit">
                                <IonButton
                                    size="large"
                                    expand="full"
                                    shape="round"
                                    className="cardButton2"
                                    onClick={handleVolver}
                                >
                                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                                    <span className="buttonTextCredit">Volver</span>
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                )}
                <MainFooter />
            </IonPage>
        </>

    );
};

/**
 * Componente `Card`
 *
 * Este subcomponente se encarga de representar gráficamente la tarjeta de seguro
 * del usuario. Su diseño imita una tarjeta física, incluyendo detalles como:
 * - Nombre completo del asegurado.
 * - Fecha de alta del seguro.
 * - Número de tarjeta asociado.
 * - Iconografía decorativa (chip, contacto NFC y logotipo institucional).
 * 
 * Recibe las siguientes propiedades:
 * - `name`: Nombre y apellidos del usuario.
 * - `dateInit`: Fecha de inicio del seguro, en formato 'DD / MM / AAAA'.
 * - `numTarjeta`: Número identificativo de la tarjeta del usuario.
 */
const Card: React.FC<CardProps> = ({ name, dateInit, numTarjeta }) => {

    /**
    * RENDER
    */
    return (
        <div className="creditCard">
            <span className="heading">EASYFARMA</span>
            <svg version="1.1" className="chip" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30px"
                height="30px" viewBox="0 0 50 50">
                <image id="image0" width="50" height="50" x="0" y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
              AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOY
              fEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSW
              ekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GS
              e0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOW
              ekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bf
              u3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWua
              fUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1
              lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrb
              tnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOh
              g0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU
              /f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dE
              orDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2Ng
              GAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVg
              OkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3d
              I2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6a
              lKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkI
              JVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0F
              qBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM
              1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGm
              BSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCET
              amiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdC
              S24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpj
              cmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIw
              MjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAy
              LTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg=="/>
            </svg>
            <svg version="1.1" className="contactless" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                width="20px" height="20px" viewBox="0 0 50 50">
                <image id="image0" width="50" height="50" x="0" y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
              AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
              cwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQf
              lGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/F
              fPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xN
              GQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49it
              VoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJk
              HpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15z
              bkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6g
              DJBZbyXifJXr7FZjGXsdxADxI7HUJFB6iWvsIhFpkoiIiGTJfjJfiCuJg2ZEspq9EHGVpYgzKqwJ
              qSAOEwuJQ/pxPvE3cYltJCLdxBLiSKKIE5HxJKcTRNeadxfhDiuYw44zVs1dxKwRk/uCxIiQkxKB
              sSctRVAge9g1E15EHE6yRUaJecRxcWlukdRIbGFOSZCMWQA/iWauIP3slREHXPyliqBcrrD71Amz
              Z+rD1Mt2Yr8TZc/UR4/YtFnbijnHi3UrN9vKQ9rPaJf867ZiaqDB+czeKYmd3pNa6fuI75MiC0uX
              XSR5aEMf7s7a6r/PudVXkjFb/SsrCRfROk0Fx6+H1i9kkTGn/E1vEmt1m089fh+RKdQ5O+xNJPUi
              cUIjO0Dm7HwvErEr0YxeibL1StSh37STafE4I7zcBdRq1DiOkdmlTJVnkQTBTS7X1FYyvfO4piaI
              nKbDCDaT2anLudYXCRFsQBgAcIF2/Okwgvz5+Z4tsw118dzruvIvjhTB+HOuWy8UvovEH6beitBK
              xDyxm9MmISKCWrzB7bSlaqGlsf0FC0gMjzTg6GgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDIt
              MTNUMDg6MTk6NTYrMDA6MDCjlq7LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTEzVDA4OjE5
              OjU2KzAwOjAw0ssWdwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xM1QwODoxOTo1Nisw
              MDowMIXeN6gAAAAASUVORK5CYII="/>
            </svg>

            <span className="number">{numTarjeta}</span>
            <span className="valid_thru">VIGENTE DESDE</span>
            <span className="dateCard">{dateInit}</span>
            <span className="name">{name}</span>
            <IonImg src="EasyFarmaLogo.png" className="imgCreditCard" />
        </div>

    );
};

export default TarjetaSeguro;