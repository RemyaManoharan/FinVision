import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validation';

const router = express.Router();

router.post('/register', validateRegistration, UserController.register);
router.post('/login', validateLogin, UserController.login);
router.get('/profile', authenticateJWT, UserController.getProfile);
router.put('/profile', authenticateJWT, UserController.updateProfile);

export default router;