import User from "../model/User.js";

const checkAccountVerified = async (req, res, next) => {
  try {
    // Buscar el usuario autenticado
    const user = await User.findById(req.userAuth._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // si la cuenta esta verificada
    if (user.isVerified) {
      return next(); // continua a la siguiente funcion
    }

    // Si no esta verificada
    return res.status(401).json({
      success: false,
      message: 'Tu cuenta no está verificada. Por favor verifica tu correo.'
    });

  } catch (error) {
    console.error('Error en checkAccountVerified:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

export default checkAccountVerified;
