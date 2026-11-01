import { Response } from 'express';
import { ThresholdService } from '../services/threshold.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getThresholds = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const thresholds = await ThresholdService.getThresholds();
    return res.status(200).json({ status: 'success', data: { thresholds } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const forecastOutbreak = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, location } = req.query;
    const forecast = await ThresholdService.forecastOutbreak(category as string, location as string);
    return res.status(200).json({ status: 'success', data: { forecast } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};
