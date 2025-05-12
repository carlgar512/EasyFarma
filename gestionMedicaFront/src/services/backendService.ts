// src/services/backendService.ts

import { CitaDTO, InfoUserDTO, LoginDTO, RegisterDTO } from "../shared/interfaces/frontDTO";
import { signInWithEmailAndPassword, updateEmail } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Asegúrate de que este path es correcto
import { MapaFiltrosResponse } from "../components/buscaMedico/BuscaMedicoInterfaces";

const BASE_URL = "http://localhost:5001/easyfarma-5ead7/us-central1";


const register = async (userData: RegisterDTO) => {
    try {
        // 1. Registro en backend
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                error: data.error || "Error al registrar usuario",
            };
        }

        // 2. Autenticación automática
        const userCredential = await signInWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );

        // 3. Obtener token
        const token = await userCredential.user.getIdToken();

        // 4. Devolver info útil
        return {
            success: true,
            user: userCredential.user,
            token,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Error inesperado durante el registro",
        };
    }
};



export const login = async ({ dni, password }: LoginDTO) => {
    try {
        // 1. Obtener el email asociado al DNI
        const res = await fetch(`${BASE_URL}/getEmailByDni?dni=${dni}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                error: data.error || "No se pudo obtener el email asociado al DNI",
            };
        }

        const email = data.email;
        // 2. Hacer login con Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        // 3. Devolver la info relevante
        return {
            success: true,
            user: userCredential.user,
            token,
        };

    } catch (error: any) {
        return {
            success: false,
            error: error?.message || "Error al iniciar sesión",
        };
    }
};

const recoveryRequest = async (dni: string) => {
    const response = await fetch(`${BASE_URL}/recoveryRequest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error en la busqueda de cuenta");
    }
    return data;
};

const passwordReset = async (dni: string, password: string) => {
    const response = await fetch(`${BASE_URL}/passwordReset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al restablecer contraseña");
    }
    return data;
};

const checkCode = async (dni: string, code: string) => {
    const response = await fetch(`${BASE_URL}/checkCode`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni, code }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al verificar código");
    }
    return data;
};

const deactivateUser = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/bajaUsuario`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idUsuario }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al dar de baja");
    }
    return data;
};

const getUserInfo = async (idUsuario: string) => {
    try {
        const res = await fetch(`${BASE_URL}/getUserInfo?idUsuario=${idUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            return {
                success: false,
                error: data.error || "No se pudo obtener la información del usuario.",
            };
        }

        return {
            success: true,
            ...data,
        };

    } catch (error: any) {
        return {
            success: false,
            error: error?.message || "Error al obtener información del usuario.",
        };
    }
};

const updateUserInfo = async (updatedUser: InfoUserDTO) => {
    try {
        const res = await fetch(`${BASE_URL}/updateUserInfo`, {
            method: "PATCH", // sigue siendo PATCH, porque es una actualización
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser), // 👈 enviás el objeto completo
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            return {
                success: false,
                error: data.error || "No se pudo actualizar la información del usuario.",
            };
        }
        return {
            success: true,
            data: data.updatedUser, // opcional: lo que devuelva tu backend
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || "Error al actualizar información del usuario.",
        };
    }
};

const updateEmailFirebaseAuth = async (newEmail: string): Promise<void> => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No hay usuario autenticado.");
    }

    try {
        await updateEmail(user, newEmail);
        console.log("✅ Email actualizado correctamente.");
    } catch (error: any) {
        console.error("❌ Error al actualizar email:", error.message || error);
        throw new Error(error.message || "No se pudo actualizar el correo electrónico.");
    }
};


const getAlergias = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/getAlergias?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener alergias");
    }

    return data.alergias; // devolvemos directamente la lista
};

const getTratamientosArchivados = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/getTratamientosArchivados?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener tratamientos archivados");
    }

    return data.tratamientos;
};

const getTratamientosActivos = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/getTratamientosActivos?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener tratamientos activos");
    }

    return data.tratamientos;
};

const getTratamientosActuales = async (idUsuario: string) => {
    const response = await fetch(`${BASE_URL}/getTratamientosActuales?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener tratamientos actuales");
    }

    return data.tratamientos;
};

const updateArchivadoTratamiento = async (idTratamiento: string, nuevoEstado: boolean) => {
    const response = await fetch(`${BASE_URL}/updateArchivadoTratamiento`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idTratamiento, nuevoEstado }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al actualizar estado de archivado");
    }

    return data;
};

