export interface NotificationToastProps {
    icon: string;
    color: string;
    message: string;
    show: boolean;
    onClose: () => void;
}