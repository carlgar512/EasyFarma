import { Operation } from "../../shared/interfaces/Operation";

export interface OperationCardProps {
    operation: Operation;
}

export interface SoporteTelefonicoCard {
    icon: string;
    title: string;
    phone: string;
    description?: string;
  }