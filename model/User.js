import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    accoutVerificationToken: {
      type: String,
    },
    accoutVerificationExpires: {
      type: Date,
    },

    //  Rol y permisos
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Niveles de cuenta o membresia
    accountLevel: {
      type: String,
      enum: ['bronze', 'silver', 'gold'],
      default: 'bronze',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    biography: String,
    location: String,
    notificationPreferences: {
      //Otra notificacion mas. (sms)
      email: { type: Boolean, default: true },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'prefer not to say', 'no-binary'],
    },

    // Relaciones con otros usuarios

    // Guarda los IDs de los usuarios que han visto el perfils
    profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Guarda los IDs de los seguidores
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Guarda los IDs de los usuarios bloqueados
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Relaciones con publicaciones
    // Publicaciones creadas por el usuario, referencia con Post array cantidad de posts
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    // Publicaciones que el usuario ha marcado con "me gusta"
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },
  {
    //  Agrega automaticamente los campos createdAt y updatedAt
    timestamps: true,
  }
);

//Generate password,  reset token
userSchema.methods.generatePasswordResetToken = function () {
  // Genera un token aleatorio de 20 bytes y lo convierte a formato hexadecimal
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //asignarse a passwordResetExpires
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos

  // Devuelve el token sin cifrar, que se enviará por email
  return resetToken;
};



// Compilamos el esquema en un modelo para poder usarlo en el proyecto
const User = mongoose.model('User', userSchema);
// Exportamos el modelo para poder importarlo en rutas o controladores
export default User