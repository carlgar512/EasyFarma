import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonSearchbar, IonTitle } from "@ionic/react";
import React from "react";
import { useRef, useState } from "react";
import './SelectConBuscador.css'
import { closeCircleOutline } from "ionicons/icons";
import { SelectConBuscadorProps } from "./SelectConBuscadorInterfaces";

/**
 * Componente SelectConBuscador
 *
 * Componente personalizado de selección con búsqueda, basado en Ionic.
 * 
 * Permite al usuario seleccionar un valor de una lista, con la posibilidad de filtrar los resultados
 * mediante un campo de búsqueda insensible a acentos. El valor seleccionado se muestra en un IonItem
 * y puede eliminarse mediante un icono de borrado.
 *
 * Al hacer clic en el elemento principal, se abre un modal con un buscador y una lista de opciones
 * que pueden ser filtradas dinámicamente. La selección de un valor actualiza el estado externo 
 * a través de la función `onChange`.
 *
 * Props:
 * - `label`: Etiqueta que describe el campo.
 * - `placeholder`: Texto por defecto mostrado si no hay selección.
 * - `items`: Lista de opciones disponibles, cada una con `label` y `value`.
 * - `value`: Valor actualmente seleccionado.
 * - `onChange`: Callback invocado cuando se selecciona o limpia un valor.
 */
const SelectConBuscador: React.FC<SelectConBuscadorProps> = ({
    label,
    placeholder,
    items,
    value,
    onChange,
}) => {

    /**
     * VARIABLES
     */
    const modal = useRef<HTMLIonModalElement>(null);
    const [busqueda, setBusqueda] = useState("");

    const quitarAcentos = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");


    const seleccionada = items.find((opt) => opt.value === value);
    /**
     * FUNCIONALIDAD
     */
    const handleSeleccionar = (val: string) => {
        onChange(val);
        modal.current?.dismiss();
    };

    const opcionesFiltradas = items.filter((opt) =>
        quitarAcentos(opt.label.toLowerCase()).includes(
            quitarAcentos(busqueda.toLowerCase())
        )
    );

    /**
     * RENDER
     */
    return (
        <>
            <IonItem button onClick={() => modal.current?.present()} className="select-item">
                <label className="labelTittleSCB">{label}</label>
                <div slot="end" className="select-end-wrapper">
                    <div className="select-value">
                        {seleccionada?.label || placeholder || "Selecciona..."}
                    </div>
                    {value && (
                        <IonIcon
                            icon={closeCircleOutline}
                            size="large"
                            className="icono-borrar-seleccion"
                            onClick={(e) => {
                                e.stopPropagation(); // Evita que se abra el modal
                                onChange(""); // Vacía el valor
                            }}
                        />
                    )}
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