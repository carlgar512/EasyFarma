export interface RegisterDTO {
  name: string;
  lastName: string;
  dni: string;
  email: string;
  tlf: string;
  dateNac: string;
  password: string;
}

export interface LoginDTO {
  dni: string;
  password: string;
}

export interface InfoUserDTO {
  uid: string;
  dni: string;
  email: string;
  nombreUsuario: string;
  apellidosUsuario: string;
  fechaNacimiento: string;
  telefono: string;
  direccion: string;
  numTarjeta: string;
  modoAccesibilidad: boolean;
  medicosFavoritos: string[];
  operacionesFavoritas: string[];
  tipoUsuario: string;
}

export interface AltaClienteDTO {
  fechaAlta: string;
  fechaBaja: string;
  idUsuario: string;
}

export type GetUserInfoResponse = {
  success: boolean;
  data: {
    userData: InfoUserDTO;
    altaCliente: AltaClienteDTO;
  };
  error?: string;
};