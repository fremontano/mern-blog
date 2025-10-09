import express from 'express';
import isLogging from '../middleware/isLoggin.js';
import { blockUser, followingUser, forgotPassword, getProfile, listUsers, login, register, resetPassword, unBlockUser, unFollowingUser, userToViews } from '../controller/users.js';

const router = express.Router();

// Definimos la rutas 
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken',resetPassword );
router.get('/profile/:id', isLogging, getProfile);
router.get('/', listUsers);
router.put('/block/:userIdBlock', isLogging, blockUser);
router.put('/unblock/:userIdUnblock', isLogging, unBlockUser);
router.put('/profile-view/:userProfileId', isLogging, userToViews);
router.put('/following/:userToFollowId', isLogging, followingUser);
router.put('/unfollowing/:userToUnFollowId', isLogging, unFollowingUser);

// Exportamos el router para usarlo en app.js
export default router;