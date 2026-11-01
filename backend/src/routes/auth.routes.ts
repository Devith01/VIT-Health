import { Router } from 'express';
import { login, getMe, logout, signup, resetPassword, updateLocationAuth } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/update-location', updateLocationAuth);
router.get('/me', authenticateUser, getMe);
router.post('/logout', authenticateUser, logout);

export default router;
