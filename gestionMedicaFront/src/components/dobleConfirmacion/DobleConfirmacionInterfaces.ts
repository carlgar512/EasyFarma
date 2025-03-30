export interface DobleConfirmacionProps {
    isOpen: boolean;
    title?: string;
    message: string;
    img: string;
    onConfirm: () => void;
    onCancel: () => void;
}