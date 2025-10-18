import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import User from '../model/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import sendAccountVerificationTokenEmail from '../utils/sendEmailAccount.js';

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'El usuario ya existe' });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    return res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente',
      // _id: newUser._id,
      // username: newUser.username,
      // email: newUser.email,
      // role: newUser.role,
      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Credenciales inválidas',
      });
    }

    // Comparar contraseñas
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({
        status: 'fail',
        message: 'Credenciales inválidas',
      });
    }

    // Actualizar ultimo login
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Login exitoso',
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: 'posts',           // el array de posts del usuario
      populate: {              // popular la categoría de cada post
        path: 'category',
        select: 'name'
      }
    })
      .select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Perfil encontrado',
      user
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
      .populate({
        path: 'posts',
        populate: { path: 'category', select: 'name' },
      });

    if (users.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Usuarios no encontrados'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Lista de usuarios',
      users
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

//Bloquear user
const blockUser = async (req, res) => {
  try {
    const userIdBlock = req.params.userIdBlock; // Usuario a bloquear
    const userToBlock = await User.findById(userIdBlock);

    if (!userToBlock) {
      return res.status(404).json({
        status: 'fail',
        message: 'Usuario no encontrado'
      });
    }

    const userBlockingId = req.userAuth._id; // Usuario quien bloquea
    if (userIdBlock === userBlockingId.toString()) {
      return res.status(400).json({
        status: 'fail',
        message: 'No puedes bloquearte a ti mismo'
      });
    }

    const currentUser = await User.findById(userBlockingId); // Quien bloquea
    if (currentUser.blockedUsers.includes(userIdBlock)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Usuario ya esta bloqueado'
      });
    }

    currentUser.blockedUsers.push(userIdBlock);
    await currentUser.save();

    return res.status(200).json({
      status: 'success',
      message: 'Usuario bloqueado correctamente',
      blockedUsers: currentUser.blockedUsers
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Desbloquear usuario
const unBlockUser = async (req, res) => {
  try {
    const userIdUnblock = req.params.userIdUnblock;
    const userToUnblock = await User.findById(userIdUnblock);

    if (!userToUnblock) {
      return res.status(404).json({
        status: 'fail',
        message: 'Usuario no encontrado para desbloquear'
      });
    }

    const userUnBlockingId = req.userAuth._id;
    if (userIdUnblock === userUnBlockingId.toString()) {
      return res.status(400).json({
        status: 'fail',
        message: 'No puedes desbloquearte a ti mismo'
      });
    }

    const currentUser = await User.findById(userUnBlockingId);
    if (!currentUser.blockedUsers.includes(userIdUnblock)) {
      return res.status(400).json({
        status: 'fail',
        message: 'El usuario no está bloqueado'
      });
    }

    // Remover el usuario del array blockedUsers
    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      id => id.toString() !== userIdUnblock
    );
    await currentUser.save();

    return res.status(200).json({
      status: 'success',
      message: 'Usuario desbloqueado correctamente',
      blockedUsers: currentUser.blockedUsers
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Quien vio mi Perfil
const userToViews = async (req, res) => {
  try {
    const userProfileId = req.params.userProfileId;
    const userProfile = await User.findById(userProfileId);

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    const currentUserId = req.userAuth._id;

    // Verificar si el usuario ya vio el perfil
    if (userProfile.profileViewers.includes(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Ya has visto este perfil',
      });
    }

    // Agregar el ID del usuario actual al perfil visitado
    userProfile.profileViewers.push(currentUserId);
    await userProfile.save();

    return res.status(200).json({
      success: true,
      message: 'Perfil visto correctamente',
      data: userProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//Seguir a un usuario
const followingUser = async (req, res) => {
  try {
    // El usuario actual autenticado (extraido del token)
    const currentUserId = req.userAuth._id;
    // El usuario que queremos seguir (recibido como parametro en la URL)
    const userToFollowId = req.params.userToFollowId;

    // Evitar que un usuario se siga a si mismo
    if (currentUserId.toString() === userToFollowId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'El usuario no debe seguirse a sí mismo',
      });
    }

    // Agregar al usuario actual el ID del que está siguiendo
    const updatedCurrentUser = await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userToFollowId }
    }, { new: true });

    // Agregar al usuario objetivo el ID del seguidor
    const updatedFollowedUser = await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { followers: currentUserId }
    }, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Siguiendo usuario con éxito',
      updatedCurrentUser,
      updatedFollowedUser

    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const unFollowingUser = async (req, res) => {
  try {
    const currentUserId = req.userAuth._id;
    const userToUnFollowId = req.params.userToUnFollowId;

    if (currentUserId.toString() === userToUnFollowId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'No puedes dejar de seguirte a ti mismo',
      });
    }

    // Quitar al usuario objetivo del arreglo 'following' del usuario actual
    const updatedCurrentUser = await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: userToUnFollowId } },
      { new: true }
    );

    // Quitar al usuario actual del arreglo 'followers' del usuario objetivo
    const updatedFollowedUser = await User.findByIdAndUpdate(
      userToUnFollowId,
      { $pull: { followers: currentUserId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Usuario dejado de seguir con éxito',
      updatedCurrentUser,
      updatedFollowedUser
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Enviar token 
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(400).json({
        success: false,
        message: 'El email no está registrado en nuestro sistema',
      });
    }

    // Reset Token
    const resetToken = await userFound.generateAccountVerificationToken();
    await userFound.save();

    // Enviar Email (ahora con nombre y token correctos)
    await sendEmail(userFound.email, userFound.username, resetToken);

    return res.status(200).json({
      success: true,
      message: 'Correo para restablecer la contraseña enviado correctamente',
      userFound
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    // Convertir token recibido a hash (igual que el almacenado)
    const cryptoToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    //Buscar usuario con ese token y verificar que no este vencido
    const userFound = await User.findOne({
      passwordResetToken: cryptoToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!userFound) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado.',
      });
    }

    // Actualizar Password
    const salt = await bcrypt.genSalt(10);
    userFound.password = await bcrypt.hash(password, salt);

    //Limpiar el token para que no se pueda reutilizar
    userFound.passwordResetToken = undefined;
    userFound.passwordResetExpires = undefined;

    //Guardar cambios en la base de datos
    await userFound.save();

    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente',
      userFound
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//Enviar correo de verificación
const accountVerificationEmail = async (req, res) => {
  try {
    const foundUser = await User.findById(req.userAuth._id);
    if (!foundUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Usuario no encontrado.' });
    }

    const token = foundUser.generateAccountVerificationToken();
    await foundUser.save();

    // 👇 Aquí asegúrate que la función reciba el link completo
    const verifyURL = `http://localhost:8082/api/v1/users/account-verification-email/${token}`;
    await sendAccountVerificationTokenEmail(
      foundUser.email,
      foundUser.username,
      verifyURL
    );

    res.status(200).json({
      success: true,
      message: 'Correo de verificación enviado correctamente.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Verificar cuenta por token
const verifyAccountEmail = async (req, res) => {
  try {
    const { verifyToken } = req.params;

    const cryptoToken = crypto
      .createHash('sha256')
      .update(verifyToken)
      .digest('hex');

    const user = await User.findOne({
      accountVerificationToken: cryptoToken,
      accountVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Error al verificar la cuenta: token inválido o expirado.',
      });
    }

    user.isVerified = true;
    user.accountVerificationToken = undefined;
    user.accountVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cuenta verificada correctamente.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export {
  register,
  login,
  resetPassword,
  forgotPassword,
  verifyAccountEmail,
  accountVerificationEmail,
  getProfile,
  blockUser,
  listUsers,
  unBlockUser,
  userToViews,
  followingUser,
  unFollowingUser
};
