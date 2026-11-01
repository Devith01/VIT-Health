import { Response } from 'express';
import { DoctorService } from '../services/doctor.service.js';
import { submitDiagnosisSchema } from '../validators/doctor.validator.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const submitDiagnosis = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const validatedInput = submitDiagnosisSchema.parse(req.body);
    const consultation = await DoctorService.submitDiagnosis(validatedInput, req.user.userId);

    return res.status(201).json({
      status: 'success',
      message: 'Consultation diagnosis recorded & AI evaluation feedback stored',
      data: { consultation },
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getAiFeedbackStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await DoctorService.getAiFeedbackStats();
    return res.status(200).json({ status: 'success', data: stats });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};
