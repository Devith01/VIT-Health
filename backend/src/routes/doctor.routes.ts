import { Router } from 'express';
import { submitDiagnosis, getAiFeedbackStats } from '../controllers/doctor.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/diagnosis', authenticateUser, authorizeRoles('DOCTOR', 'ADMIN'), submitDiagnosis);
router.get('/ai-accuracy', authenticateUser, getAiFeedbackStats);

export default router;
