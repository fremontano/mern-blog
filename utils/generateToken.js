import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
  // Crear el payload
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role, 
  };

  // Firmar el token con la clave secreta
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h', 
  });
  
  return token;
};

export default generateToken;
