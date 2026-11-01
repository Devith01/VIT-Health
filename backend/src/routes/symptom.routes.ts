import { Router } from 'express';
import { getQuestions, submitReport, getReportById } from '../controllers/symptom.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.get('/questions', authenticateUser, getQuestions);
router.post('/reports', authenticateUser, submitReport);
router.get('/reports/:id', authenticateUser, getReportById);

export default router;
