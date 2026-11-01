import { Router } from 'express';
import { getMedications, placeOrder, getMyOrders } from '../controllers/pharmacy.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.get('/medications', authenticateUser, getMedications);
router.post('/orders', authenticateUser, placeOrder);
router.get('/my-orders', authenticateUser, getMyOrders);

export default router;
