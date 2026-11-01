import { Response } from 'express';
import { PharmacyService } from '../services/pharmacy.service.js';
import { placeMedicineOrderSchema } from '../validators/pharmacy.validator.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getMedications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const medications = await PharmacyService.getMedications();
    return res.status(200).json({ status: 'success', data: { medications } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const placeOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const validatedInput = placeMedicineOrderSchema.parse(req.body);
    const order = await PharmacyService.placeOrder(validatedInput, req.user.userId);

    return res.status(201).json({
      status: 'success',
      message: 'Medicine order placed successfully',
      data: { order },
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const orders = await PharmacyService.getMyOrders(req.user.userId);
    return res.status(200).json({ status: 'success', data: { orders } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};