const getTratamientoCompleto = async (idTratamiento: string) => {
    const response = await fetch(`${BASE_URL}/obtenerTratamientoCompleto?idTratamiento=${idTratamiento}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    return data;
};

const generarPdfCifradoTratamiento = async (dni: string, idTratamiento: string) => {
    const response = await fetch(`${BASE_URL}/generarPdfCifradoTratamiento`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            dni,
            idTratamiento,
        }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al generar y enviar el PDF cifrado del tratamiento");
    }

    // Puedes retornar el mensaje para mostrarlo en una notificación
    return data;
};

const obtenerMapaFiltros = async (): Promise<MapaFiltrosResponse> => {
    const response = await fetch(`${BASE_URL}/mapaFiltros`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener el mapa de filtros");
    }

    return data.data; // contiene { mapa, medicos, centros, especialidades }
};

const obtenerAgendasMedico = async (idMedico: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/getAgendasMedico?idMedico=${idMedico}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener las agendas médicas del médico");
    }

    return data.agendas; // depende de cómo lo devuelvas en back, podría ser data.data.agendas
};

const actualizarHorariosAgenda = async (idAgenda: string, nuevoEstado: boolean, horarioActualizar: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/actualizarHorariosAgenda?idAgenda=${idAgenda}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nuevoEstado, horarioActualizar }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al actualizar los horarios de la agenda médica");
    }
};

const guardarCita = async (idUsuario: string, idMedico: string, fechaCita: string, horaCita: string): Promise<void> => {
    const citaData = {
        fechaCita,
        horaCita,
        estadoCita: "Pendiente", // Estado inicial
        archivado: false,         // No archivada al crearla
        idUsuario,
        idMedico
    };

    const response = await fetch(`${BASE_URL}/guardarCita`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(citaData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al guardar la cita");
    }
};


const getCitasActuales = async (idUsuario: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/obtenerCitasPendientesUsuario?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener las citas actuales");
    }

    return data.citas;
};

const getCitasArchivados = async (idUsuario: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/obtenerCitasArchivadasUsuario?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener las citas archivadas");
    }

    return data.citas;
};

const getCitasAll = async (idUsuario: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/obtenerCitasNoArchivadasUsuario?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener todas las citas");
    }

    return data.citas;
};

const actualizarCita = async (citaActualizada: CitaDTO, esCancelacion: boolean = false): Promise<void> => {
    const response = await fetch(`${BASE_URL}/actualizarCita?idCita=${citaActualizada.uid}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...citaActualizada, esCancelacion }), // 🔹 Incluye el flag
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al actualizar la cita");
    }
};

const eliminarCitaPorId = async (idCita: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/eliminarCitaPorId?idCita=${idCita}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al eliminar la cita");
    }
};

const obtenerInfoMedicoPorId = async (idMedico: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/getInfoMedico?idMedico=${idMedico}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener la información del médico");
    }

    return data.data; // Contiene: { medico, centro, especialidad }
};

const liberarHorario = async (idMedico: string, fecha: string, horario: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/liberarHorario`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idMedico, fecha, horario }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al liberar el horario");
    }
};

const obtenerMedicosRecientes = async (idUsuario: string): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/medicosRecientes?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener médicos recientes");
    }

    return data.data;
};

const crearCuentaInfantil = async (formData: {
    name: string;
    lastName: string;
    dni?: string;
    dateNac: string;
    email: string;
    tlf: string;
    idTutor: string;
}) => {
    const response = await fetch(`${BASE_URL}/registerChild`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok || !data?.success) {
        const message = data?.error || `Error ${response.status}: Error al crear cuenta infantil`;
        throw new Error(message);
    }

    return data.user;
};

const getUsuariosTutelados = async (idTutor: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/getUsuariosTutelados?idTutor=${idTutor}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Error al obtener los usuarios tutelados");
    }
  
    return data.data;
  };

  const getTutoresPorTutelado = async (idTutelado: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/getTutoresPorTutelado?idTutelado=${idTutelado}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Error al obtener los tutores del usuario tutelado");
    }
  
    return data.data;
  };

  const finalizarTutela = async (idTutela: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/finalizarTutela?idTutela=${idTutela}`, {
      method: "POST", // O "GET" si el handler lo permite, pero lo ideal es POST para una acción que modifica datos
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Error al finalizar la tutela");
    }
  };

  const getTutelaActivaEntreDos = async (idTutor: string, idTutelado: string): Promise<any | null> => {
    const response = await fetch(`${BASE_URL}/getTutelaActivaEntreDos?idTutor=${idTutor}&idTutelado=${idTutelado}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Error al obtener la tutela activa entre tutor y tutelado");
    }
  
    return data.data; // puede ser null o un objeto de tutela
  };


  const comprobarNuevoTutor = async (dni: string, tarjeta: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/comprobarNuevoTutor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dni, tarjeta }),
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Error al comprobar el tutor.");
    }
  
    return data.data; // Devuelve el usuario verificado
  };


  const guardarTutela = async (idTutor: string, idTutelado: string): Promise<void> => {
    const fechaVinculacion = new Date().toISOString();
  
    const body = [
      {
        idTutor,
        idTutelado,
        fechaVinculacion,
        fechaDesvinculacion: null,
      },
    ];
  
    const response = await fetch(`${BASE_URL}/guardarTutelas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Error al guardar la tutela");
    }
  };

  const bajaUsuarioComoTutelado = async (idUsuario: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/bajaUsuarioComoTutelado?idUsuario=${idUsuario}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Error al dar de baja al usuario como tutelado");
    }
  };
  

export const backendService = {
    register,
    login,
    recoveryRequest,
    passwordReset,
    checkCode,
    deactivateUser,
    getUserInfo,
    updateUserInfo,
    updateEmailFirebaseAuth,
    getAlergias,
    getTratamientosArchivados,
    getTratamientosActivos,
    getTratamientosActuales,
    updateArchivadoTratamiento,
    getTratamientoCompleto,
    generarPdfCifradoTratamiento,
    obtenerMapaFiltros,
    obtenerAgendasMedico,
    actualizarHorariosAgenda,
    guardarCita,
    getCitasActuales,
    getCitasArchivados,
    getCitasAll,
    actualizarCita,
    eliminarCitaPorId,
    obtenerInfoMedicoPorId,
    liberarHorario,
    obtenerMedicosRecientes,
    crearCuentaInfantil,
    getUsuariosTutelados,
    getTutoresPorTutelado,
    finalizarTutela,
    getTutelaActivaEntreDos,
    comprobarNuevoTutor,
    guardarTutela,
    bajaUsuarioComoTutelado
};

