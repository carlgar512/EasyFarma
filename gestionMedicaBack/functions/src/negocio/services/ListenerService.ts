import { deleteExpirationCode } from "../../persistencia/repositorios/expirationCodeDAO";
import { eventBus } from "../../serviciosComunes/event/event-emiter";
import { Centro } from "../modelos/Centro";
import { Cita } from "../modelos/Cita";
import { Medico } from "../modelos/Medico";
import { Usuario } from "../modelos/Usuario";
import { sendAppointmentCancellationEmail, sendAppointmentConfirmationEmail, sendCodeToEmailService, sendPdfToEmailService, sendTransitionEmail } from "./mailService";
import fs from "fs";



eventBus.on('send.verification.code', async ({ email, code }) => {
  try {
    await sendCodeToEmailService(email, code);
    console.log(`📧 Código enviado a ${email}`);
  } catch (err) {
    console.error(`❌ Error enviando código a ${email}:`, err);
  }
});

// Escuchar el evento de borrado
eventBus.on('schedule.deletion', async (data: { dni: string, expiresAt: Date }) => {
  const { dni, expiresAt } = data;
  console.log(expiresAt);
  console.log(`Evento recibido para el DNI: ${dni}, expiración en: ${expiresAt.toISOString()}`);
  // Usamos setTimeout directamente con expiresAt
  const now = Date.now();
  
  // Si expiresAt es en el futuro, se ejecuta el borrado en ese momento
  if (expiresAt.getTime() > now) {
    console.log(`🕐 Programado para borrar el código de expiración para el DNI: ${dni} a las ${expiresAt.toISOString()}`);
    setTimeout(async () => {
      console.log(`🗑️ Borrando código de expiración para el DNI: ${dni} en la fecha de expiración ${expiresAt.toISOString()}`);
      await deleteExpirationCode(dni);
    }, expiresAt.getTime() - now); // Programamos la ejecución con la diferencia exacta hasta expiresAt
  } else {
    console.log(`⚠️ El código de expiración para el DNI: ${dni} ya ha expirado, borrado inmediato.`);
    await deleteExpirationCode(dni);  // Si la expiración ya pasó, borramos de inmediato
  }
});

eventBus.on("send.tratamiento.pdf", async ({ email, pdfPath }: { email: string; pdfPath: string }) => {
  try {
    await sendPdfToEmailService(email, pdfPath);
    console.log(`📧 PDF de tratamiento enviado a ${email}`);

    // Borrar el archivo temporal después del envío
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
      console.log(`🗑️ Archivo temporal eliminado: ${pdfPath}`);
    }
  } catch (err) {
    console.error(`❌ Error enviando el PDF a ${email}:`, err);
  }
});

eventBus.on("send.cita.confirmation",
async ({
    usuario,
    cita,
    medico,
    centro,
  }: {
    usuario: Usuario;
    cita: Cita;
    medico: Medico;
    centro: Centro;
  }) => {
    try {
      await sendAppointmentConfirmationEmail(usuario, cita, medico, centro);
      console.log(`📧 Email de confirmación de cita enviado a ${usuario.getEmail()}`);
    } catch (err) {
      console.error(`❌ Error enviando el email de cita a ${usuario.getEmail()}:`, err);
    }
  }
);

eventBus.on(
  "send.cita.cancelacion",
  async ({
    usuario,
    cita,
    medico,
    centro,
  }: {
    usuario: Usuario;
    cita: Cita;
    medico: Medico;
    centro: Centro;
  }) => {
    try {
      await sendAppointmentCancellationEmail(usuario, cita, medico, centro);
      console.log(`📧 Email de cancelación de cita enviado a ${usuario.getEmail()}`);
    } catch (err) {
      console.error(`❌ Error enviando el email de cancelación a ${usuario.getEmail()}:`, err);
    }
  }
);

eventBus.on("send.cuenta.transicion", async ({ usuarioTutelado, tutor }) => {
  try {
    await sendTransitionEmail(usuarioTutelado, tutor);
    console.log(`📧 Email de transición enviado a ${tutor.getEmail()}`);
  } catch (err) {
    console.error("❌ Error enviando email de transición:", err);
  }
});
