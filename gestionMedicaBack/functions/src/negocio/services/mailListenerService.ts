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