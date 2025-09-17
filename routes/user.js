import express from 'express';
import isLogging from '../middleware/isLoggin.js';
import { blockUser, getProfile, listUsers, login, register, unBlockUser } from '../controller/users.js';

const router = express.Router();

// Definimos la rutas 
router.post('/register', register);
router.post('/login', login );
router.get('/profile/:id',isLogging, getProfile);
router.get('/', listUsers);
router.put('/block/:userIdBlock',isLogging, blockUser );
router.put('/unblock/:userIdUnblock',isLogging, unBlockUser );

// Exportamos el router para usarlo en app.js
export default router;