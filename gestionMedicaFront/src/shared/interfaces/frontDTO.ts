export interface RegisterDTO {
    name: string;
    lastName: string;
    dni: string;
    email: string;
    dateNac: string;
    password: string;
  }
  
export interface LoginDTO {
    dni: string;
    password: string;
  }
  