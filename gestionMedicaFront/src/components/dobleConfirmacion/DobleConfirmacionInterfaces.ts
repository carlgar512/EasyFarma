export interface DobleConfirmacionProps {
    isOpen: boolean;
    tittle: string;
    message: string;
    img: string;
    onConfirm: () => void;
    onCancel: () => void;
}