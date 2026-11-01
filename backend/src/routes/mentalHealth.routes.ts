import { Router } from 'express';
import { submitScreening } from '../controllers/mentalHealth.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.post('/screen', authenticateUser, submitScreening);

export default router;
