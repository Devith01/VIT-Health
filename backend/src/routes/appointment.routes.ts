import { Router } from 'express';
import { getDoctors, bookAppointment, getMyAppointments, cancelAppointment } from '../controllers/appointment.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.get('/doctors', authenticateUser, getDoctors);
router.post('/book', authenticateUser, bookAppointment);
router.get('/my-appointments', authenticateUser, getMyAppointments);
router.patch('/:id/cancel', authenticateUser, cancelAppointment);

export default router;
