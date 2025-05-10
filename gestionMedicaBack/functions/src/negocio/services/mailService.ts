import nodemailer from "nodemailer";
import { env } from "../../presentacion/config/env";
import path from "path";
import { Cita } from "../modelos/Cita";
import { Medico } from "../modelos/Medico";
import { Centro } from "../modelos/Centro";
import { Usuario } from "../modelos/Usuario";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
});


export const sendCodeToEmailService = async (email: string, code: string): Promise<void> => {
    const logoPath = path.resolve(process.cwd(), "assets/imgs/Logo.png");
    
    const info = await transporter.sendMail({
      from: `"EasyFarma Seguros" <${env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Tu código de verificación",
      text: `Tu código de verificación es: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f4f8;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
            
            <img src="cid:logo-easyfarma" alt="EasyFarma Logo" style="max-width: 160px; margin-bottom: 25px;" />
            
            <h2 style="color: #4CAF50; margin-bottom: 10px;">¡Hola!</h2>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Estás a un paso de verificar tu cuenta en <strong>EasyFarma Seguros</strong>.
            </p>
            
            <p style="font-size: 18px; color: #555; margin-bottom: 10px;">
              Tu código de verificación es:
            </p>
            
            <div style="font-size: 28px; font-weight: bold; color: #ffffff; background-color: #4CAF50; padding: 12px 25px; border-radius: 8px; display: inline-block; letter-spacing: 2px;">
              ${code}
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #888;">
              Si no solicitaste este código, puedes ignorar este correo de forma segura.
            </p>
            
            <p style="font-size: 14px; color: #aaa; margin-top: 40px;">
              Gracias,<br/>El equipo de EasyFarma
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo-easyfarma' // este ID se usa en el src del img
        }
      ]
    });
    console.log("📨 Código enviado:", info.messageId);
};


export const sendPdfToEmailService = async (email: string, pdfAbsolutePath: string): Promise<void> => {
  const logoPath = path.resolve(process.cwd(), "assets/imgs/Logo.png");

  const info = await transporter.sendMail({
    from: `"EasyFarma Seguros" <${env.EMAIL_USER}>`,
    to: email,
    subject: "📄 Tu documento de tratamiento",
    text: "Adjunto encontrarás tu PDF generado por EasyFarma.",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); text-align: center;">
          
          <img src="cid:logo-easyfarma" alt="EasyFarma Logo" style="max-width: 160px; margin-bottom: 25px;" />
          
          <h2 style="color: #375534;">¡Hola!</h2>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Te enviamos adjunto el documento de tratamiento generado desde <strong>EasyFarma Seguros</strong>.
          </p>

          <p style="font-size: 15px; color: #555; margin-top: 30px;">
            Este documento está protegido y puede contener información confidencial.
          </p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #888;">
            Si tienes alguna duda, no dudes en contactarnos.
          </p>

          <p style="font-size: 14px; color: #aaa; margin-top: 40px;">
            Saludos,<br/>El equipo de EasyFarma
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: "Tratamiento.pdf",
        path: pdfAbsolutePath,
        contentType: "application/pdf"
      },
      {
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo-easyfarma'
      }
    ]
  });

  console.log("📨 PDF enviado:", info.messageId);
};

export const sendAppointmentConfirmationEmail = async (
  usuario : Usuario,
  cita: Cita,
  medico: Medico,
  centro: Centro,
): Promise<void> => {
  const logoPath = path.resolve(process.cwd(), "assets/imgs/Logo.png");

  const info = await transporter.sendMail({
    from: `"EasyFarma Seguros" <${env.EMAIL_USER}>`,
    to: usuario.getEmail(),
    subject: "📅 Confirmación de tu cita médica",
    text: `Tu cita ha sido registrada con éxito.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); text-align: center;">
          
          <img src="cid:logo-easyfarma" alt="EasyFarma Logo" style="max-width: 160px; margin-bottom: 25px;" />

          <h2 style="color: #375534;">¡Tu cita ha sido confirmada!</h2>

          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Estimado/a <strong>${usuario.getNombreUsuario()} ${usuario.getApellidosUsuario()}</strong>, tu cita ha sido registrada exitosamente.
          </p>

          <div style="text-align: left; font-size: 15px; color: #333; margin-top: 20px;">
            <p><strong>Fecha:</strong> ${cita.getFechaCita()}</p>
            <p><strong>Hora:</strong> ${cita.getHoraCita()}</p>
            <p><strong>Especialista:</strong> Dr./Dra. ${medico.getNombreMedico()} ${medico.getApellidosMedico()}</p>
            <p><strong>Centro médico:</strong> ${centro.getNombreCentro()}</p>
          </div>

          <p style="font-size: 15px; color: #555; margin-top: 30px;">
            Por favor, llega con al menos 10 minutos de antelación a tu cita.
          </p>

          <p style="font-size: 14px; color: #888; margin-top: 40px;">
            Si tienes alguna duda o necesitas reprogramar tu cita, contáctanos.
          </p>

          <p style="font-size: 14px; color: #aaa; margin-top: 40px;">
            Saludos,<br/>El equipo de EasyFarma
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo-easyfarma'
      }
    ]
  });

  console.log("📨 Email de cita enviado:", info.messageId);
};

export const sendAppointmentCancellationEmail = async (
  usuario: Usuario,
  cita: Cita,
  medico: Medico,
  centro: Centro,
): Promise<void> => {
  const logoPath = path.resolve(process.cwd(), "assets/imgs/Logo.png");

  const info = await transporter.sendMail({
    from: `"EasyFarma Seguros" <${env.EMAIL_USER}>`,
    to: usuario.getEmail(),
    subject: "❌ Cancelación de tu cita médica",
    text: `Tu cita ha sido cancelada correctamente.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); text-align: center;">

          <img src="cid:logo-easyfarma" alt="EasyFarma Logo" style="max-width: 160px; margin-bottom: 25px;" />

          <h2 style="color: #a33c3c;">Tu cita ha sido cancelada</h2>

          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Estimado/a <strong>${usuario.getNombreUsuario()} ${usuario.getApellidosUsuario()}</strong>, hemos cancelado tu cita médica según tu solicitud.
          </p>

          <div style="text-align: left; font-size: 15px; color: #333; margin-top: 20px;">
            <p><strong>Fecha original:</strong> ${cita.getFechaCita()}</p>
            <p><strong>Hora:</strong> ${cita.getHoraCita()}</p>
            <p><strong>Especialista:</strong> Dr./Dra. ${medico.getNombreMedico()} ${medico.getApellidosMedico()}</p>
            <p><strong>Centro médico:</strong> ${centro.getNombreCentro()}</p>
          </div>

          <p style="font-size: 15px; color: #555; margin-top: 30px;">
            Lamentamos que no puedas asistir. Si deseas reprogramar tu cita, estaremos encantados de ayudarte.
          </p>

          <p style="font-size: 14px; color: #888; margin-top: 40px;">
            Si esta cancelación fue un error, por favor contáctanos lo antes posible.
          </p>

          <p style="font-size: 14px; color: #aaa; margin-top: 40px;">
            Saludos,<br/>El equipo de EasyFarma
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo-easyfarma'
      }
    ]
  });

  console.log("📨 Email de cancelación enviado:", info.messageId);
};
