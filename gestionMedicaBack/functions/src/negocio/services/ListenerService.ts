import { deleteExpirationCode } from "../../persistencia/repositorios/expirationCodeDAO";
import { eventBus } from "../../serviciosComunes/event/event-emiter";
import { sendCodeToEmail } from "./mailService";



eventBus.on('send.verification.code', async ({ email, code }) => {
  try {
    await sendCodeToEmail(email, code);
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

