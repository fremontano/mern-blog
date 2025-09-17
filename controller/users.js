import bcrypt from 'bcryptjs';

import User from '../model/User.js';
import generateToken from '../utils/generateToken.js';

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
    const user = await User.findById(id).populate('post').select('-password');

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
    const users = await User.find({});

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

export {
  register,
  login,
  getProfile,
  blockUser,
  listUsers,
  unBlockUser
};
