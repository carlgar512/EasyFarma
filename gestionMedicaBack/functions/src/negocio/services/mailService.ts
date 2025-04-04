import nodemailer from "nodemailer";
import { env } from "../../presentacion/config/env";
import path from "path";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
});


export const sendCodeToEmail = async (email: string, code: string): Promise<void> => {
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
