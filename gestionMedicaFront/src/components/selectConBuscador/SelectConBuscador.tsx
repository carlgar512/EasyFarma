import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonSearchbar, IonTitle } from "@ionic/react";
import React from "react";
import { useRef, useState } from "react";
import './SelectConBuscador.css'
import { closeCircleOutline } from "ionicons/icons";


const SelectConBuscador: React.FC<SelectConBuscadorProps> = ({
    label,
    placeholder,
    items,
    value,
    onChange,
}) => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [busqueda, setBusqueda] = useState("");

    const quitarAcentos = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");


    const seleccionada = items.find((opt) => opt.value === value);

    const handleSeleccionar = (val: string) => {
        onChange(val);
        modal.current?.dismiss();
    };

    const opcionesFiltradas = items.filter((opt) =>
        quitarAcentos(opt.label.toLowerCase()).includes(
            quitarAcentos(busqueda.toLowerCase())
        )
    );

    return (
        <>
            <IonItem button onClick={() => modal.current?.present()} className="select-item">
                <label className="labelTittleSCB">{label}</label>
                <div slot="end" className="select-value">
                    {seleccionada?.label || placeholder || "Selecciona..."}
                </div>
            </IonItem>

            <IonModal ref={modal}>
                <IonHeader className="select-modal-header">
                    <div className="topSectionSCBHeader">
                    <IonTitle className="select-modal-title">{label}</IonTitle>
                        <IonButton
                            className="select-close-button"
                            onClick={() => modal.current?.dismiss()}
                        >
                            <span className="buttonCloseTextSCB">Cerrar</span>
                        </IonButton>
                    </div>
                    <div className="bottomSectionSCBHeader">
                    <IonSearchbar
                        className="select-searchbar"
                        placeholder="Buscar..."
                        value={busqueda}
                        onIonInput={(e) => setBusqueda(e.detail.value!)}
                    />
                    </div>
                  
                </IonHeader>

                <IonContent>
                    <IonList className="select-options-list">
                        {opcionesFiltradas.map((opt) => (
                            <IonItem
                                key={opt.value}
                                button
                                className="select-option-item"
                                onClick={() => handleSeleccionar(opt.value)}
                            >
                                {opt.label}
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    );
};

export default SelectConBuscador;