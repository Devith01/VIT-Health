import { Router } from 'express';
import { getProfile, getDashboardStats, updateLocation } from '../controllers/user.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticateUser, getProfile);
router.get('/dashboard-stats', authenticateUser, getDashboardStats);
router.patch('/location', authenticateUser, updateLocation);

export default router;
