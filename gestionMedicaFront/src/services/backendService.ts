// src/services/backendService.ts

import { CitaDTO, InfoUserDTO, LoginDTO, RegisterDTO } from "../shared/interfaces/frontDTO";
import { signInWithEmailAndPassword, updateEmail } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Asegúrate de que este path es correcto
import { MapaFiltrosResponse } from "../components/buscaMedico/BuscaMedicoInterfaces";

const BASE_URL = "http://localhost:5001/easyfarma-5ead7/us-central1";

/**
 * Registra un nuevo usuario en el backend y luego inicia sesión automáticamente.
 * Devuelve el usuario autenticado y su token.
 */
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

/**
 * Inicia sesión buscando primero el email por DNI y luego autentica con Firebase.
 * Devuelve el usuario y token si es exitoso.
 */
const login = async ({ dni, password }: LoginDTO) => {
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

/**
 * Inicia la recuperación de cuenta a partir del DNI.
 * Enmascara el email y envía un código de verificación.
 */
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

/**
 * Cambia la contraseña del usuario indicado por su DNI.
 * Envía la nueva contraseña al backend para actualizarla.
 */
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

/**
 * Verifica que el código introducido para un DNI sea correcto.
 * Se utiliza durante el flujo de recuperación de cuenta.
 */
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

/**
 * Da de baja al usuario identificado por su ID.
 * Marca su alta como finalizada en el sistema.
 */
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

/**
 * Obtiene la información completa del usuario desde el backend.
 * Se usa tras el login o para mantener sincronizado el estado.
 */
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

/**
 * Envía los datos actualizados del usuario al backend.
 * Utiliza PATCH para actualizar campos puntuales.
 */
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

/**
 * Actualiza el email del usuario en Firebase Authentication.
 * Solo funciona si hay un usuario autenticado actualmente.
 */
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

/**
 * Recupera la lista de alergias registradas de un usuario.
 * Se identifica al usuario por su ID.
 */
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

/**
 * Devuelve los tratamientos archivados de un usuario.
 * Llamado en vistas de historial médico o archivo.
 */
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

/**
 * Obtiene los tratamientos activos de un usuario.
 * Incluye tratamientos en curso no archivados.
 */
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

/**
 * Recupera tratamientos actuales en base a lógica de backend.
 * No finalizados.
 */
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

/**
 * Marca o desmarca un tratamiento como archivado.
 * Se envía el estado booleano junto al ID del tratamiento.
 */
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

/**
 * Obtiene todos los datos relacionados a un tratamiento.
 * Incluye detalles como médico, fecha, diagnóstico, etc.
 */
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

/**
 * Genera y envía por email un PDF cifrado con los datos del tratamiento.
 * El PDF está asociado al DNI del usuario y tratamiento solicitado.
 */
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

/**
 * Recupera los filtros disponibles para búsqueda de médicos.
 * Incluye centros, especialidades, mapa de relaciones y médicos.
 */
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

/**
 * Recupera todas las agendas médicas de un profesional por su ID.
 * Incluye información de fechas, horarios y disponibilidad.
 */
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

/**
 * Actualiza el estado de disponibilidad de un horario dentro de una agenda.
 * Se puede activar o desactivar una franja horaria específica.
 */
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

/**
 * Guarda una nueva cita médica para un usuario con un médico.
 * Incluye fecha, hora, estado y referencias de ambos usuarios.
 */
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

/**
 * Recupera las citas pendientes del usuario.
 * Filtra automáticamente por estado "Pendiente".
 */
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

/**
 * Devuelve las citas archivadas del usuario.
 * Usado para mostrar historial de citas pasadas.
 */
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

/**
 * Obtiene todas las citas no archivadas del usuario.
 * Incluye tanto pendientes como completadas y canceladas.
 */
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

/**
 * Actualiza la información de una cita específica.
 * Puede incluir una cancelación si `esCancelacion` es true.
 */
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

/**
 * Elimina una cita médica según su ID.
 * Se usa cuando el usuario quiere eliminar la reserva.
 */
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

/**
 * Obtiene información detallada del médico indicado.
 * Incluye centro, especialidad y datos personales.
 */
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

/**
 * Libera un horario previamente reservado para un médico.
 * Permite volver a hacer disponible esa franja.
 */
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

/**
 * Recupera los médicos con los que el usuario ha interactuado recientemente.
 * Se utiliza para mostrar sugerencias rápidas.
 */
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

/**
 * Crea una cuenta infantil vinculada a un tutor.
 * Recibe los datos mínimos del menor y el ID del tutor.
 */
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

/**
 * Devuelve los usuarios que están actualmente bajo la tutela de un tutor.
 * Se filtra por ID del tutor.
 */
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

/**
 * Recupera todos los tutores asignados a un usuario tutelado.
 * Se utiliza para validar vínculos activos.
 */
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

/**
 * Finaliza una tutela activa según su ID.
 * Marca la fecha de desvinculación en el sistema.
 */
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

/**
 * Consulta si existe una tutela activa entre un tutor y un tutelado.
 * Devuelve el objeto de tutela o null.
 */
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

/**
 * Verifica la identidad de un tutor mediante su DNI y tarjeta sanitaria.
 * Se utiliza antes de asignar una nueva tutela.
 */
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

/**
 * Guarda una nueva tutela entre un tutor y un tutelado.
 * Registra la fecha de vinculación actual.
 */
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

/**
 * Da de baja a un usuario infantil (tutelado) desde la cuenta del tutor.
 * Marca el alta del menor como inactiva.
 */
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
    return data;
};

/**
 * Verifica si un DNI ya está registrado en el sistema.
 * Retorna true si existe, false si es nuevo.
 */
const existeDNIRegistrado = async (dni: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/existeDNIRegistrado`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al verificar la existencia del DNI");
    }

    return data.existe;
};

/**
 * Solicita al backend el envío del correo de transición a cuenta adulta  
 * para un usuario tutelado que ha alcanzado la mayoría de edad.
 */
const enviarCorreoTransicion = async (
    usuario: any,
    usuarioTutelado: any
  ): Promise<void> => {
    const response = await fetch(`${BASE_URL}/sendTransitionEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, usuarioTutelado }),
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Error al enviar el correo de transición");
    }
  
    // Puedes mostrar un mensaje de éxito opcionalmente
    console.log("✅ Correo de transición enviado");
  };


  /**
 * Registra una nueva cuenta regular a partir de una cuenta infantil existente.  
 * Envía los datos al backend para validar y crear el usuario en Auth y Firestore.
 */
  const nuevaCuentaDesdeInfantil = async ({
    usuarioTutelado,
    email,
    dni,
    password,
  }: {
    usuarioTutelado: any;
    email: string;
    dni: string;
    password: string;
  }): Promise<{ success: boolean; uid?: string }> => {
    const response = await fetch(`${BASE_URL}/nuevaCuentaDesdeInfantil`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuarioTutelado, email, dni, password }),
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Error al registrar nueva cuenta.");
    }
  
    return {
      success: true,
      uid: data.uid,
    };
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
    bajaUsuarioComoTutelado,
    existeDNIRegistrado,
    enviarCorreoTransicion,
    nuevaCuentaDesdeInfantil
};

