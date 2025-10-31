import express from 'express';
import isLogging from '../middleware/isLoggin.js';
import { accountVerificationEmail, blockUser, followingUser, forgotPassword, getFeedPosts, getProfile, listUsers, login, register, resetPassword, unBlockUser, unFollowingUser, userToViews, verifyAccountEmail } from '../controller/users.js';

import upload from '../middleware/multer.js';

const router = express.Router();

// Definimos la rutas 
router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);
router.get('/feed', isLogging, getFeedPosts);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.get('/profile/:id', isLogging, getProfile);
router.put('/account-verification', isLogging, accountVerificationEmail);
router.get('/account-verification/:verifyToken', verifyAccountEmail);
router.get('/', listUsers);
router.put('/block/:userIdBlock', isLogging, blockUser);
router.put('/unblock/:userIdUnblock', isLogging, unBlockUser);
router.put('/profile-view/:userProfileId', isLogging, userToViews);
router.put('/following/:userToFollowId', isLogging, followingUser);
router.put('/unfollowing/:userToUnFollowId', isLogging, unFollowingUser);

// Exportamos el router para usarlo en app.js
export default router;