// middleware/isLoggin.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isLogging = (req, res, next) => {
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Acceso denegado. No se encontró token.'
      });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'fail',
          message: 'Token inválido o expirado'
        });
      }

      // Guardamos el usuario decodificado para usarlo en los controladores
      req.userAuth = decoded;
      next();
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export default isLogging;
