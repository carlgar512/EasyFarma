export interface ModalPasswordCheckProps{
    isOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    dni: string;
    onSuccess: () => void;
 }