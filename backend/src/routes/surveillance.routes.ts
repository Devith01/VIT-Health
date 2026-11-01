import { Router } from 'express';
import { getSurveillanceSummary, getClusters } from '../controllers/surveillance.controller.js';
import { getThresholds, forecastOutbreak } from '../controllers/threshold.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.get('/summary', authenticateUser, getSurveillanceSummary);
router.get('/clusters', authenticateUser, getClusters);
router.get('/thresholds', authenticateUser, getThresholds);
router.get('/forecasting', authenticateUser, forecastOutbreak);

export default router;
