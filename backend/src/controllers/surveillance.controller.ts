import { Response } from 'express';
import { SurveillanceService } from '../services/surveillance.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getSurveillanceSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const summary = await SurveillanceService.getSurveillanceSummary();
    return res.status(200).json({ status: 'success', data: summary });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getClusters = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clusters = await SurveillanceService.detectClusters();
    return res.status(200).json({ status: 'success', data: { clusters } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};
