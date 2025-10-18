import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAccountVerificationTokenEmail = async (to, username, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h1 style="color: #4CAF50;">Verifica tu cuenta</h1>
        <p>Hola <strong>${username}</strong>, gracias por registrarte en nuestro blog.</p>
        <p>Haz clic en el siguiente botón para verificar tu cuenta:</p>
        <a href="${verificationUrl}" 
           style="display:inline-block; padding:10px 20px; margin-top:15px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
           Verificar Cuenta
        </a>
        <p style="margin-top:20px; font-size:12px; color:#888;">Este enlace expirará en 10 minutos.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `'Tu Blog' <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verifica tu cuenta',
      html,
    });

    console.log('Correo de verificación enviado: ', info.messageId);
  } catch (error) {
    console.error('Error enviando correo de verificación:', error);
    throw error;
  }
};

export default sendAccountVerificationTokenEmail;
