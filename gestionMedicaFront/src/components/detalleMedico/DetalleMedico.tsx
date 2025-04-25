import { Redirect, useLocation } from "react-router-dom";
import { DetalleMedicoProps } from "./DetalleMedicoInterfaces";
import React from "react";
import { CentroDTO, EspecialidadDTO, MedicoDTO } from "../../shared/interfaces/frontDTO";


const DetalleMedicoWrapper: React.FC = () => {
    const location = useLocation<{
        medico: MedicoDTO;
        centro: CentroDTO;
        especialidad: EspecialidadDTO;
    }>();

    const { medico, centro, especialidad } = location.state || {};

    if (!medico || !centro || !especialidad) {
        // 🔙 Si no hay datos, redirigimos
        return <Redirect to="/treatment-history" />;
    }

    return <DetalleMedico medico={medico} centro={centro} especialidad={especialidad} />;
};

const DetalleMedico: React.FC<DetalleMedicoProps> = ({ medico, centro, especialidad }) => {
    return (
        <>Hola</>
    );
}

export default DetalleMedicoWrapper;