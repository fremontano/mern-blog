import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configura el transporte
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 587,
  secure: false,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia un correo
 * @param {string} to - Correo del destinatario
 * @param {string} username - Nombre del usuario
 * @param {string} [resetToken] - Token opcional para restablecer contraseña
 */
const sendEmail = async (to, username, resetToken = null) => {
  try {
    let html;
    let subject;
    let text;

    if (resetToken) {
      // Correo para restablecer contraseña
      subject = 'Restablecer tu contraseña';
      text = `Hola ${username}, usa este enlace para restablecer tu contraseña: http://localhost:8082/reset-password/${resetToken}`;
      html = `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h1 style="color: #4CAF50;">Restablece tu contraseña</h1>
          <p>Hola <strong>${username}</strong>, haz clic en el botón para restablecer tu contraseña.</p>
          <a href="http://localhost:8082/reset-password/${resetToken}" 
             style="display:inline-block; padding:10px 20px; margin-top:15px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
             Restablecer Contraseña
          </a>
          <p style="margin-top:20px; font-size:12px; color:#888;">Si no solicitaste este cambio, ignora este correo.</p>
        </div>
      `;
    } else {
      // Correo de bienvenida
      subject = 'Bienvenido a Mi Blog';
      text = `Hola ${username}, gracias por registrarte en Mi Blog.`;
      html = `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h1 style="color: #4CAF50;">¡Bienvenido a Mi Blog!</h1>
          <p>Hola <strong>${username}</strong>, gracias por registrarte en nuestro blog.</p>
          <p>Explora publicaciones, comenta y comparte tu contenido favorito.</p>
          <a href="http://localhost:8082/users/login" 
             style="display:inline-block; padding:10px 20px; margin-top:15px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
             Iniciar Sesión
          </a>
          <p style="margin-top:20px; font-size:12px; color:#888;">Si no creaste esta cuenta, ignora este correo.</p>
        </div>
      `;
    }

    const info = await transporter.sendMail({
      from: `'Tu Blog' <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    return info;

  } catch (error) {
    console.error('Error enviando correo: ', error);
    throw error;
  }
};

export default sendEmail;
