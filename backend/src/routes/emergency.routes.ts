import { Router } from 'express';
import { 
  createEmergency, 
  getActiveEmergencies, 
  updateAmbulanceLocation,
  getNotificationLogs,
  retryNotification,
  triggerTestNotification,
  dispatchAmbulance,
} from '../controllers/emergency.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.post('/report', authenticateUser, createEmergency);
router.post('/dispatch', authenticateUser, dispatchAmbulance);
router.get('/active', authenticateUser, getActiveEmergencies);
router.patch('/ambulances/:id/location', authenticateUser, updateAmbulanceLocation);

// Notification Logs & Test Mode Routes
router.get('/notification-logs', authenticateUser, getNotificationLogs);
router.post('/notification-logs/:id/retry', authenticateUser, retryNotification);
router.post('/test-notification', authenticateUser, triggerTestNotification);

export default router;
