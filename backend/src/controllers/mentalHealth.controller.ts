import { Response } from 'express';
import { MentalHealthService } from '../services/mentalHealth.service.js';
import { submitMentalHealthSchema } from '../validators/mentalHealth.validator.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const submitScreening = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const validatedInput = submitMentalHealthSchema.parse(req.body);
    const screening = await MentalHealthService.submitScreening(validatedInput, req.user.userId);

    return res.status(201).json({
      status: 'success',
      message: 'Mental health screening submitted confidentially',
      data: { screening },
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};
