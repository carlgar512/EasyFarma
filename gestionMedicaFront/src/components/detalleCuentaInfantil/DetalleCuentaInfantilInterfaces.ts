import { InfoUserDTO } from "../../shared/interfaces/frontDTO";

export interface DetalleCuentaInfantilProps{
    usuario: InfoUserDTO;
}

export interface TutorCardProps {
    tutor: InfoUserDTO;
    tutelado: InfoUserDTO;
    setLoading: (value: boolean) => void;
  }

export interface NuevoTutorProps {
  isOpen: boolean;
  onClose: () => void;
  idTutelado: string;
  setLoading: (value: boolean) => void;

}