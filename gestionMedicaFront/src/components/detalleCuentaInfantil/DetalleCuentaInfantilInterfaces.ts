import { InfoUserDTO } from "../../shared/interfaces/frontDTO";

export interface DetalleCuentaInfantilProps{
    usuario: InfoUserDTO;
}

export interface TutorCardProps {
    tutor: InfoUserDTO;
    tutelado: InfoUserDTO;
  }

export interface NuevoTutorProps {
  isOpen: boolean;
  onClose: () => void;
}