export enum FormModeEnum {
    InsertDni = "insertDniMode",
    InsertCode = "insertCodeMode",
    NewPassword = "newPasswordMode",
    Loading = "spinnerLoader"
}

export interface VerificationCodeInputProps {
    length?: number;
    onComplete?: (code: string) => void;
}